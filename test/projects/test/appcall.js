import algosdk from "algosdk";

// 25-word mnemonic
const mnemonic25 =
  "album stuff arrest derive code situate anger marine nuclear three across extend awesome neutral cross clutch live social brief course online vacuum inform absorb flat";

// Recover account from mnemonic
const account = algosdk.mnemonicToSecretKey(mnemonic25);
console.log("Address:", account.addr);

// Algod client (TestNet in this example)
const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

// Replace with your deployed smart contract ID
const appId = 746501589;

// Define ABI contract spec for your TEALScript contract
const contract = new algosdk.ABIContract({
  name: "Test",
  methods: [
    {
      name: "hello",
      args: [{ type: "string", name: "name" }],
      returns: { type: "string" },
    },
  ],
});

async function callSmartContract() {
  try {
    const params = await algodClient.getTransactionParams().do();

    // Setup ATC
    const atc = new algosdk.AtomicTransactionComposer();
    const signer = algosdk.makeBasicAccountTransactionSigner(account);

    // Add ABI method call
    atc.addMethodCall({
      appID: appId,
      method: contract.getMethodByName("hello"),
      methodArgs: ["World"], // argument for hello(name)
      sender: account.addr,
      suggestedParams: params,
      signer,
    });

    // Execute and wait for confirmation
    const result = await atc.execute(algodClient, 4);

    console.log("Transaction ID:", result.txIDs[0]);
    console.log(
      "Confirmed in round:",
      result.confirmedRound
    );
    console.log(
      "Return value:",
      result.methodResults[0].returnValue // should be "Hello, World"
    );
  } catch (err) {
    console.error("Error calling smart contract:", err);
  }
}

callSmartContract();
