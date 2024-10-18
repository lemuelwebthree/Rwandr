import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.HTTP_PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  gasReporter: { enabled: true },
};

export default config;