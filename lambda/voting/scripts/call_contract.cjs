const Web3 = require("web3");
const fs = require("fs");
const env = require("dotenv");
const HDWalletProvider = require("@truffle/hdwallet-provider");

async function main() {
  const data = JSON.parse(
    fs.readFileSync(
      "../smart-contracts/artifacts/contracts/Voting.sol/Voting.json"
    )
  );
  const abi = data.abi;
  console.log(abi);
  const provider = new HDWalletProvider(
    "pioneer claw bone balance page empty lend rural tiny jazz auto walnut",
    "https://polygon-mumbai.g.alchemy.com/v2/v5uBYglgA_A2owjXkEZht2CHqYzRebAK"
  );
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(
    abi,
    "0x0f5186ab6e2e63aae8025d1ed2befa71f2ee34ef"
  );

  try {
    const signedTx = await web3.eth.accounts.signTransaction(
      {
        from: accounts[0],

        to: "0x0f5186ab6e2e63aae8025d1ed2befa71f2ee34ef",
        data: contract.methods
          .voteForCandidate(
            "0xe75a8e262762de69bef3d2bd90a2160424c761a83648866cc26c16fbd5626e91"
          )
          .encodeABI(),
        gas: 1000000,
        gasPrice: 1000000000,
      },
      "0x3b62ab0dac99123541d84b3f1dff27bb2f27f37e1ea25a2c0d7d32a771f4e64d"
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log(receipt);
  } catch (error) {
    console.log(error);
  }
}

main();
