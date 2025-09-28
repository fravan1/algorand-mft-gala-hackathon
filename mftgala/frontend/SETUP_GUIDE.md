# Enhanced Wrapper Functions Setup Guide

This guide will help you set up and test the enhanced wrapper functions for the MFT Gala smart contract.

## 🚀 Quick Setup

### Option 1: Use the Setup Script (Recommended)
```bash
# Run the setup script
./setup-env.sh

# Then run tests
npm run test:enhanced
```

### Option 2: Manual Environment Setup
```bash
# Set environment variables
export ALGOD_TOKEN=""
export ALGOD_SERVER="https://testnet-api.algonode.cloud"
export ALGOD_PORT="443"
export APP_ID="746531400"

# Verify setup
npm run test:check

# Run tests
npm run test:enhanced
```

### Option 3: Make Variables Persistent
Add these lines to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
export ALGOD_TOKEN=""
export ALGOD_SERVER="https://testnet-api.algonode.cloud"
export ALGOD_PORT="443"
export APP_ID="746531400"
```

## 📋 Available Test Commands

### Setup & Validation
```bash
npm run setup:env      # Environment setup guide
npm run test:check     # Validate current setup
```

### Complete Test Suite
```bash
npm run test:enhanced  # Run all enhanced wrapper tests
```

### Individual Function Tests
```bash
npm run test:insert    # Test insert asset complete
npm run test:buy 123    # Test buy asset with ID 123
npm run test:sell 123   # Test sell asset with ID 123
npm run test:royalty 123 # Test claim royalty with ID 123
npm run test:hype 123   # Test set hype price with ID 123
npm run test:info 123   # Test get asset info with ID 123
npm run test:existing 123 # Test all functions with existing asset ID 123
npm run test:quick      # Quick insert test
```

## 🔧 Environment Variables

### Setting up DEPLOYER_MNEMONIC (REQUIRED)

The `DEPLOYER_MNEMONIC` environment variable is required for smart contract interactions. Here's how to set it up:

#### Option 1: Create .env.local file (Recommended)
Create a `.env.local` file in your frontend directory with:
```bash
# Create the file
touch .env.local

# Add your mnemonic (replace with your actual mnemonic)
echo "DEPLOYER_MNEMONIC=your_actual_mnemonic_phrase_here" >> .env.local
```

#### Option 2: Set environment variable directly
```bash
export DEPLOYER_MNEMONIC="your_actual_mnemonic_phrase_here"
```

#### Option 3: Add to shell profile
Add to your `~/.zshrc` or `~/.bashrc`:
```bash
export DEPLOYER_MNEMONIC="your_actual_mnemonic_phrase_here"
```

### Required Variables
- `DEPLOYER_MNEMONIC` - Your account mnemonic phrase (REQUIRED - see setup above)
- `ALGOD_SERVER` - Algorand node server (default: https://testnet-api.algonode.cloud)
- `ALGOD_PORT` - Algorand node port (default: 443)
- `APP_ID` - Your smart contract app ID (default: 746531400)

### Optional Variables
- `ALGOD_TOKEN` - API token (empty for testnet)
- `DEPLOYER_ADDRESS` - Your account address
- `PUBLISHER_ADDRESS` - Publisher address for testing
- `BUYER_ADDRESS` - Buyer address for testing
- `SELLER_ADDRESS` - Seller address for testing
- `USER_ADDRESS` - User address for testing

## 🧪 What the Tests Validate

### 1. `insertAssetComplete()`
- ✅ Creates ASA (Algorand Standard Asset)
- ✅ Calls `insert_asset` smart contract function
- ✅ Transfers 20% of total supply value in ALGO to contract
- ✅ Transfers 100% of ASA tokens to contract

### 2. `buyAssetComplete()`
- ✅ Calls `buy` smart contract function
- ✅ Transfers 90% of payment to contract
- ✅ Transfers 10% of payment to publisher

### 3. `sellAssetComplete()`
- ✅ Calls `sell` smart contract function
- ✅ Transfers 100% of desired ASA amount to contract
- ✅ Contract automatically transfers equivalent ALGO to seller

### 4. `claimRoyaltyComplete()`
- ✅ Calls `claim_royalty` smart contract function
- ✅ Contract automatically transfers ALGO to user

### 5. `setHypePriceComplete()`
- ✅ Calls `set_hype_price` smart contract function

## 💡 Tips for Testing

1. **Use Testnet**: All tests run on testnet by default (no real ALGO required)
2. **Get Testnet ALGO**: Visit https://testnet.algoexplorer.io/dispenser
3. **Unique Asset IDs**: Each test creates unique asset IDs to avoid conflicts
4. **Transaction Fees**: Ensure your account has sufficient ALGO for transaction fees
5. **Network Connectivity**: Make sure you have internet connection for Algorand network

## 🐛 Troubleshooting

### Common Issues

1. **"Configuration validation failed"**
   - Run `npm run setup:env` to check current environment
   - Set missing environment variables

2. **"Transaction failed"**
   - Check your account has sufficient ALGO balance
   - Verify APP_ID is correct
   - Ensure network connectivity

3. **"ASA creation failed"**
   - Make sure asset ID is unique
   - Check you have sufficient ALGO for asset creation

4. **"Smart contract call failed"**
   - Verify contract is deployed
   - Check all parameters are correct
   - Ensure contract has required permissions

### Debug Mode

Enable detailed logging by modifying `testConfig.ts`:
```typescript
settings: {
  logLevel: 'debug', // Shows detailed transaction information
}
```

## 📊 Expected Test Output

```
🎯 Starting comprehensive test of enhanced wrapper functions...
📱 App ID: 746531400
🌐 Network: https://testnet-api.algonode.cloud

==================================================
📤 TEST 1: INSERT ASSET COMPLETE
==================================================
🚀 Testing insertAssetComplete...
Creating ASA...
ASA created with ID: 12345
Calling insert_asset...
Transferring 200000 microALGO to contract...
Transferring 1000 ASA tokens to contract...
✅ insertAssetComplete successful!
📊 Result: { success: true, asaId: 12345 }

... (more test results)

🎉 ALL ENHANCED WRAPPER TESTS COMPLETED SUCCESSFULLY!
```

## 🔄 Test Flow

1. **Insert Asset**: Creates new ASA and inserts into marketplace
2. **Get Asset Info**: Retrieves information about created asset
3. **Buy Asset**: Purchases tokens from marketplace
4. **Sell Asset**: Sells tokens back to marketplace
5. **Claim Royalty**: Claims royalty from held tokens
6. **Set Hype Price**: Updates asset's hype price

Each test validates both smart contract interaction and associated ALGO/ASA transfers.

## 📝 Next Steps

1. **Run Setup**: `./setup-env.sh` or set environment variables manually
2. **Validate**: `npm run test:check` to ensure everything is configured
3. **Test**: `npm run test:enhanced` to run all tests
4. **Debug**: Use individual test commands for specific function testing

Your enhanced wrapper functions are ready for comprehensive testing! 🎉
