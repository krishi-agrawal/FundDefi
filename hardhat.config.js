require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: './.env.local' });

// Sample Hardhat task. To learn how to create your own, visit https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Ensure that the required environment variables are loaded
const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: rpcUrl,
      accounts: [privateKey]
    }
  }
};
