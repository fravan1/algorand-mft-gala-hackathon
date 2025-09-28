import nacl from "tweetnacl";
import { sha512_256 } from "js-sha512";
import algosdk from "algosdk";
import bip39 from "bip39";

// Your 24-word Pera mnemonic
const mnemonic24 = "paste your 24 words here ...";

// Convert 24-word mnemonic to seed (bip39)
const seed = bip39.mnemonicToSeedSync(mnemonic24).slice(0, 32); // take first 32 bytes

// Convert seed to Algorand account key
const keyPair = nacl.sign.keyPair.fromSeed(seed);

// Generate 25-word mnemonic
const mnemonic25 = algosdk.secretKeyToMnemonic(keyPair.secretKey);

console.log("Address:", algosdk.encodeAddress(keyPair.publicKey));
console.log("25-word mnemonic:", mnemonic25);
