<div align="center">
    <img src="assets/Group 268 (1).png" height="120px"/>
    <h1> FundDefi - Decentralized Fundraiser DApp </h1>
</div>




FundDefi is a decentralized application (DApp) that enables users to create and manage fundraising campaigns on the Ethereum blockchain.

## 🚀 Features

- **Create Fundraising Campaigns**: Users can initiate campaigns by setting a target amount, category, and sharing their story.
- **Contribute Securely**: Contributors can donate ETH to campaigns directly through the DApp, with transactions recorded on the blockchain.
- **IPFS Storage**: Campaign stories and images are securely stored on IPFS using Pinata for decentralized and tamper-proof storage.
- **Responsive Design**: The DApp is optimized for all screen sizes, ensuring a seamless user experience on both desktop and mobile devices.

## 🛠️ Technology & Tools

- **Solidity**: The core of the DApp's smart contract logic is written in Solidity, the leading language for Ethereum smart contracts.
- **Hardhat**: A comprehensive development environment for compiling, deploying, and testing smart contracts.
- **Ethers.js**: A powerful library for interacting with the Ethereum blockchain and smart contracts from the frontend.
- **IPFS (Pinata)**: Decentralized file storage using IPFS, with Pinata providing a user-friendly interface for managing IPFS uploads.
- **Chai**: A BDD/TDD assertion library for testing smart contracts and ensuring reliable code.
- **Next.js**: A React framework for building fast and scalable web applications, serving as the frontend of the DApp.
- **TailwindCSS**: A utility-first CSS framework that ensures a modern and responsive design for the DApp.

## Preview
- **Landing Page**
  <img src="assets/Screenshot 2024-08-24 192202.png">
  <br/>
- **View Campaigns**
  <img src="assets/Screenshot 2024-08-24 185159.png">
  <br/>
- **Detailed Camapaign Page**
  <img src="assets/Screenshot 2024-08-24 192337.png">
  <img src="assets/Screenshot 2024-08-24 192429.png">

## Set up locally

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
    ```
   
2.  **Install dependencies**:
   ```bash
npm install
```

3. **Deploy the contract**:
   ```bash
    npx hardhat run scripts/deploy.js --network your-network ```

4. **Start the Next.js Frontend**:
   ```bash
    npm run dev```
5. Access the DApp: Open your browser and navigate to http://localhost:3000
