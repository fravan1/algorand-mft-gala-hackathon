import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { useWallet } from '@txnlab/use-wallet-react';

// Set up environment variables
process.env.ALGOD_SERVER = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
process.env.ALGOD_PORT = process.env.ALGOD_PORT || '443';

/**
 * Create a new ASA (Algorand Standard Asset) for MFTGala
 * This function uses the connected wallet as the signer
 */
export async function createMftGalaAsset(
  totalSupply: number,
  decimals: number,
  assetName: string,
  unitName: string,
  assetUrl: string,
  signer: any // Wallet signer from useWallet
): Promise<{ assetId: number; transaction: { txID: string } }> {
  try {
    const algorand = AlgorandClient.fromEnvironment();
    
    console.log(`🆕 Creating MFTGala asset: ${assetName} (${unitName})`);
    console.log(`   Total supply: ${totalSupply}`);
    console.log(`   Decimals: ${decimals}`);
    console.log(`   Asset URL: ${assetUrl}`);
    
    const createResult = await algorand.send.assetCreate({
      sender: signer,
      total: BigInt(totalSupply),
      decimals: decimals,
      defaultFrozen: false,
      manager: signer.address,
      reserve: signer.address,
      freeze: signer.address,
      clawback: signer.address,
      unitName: unitName,
      assetName: assetName,
      url: assetUrl,
    });
    
    console.log('✅ MFTGala asset created successfully!');
    console.log('Asset ID:', createResult.assetId);
    console.log('Transaction ID:', createResult.transaction.txID());
    
    return {
      assetId: Number(createResult.assetId),
      transaction: {
        txID: createResult.transaction.txID()
      }
    };
  } catch (error) {
    console.error('❌ Error creating MFTGala asset:', error);
    throw error;
  }
}

/**
 * Transfer ALGO tokens using connected wallet
 */
export async function transferAlgo(
  receiver: string,
  amount: number,
  signer: any // Wallet signer from useWallet
): Promise<{ transaction: { txID: string } }> {
  try {
    const algorand = AlgorandClient.fromEnvironment();
    
    console.log(`🔄 Transferring ${amount} ALGO to ${receiver}`);
    
    const result = await algorand.send.payment({
      sender: signer,
      receiver: receiver,
      amount: amount.algo(), // Convert to microALGO
    });
    
    console.log('✅ ALGO transfer successful!');
    console.log('Transaction ID:', result.transaction.txID());
    
    return {
      transaction: {
        txID: result.transaction.txID()
      }
    };
  } catch (error) {
    console.error('❌ Error transferring ALGO:', error);
    throw error;
  }
}

/**
 * Transfer ASA tokens using connected wallet
 */
export async function transferAsset(
  assetId: number,
  receiver: string,
  amount: number,
  signer: any // Wallet signer from useWallet
): Promise<{ transaction: { txID: string } }> {
  try {
    const algorand = AlgorandClient.fromEnvironment();
    
    console.log(`🔄 Transferring ${amount} units of asset ${assetId} to ${receiver}`);
    
    const transferResult = await algorand.send.assetTransfer({
      sender: signer,
      assetId: BigInt(assetId),
      receiver: receiver,
      amount: BigInt(amount),
    });
    
    console.log('✅ Asset transfer successful!');
    console.log('Transaction ID:', transferResult.transaction.txID());
    
    return {
      transaction: {
        txID: transferResult.transaction.txID()
      }
    };
  } catch (error) {
    console.error('❌ Error transferring asset:', error);
    throw error;
  }
}

/**
 * Complete insert asset flow for MFTGala
 * This function handles the full workflow:
 * 1. Create ASA
 * 2. Transfer ALGO seed to contract
 * 3. Transfer ASA tokens to contract
 * 4. Call smart contract insert_asset function
 */
export async function insertAssetComplete(
  assetId: number,
  totalSupply: number,
  basePrice: number,
  publisher: string,
  algoSeed: number,
  assetName: string,
  unitName: string,
  assetUrl: string,
  signer: any, // Wallet signer from useWallet
  appClient: any // Smart contract client
): Promise<{ success: boolean; asaId: number; transactions: string[] }> {
  try {
    console.log('🚀 Starting complete insert asset flow...');
    const transactions: string[] = [];
    
    // Step 1: Create the ASA
    console.log('📤 Creating ASA...');
    const asaResult = await createMftGalaAsset(
      totalSupply,
      6, // 6 decimals for most tokens
      assetName,
      unitName,
      assetUrl,
      signer
    );
    
    const asaId = asaResult.assetId;
    transactions.push(asaResult.transaction.txID);
    console.log(`✅ ASA created with ID: ${asaId}`);
    
    // Step 2: Transfer ALGO seed to contract (20% of total supply equivalent)
    const algoAmount = Math.floor(totalSupply * basePrice * 0.2 / 1000000);
    console.log(`💰 Transferring ${algoAmount} ALGO to contract as seed...`);
    
    const algoTransferResult = await transferAlgo(
      appClient.appAddress.toString(),
      algoAmount,
      signer
    );
    transactions.push(algoTransferResult.transaction.txID);
    console.log(`✅ ALGO transfer completed: ${algoTransferResult.transaction.txID}`);
    
    // Step 3: Transfer ASA tokens to contract
    console.log(`🔄 Transferring ${totalSupply} ASA tokens to contract...`);
    const assetTransferResult = await transferAsset(
      asaId,
      appClient.appAddress.toString(),
      totalSupply,
      signer
    );
    transactions.push(assetTransferResult.transaction.txID);
    console.log(`✅ ASA transfer completed: ${assetTransferResult.transaction.txID}`);
    
    // Step 4: Call insert_asset on smart contract
    console.log('📤 Calling insert_asset on smart contract...');
    const insertResult = await appClient.send.insertAsset({
      sender: signer,
      args: {
        assetId: BigInt(assetId),
        asaId: BigInt(asaId),
        totalSupply: BigInt(totalSupply),
        basePrice: BigInt(basePrice),
        publisher: publisher,
        algoSeed: BigInt(algoSeed),
      },
    });
    
    if (!insertResult.return) {
      throw new Error('Failed to insert asset into contract');
    }
    
    console.log('✅ Complete asset insertion workflow completed successfully!');
    console.log('📊 Summary:');
    console.log(`   ASA ID: ${asaId}`);
    console.log(`   ALGO transferred: ${algoAmount} ALGO`);
    console.log(`   ASA transferred: ${totalSupply} tokens`);
    console.log(`   Transactions: ${transactions.join(', ')}`);
    
    return { success: true, asaId: asaId, transactions };
    
  } catch (error) {
    console.error('❌ Error in insertAssetComplete:', error);
    throw error;
  }
}
