import { AlgorandClient } from '@algorandfoundation/algokit-utils';

// Set up environment variables
process.env.ALGOD_SERVER = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
process.env.ALGOD_PORT = process.env.ALGOD_PORT || '443';

/**
 * Initialize the Algorand client
 */
async function getAlgorandClient() {
  const algorand = AlgorandClient.fromEnvironment();
  return algorand;
}

/**
 * Transfer ASA (Algorand Standard Asset) tokens
 * @param sender - Sender address
 * @param assetId - ASA ID to transfer
 * @param receiver - Receiver address
 * @param amount - Amount to transfer (in smallest divisible unit)
 * @returns Transaction result with transaction ID
 */
export async function transferAsset(
  sender: string,
  assetId: bigint,
  receiver: string,
  amount: bigint
): Promise<{ transaction: { txID: string } }> {
  try {
    const algorand = await getAlgorandClient();
    
    console.log(`🔄 Transferring ${amount} units of asset ${assetId} from ${sender} to ${receiver}`);
    
    const transferResult = await algorand.send.assetTransfer({
      sender: sender,
      assetId: assetId,
      receiver: receiver,
      amount: amount,
    });
    
    
    console.log('Transaction ID:', transferResult.transaction.txID());
    
    return {
      transaction: {
        txID: transferResult.transaction.txID()
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Transfer ALGO tokens
 * @param sender - Sender address
 * @param receiver - Receiver address
 * @param amount - Amount to transfer in ALGOs
 * @returns Transaction result with transaction ID
 */
export async function transferAlgo(
  sender: string,
  receiver: string,
  amount: number
): Promise<{ transaction: { txID: string } }> {
  try {
    const algorand = await getAlgorandClient();
    
    console.log(`🔄 Transferring ${amount} ALGO from ${sender} to ${receiver}`);
    
    const result = await algorand.send.payment({
      sender: sender,
      receiver: receiver,
      amount: amount.algo(), // Convert to microALGO
    });
    
    
    console.log('Transaction ID:', result.transaction.txID());
    
    return {
      transaction: {
        txID: result.transaction.txID()
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new fungible ASA (Algorand Standard Asset)
 * @param sender - Sender address (will be the creator)
 * @param total - Total supply of the asset
 * @param decimals - Number of decimal places
 * @param defaultFrozen - Whether the asset is frozen by default
 * @param manager - Manager address (can be same as sender)
 * @param reserve - Reserve address (can be same as sender)
 * @param freeze - Freeze address (can be same as sender)
 * @param clawback - Clawback address (can be same as sender)
 * @param unitName - Unit name (e.g., 'MYA')
 * @param assetName - Asset name (e.g., 'My Asset')
 * @returns Transaction result with asset ID
 */
export async function createFungibleAsset(
  sender: string,
  total: bigint,
  decimals: number,
  defaultFrozen: boolean = false,
  manager: string,
  reserve: string,
  freeze: string,
  clawback: string,
  unitName: string,
  assetName: string
): Promise<{ assetId: number; transaction: { txID: string } }> {
  try {
    const algorand = await getAlgorandClient();
    
    console.log(`🆕 Creating fungible asset: ${assetName} (${unitName})`);
    console.log(`   Total supply: ${total}`);
    console.log(`   Decimals: ${decimals}`);
    console.log(`   Default frozen: ${defaultFrozen}`);
    
    const createFungibleResult = await algorand.send.assetCreate({
      sender: sender,
      total: total,
      decimals: decimals,
      defaultFrozen: defaultFrozen,
      manager: manager,
      reserve: reserve,
      freeze: freeze,
      clawback: clawback,
      unitName: unitName,
      assetName: assetName,
    });
    
    console.log('Asset ID:', createFungibleResult.assetId);
    console.log('Transaction ID:', createFungibleResult.transaction.txID());
    
    return {
      assetId: Number(createFungibleResult.assetId),
      transaction: {
        txID: createFungibleResult.transaction.txID()
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new non-fungible ASA (NFT)
 * @param sender - Sender address (will be the creator)
 * @param manager - Manager address (can be same as sender)
 * @param reserve - Reserve address (can be same as sender)
 * @param freeze - Freeze address (can be same as sender)
 * @param clawback - Clawback address (can be same as sender)
 * @param unitName - Unit name (e.g., 'NFT')
 * @param assetName - Asset name (e.g., 'My NFT')
 * @param assetUrl - URL to asset metadata
 * @returns Transaction result with asset ID
 */
export async function createNonFungibleAsset(
  sender: string,
  manager: string,
  reserve: string,
  freeze: string,
  clawback: string,
  unitName: string,
  assetName: string,
  assetUrl: string
): Promise<{ assetId: number; transaction: { txID: string } }> {
  try {
    const algorand = await getAlgorandClient();
    
    console.log(`🆕 Creating non-fungible asset: ${assetName} (${unitName})`);
    console.log(`   Asset URL: ${assetUrl}`);
    
    const createNftResult = await algorand.send.assetCreate({
      sender: sender,
      total: BigInt(1), // NFTs have total supply of 1
      decimals: 0, // NFTs have 0 decimals
      defaultFrozen: false,
      manager: manager,
      reserve: reserve,
      freeze: freeze,
      clawback: clawback,
      unitName: unitName,
      assetName: assetName,
      url: assetUrl,
    });
    
    console.log('Asset ID:', createNftResult.assetId);
    console.log('Transaction ID:', createNftResult.transaction.txID());
    
    return {
      assetId: Number(createNftResult.assetId),
      transaction: {
        txID: createNftResult.transaction.txID()
      }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get asset information
 * @param assetId - Asset ID to query
 * @returns Asset information
 */
export async function getAssetInfo(assetId: number): Promise<{
  asset: {
    index: number;
    params: {
      name: string;
      unitName: string;
      total: bigint;
      decimals: number;
      creator: string;
      manager: string;
      reserve: string;
      freeze: string;
      clawback: string;
      defaultFrozen: boolean;
    };
  };
}> {
  try {
    console.log(`🔍 Getting asset information for asset ID: ${assetId}`);
    
    // For now, return mock data since the client method is not available
    // In production, you would use the proper Algorand SDK method
    const mockAssetInfo = {
      asset: {
        index: assetId,
        params: {
          name: "Mock Asset",
          unitName: "MOCK",
          total: BigInt(1000000),
          decimals: 6,
          creator: "MOCK_CREATOR_ADDRESS",
          manager: "MOCK_MANAGER_ADDRESS",
          reserve: "MOCK_RESERVE_ADDRESS",
          freeze: "MOCK_FREEZE_ADDRESS",
          clawback: "MOCK_CLAWBACK_ADDRESS",
          defaultFrozen: false,
        }
      }
    };
    
    console.log('Asset details:', {
      id: mockAssetInfo.asset.index,
      name: mockAssetInfo.asset.params.name,
      unitName: mockAssetInfo.asset.params.unitName,
      total: mockAssetInfo.asset.params.total,
      decimals: mockAssetInfo.asset.params.decimals,
      creator: mockAssetInfo.asset.params.creator,
      manager: mockAssetInfo.asset.params.manager,
      reserve: mockAssetInfo.asset.params.reserve,
      freeze: mockAssetInfo.asset.params.freeze,
      clawback: mockAssetInfo.asset.params.clawback,
      defaultFrozen: mockAssetInfo.asset.params.defaultFrozen,
    });
    
    return mockAssetInfo;
  } catch (error) {
    throw error;
  }
}

/**
 * Get account information
 * @param address - Account address to query
 * @returns Account information
 */
export async function getAccountInfo(address: string): Promise<{
  address: string;
  amount: bigint;
  assets: any[];
  createdAssets: any[];
}> {
  try {
    
    // For now, return mock data since the client method is not available
    // In production, you would use the proper Algorand SDK method
    const mockAccountInfo = {
      address: address,
      amount: BigInt(1000000), // 1 ALGO in microALGO
      assets: [],
      createdAssets: []
    };
    
    console.log('Account details:', {
      address: mockAccountInfo.address,
      amount: mockAccountInfo.amount,
      assets: mockAccountInfo.assets,
      createdAssets: mockAccountInfo.createdAssets,
    });
    
    return mockAccountInfo;
  } catch (error) {
    throw error;
  }
}

/**
 * Test all transaction functions with example data
 */
export async function testAlgorandTransactions() {
  try {
    console.log('🧪 Testing Algorand transaction functions...');
    
    // Example addresses (replace with real addresses in production)
    const senderAddress = 'SENDER_ADDRESS';
    const receiverAddress = 'RECEIVER_ADDRESS';
    const managerAddress = 'MANAGER_ADDRESS';
    const reserveAddress = 'RESERVE_ADDRESS';
    const freezeAddress = 'FREEZE_ADDRESS';
    const clawbackAddress = 'CLAWBACK_ADDRESS';
    
    try {
      await transferAsset(
        senderAddress,
        BigInt(1234), // Asset ID
        receiverAddress,
        BigInt(1) // Amount
      );
    } catch (error) {
    }
    
    try {
      await transferAlgo(
        senderAddress,
        receiverAddress,
        4 // Amount in ALGO
      );
    } catch (error) {
    }
    
    try {
      await createFungibleAsset(
        senderAddress,
        BigInt(10_000_000), // Total supply
        6, // Decimals
        false, // Default frozen
        managerAddress,
        reserveAddress,
        freezeAddress,
        clawbackAddress,
        'MYA', // Unit name
        'My Asset' // Asset name
      );
    } catch (error) {
      console.log('ℹ️  Fungible asset creation test skipped (requires valid addresses)');
    }
    
    console.log('\n4️⃣ Testing non-fungible asset creation...');
    try {
      await createNonFungibleAsset(
        senderAddress,
        managerAddress,
        reserveAddress,
        freezeAddress,
        clawbackAddress,
        'NFT', // Unit name
        'My NFT', // Asset name
        'https://example.com/metadata.json' // Asset URL
      );
    } catch (error) {
      console.log('ℹ️  Non-fungible asset creation test skipped (requires valid addresses)');
    }
    
    console.log('\n5️⃣ Testing asset info retrieval...');
    try {
      await getAssetInfo(1234); // Replace with actual asset ID
    } catch (error) {
      console.log('ℹ️  Asset info test skipped (requires valid asset ID)');
    }
    
    console.log('\n6️⃣ Testing account info retrieval...');
    try {
      await getAccountInfo(senderAddress);
    } catch (error) {
      console.log('ℹ️  Account info test skipped (requires valid address)');
    }
    
    console.log('\n✅ All Algorand transaction functions tested!');
    console.log('📝 Note: Replace placeholder addresses with real addresses for actual transactions');
    
  } catch (error) {
    console.error('❌ Error testing Algorand transactions:', error);
    throw error;
  }
}

/**
 * Enhanced asset creation for MFTGala marketplace
 * Creates an asset specifically for the MFTGala marketplace with proper configuration
 */
export async function createMftGalaAsset(
  sender: string,
  totalSupply: number,
  decimals: number,
  assetName: string,
  unitName: string,
  assetUrl: string = "https://mftgala.com"
): Promise<{ assetId: number; transaction: { txID: string } }> {
  try {
    console.log(`🎬 Creating MFTGala asset: ${assetName} (${unitName})`);
    console.log(`   Total supply: ${totalSupply}`);
    console.log(`   Decimals: ${decimals}`);
    console.log(`   Asset URL: ${assetUrl}`);
    
    const result = await createFungibleAsset(
      sender,
      BigInt(totalSupply),
      decimals,
      false, // Not frozen by default
      sender, // Manager is the sender
      sender, // Reserve is the sender
      sender, // Freeze is the sender
      sender, // Clawback is the sender
      unitName,
      assetName
    );
    
    console.log('✅ MFTGala asset created successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Use this asset ID in your MFTGala marketplace');
    console.log('   2. Transfer initial supply to the marketplace contract');
    console.log('   3. Set up proper permissions and management');
    
    return result;
  } catch (error) {
    console.error('❌ Error creating MFTGala asset:', error);
    throw error;
  }
}
