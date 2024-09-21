## Overview

This project is a **Pay-As-You-Go Electricity dApp**, a decentralized application designed to streamline the process of topping up electricity credits and deducting credits based on usage through IoT meters. Built on the **Arbitrum Sepolia** network for low transaction fees, the solution leverages smart contract technology to bring transparency, efficiency, and decentralization to the electricity payment process.

The project consists of:
- A **Solidity smart contract** deployed on Arbitrum Sepolia.
- A **React frontend** integrated with the contract for user interaction.
- A **Rust Stylus version** of the contract, demonstrating compatibility with Rust-based blockchains.

## Key Features

1. **User Registration**: Users can be registered by the contract owner, and this ensures only authorized users can interact with the dApp.
2. **IoT Meter Registration**: IoT meters must be registered to deduct credits, providing a secure and verifiable process.
3. **Top-Up**: Registered users can top up their electricity credits, which are stored securely on the blockchain.
4. **Electricity Usage Deduction**: Registered IoT meters can deduct electricity credits based on the user's consumption.
5. **Owner-Only Withdrawal**: The contract owner has the exclusive ability to withdraw the balance of the contract.

## Importance of Blockchain

The Pay-As-You-Go model, traditionally reliant on centralized utilities, becomes significantly more transparent and trustless when moved to the blockchain. Key blockchain benefits for this solution:
- **Decentralization**: Eliminates reliance on a central authority, improving trust and reducing corruption.
- **Security**: Ensures that transactions (top-ups, usage, withdrawals) are immutable and cannot be tampered with.
- **Efficiency**: Automates user and meter registration, credit tracking, and deduction without manual intervention.
- **Transparency**: All transactions and balances are verifiable on the blockchain.

## Project Structure

### 1. **Smart Contracts**
- **Solidity Contract**: Deployed on Arbitrum Sepolia and found in the `smart-contracts` folder. It includes user and IoT meter registration, credit top-up, credit deduction based on usage, and owner withdrawal functionality.
- **Rust Stylus Contract**: A Rust-based implementation of the same functionality, demonstrating blockchain versatility. Found in the `rust-implementation` folder.

### 2. **Frontend**
- **Tech Stack**: React + Tailwind CSS.
- The frontend interacts with the smart contract, allowing users to:
  - **Register**: Owner can register users and IoT meters.
  - **Top-Up**: Users can top up their electricity credits.
  - **Usage Deduction**: IoT meters can deduct electricity credits for registered users.
  - **Withdraw**: Owners can withdraw the contract balance.

### 3. **Project Structure**
```
root
│
├── smart-contracts/
│   ├── contracts/
│   │   └── PayAsYouGoElectricity.sol   // Solidity smart contract
│   ├── test/
│   │   └── test.js                    // Test cases using Hardhat
│   └── hardhat.config.js              // Hardhat configuration
│
├── frontend/
│   ├── src/
│   │   └── components/                // React components for the frontend
│   ├── App.js                         // Main React application
│   ├── tailwind.config.js             // Tailwind CSS configuration
│   └── package.json                   // Frontend dependencies
│
└── rust-implementation/
    ├── src/
    │   └── lib.rs                     // Rust Stylus smart contract
    └── Cargo.toml                     // Rust dependencies and configuration
```

## How to Run the Project

### 1. Smart Contract
- Navigate to the `smart-contracts` folder.
- Install dependencies:  
  ```bash
  npm install
  ```
- Compile the contracts:
  ```bash
  npx hardhat compile
  ```
- Run the tests:
  ```bash
  npx hardhat test
  ```
- Deploy the contract:
  ```bash
  npx hardhat run scripts/deploy.js --network arbitrumSepolia
  ```

### 2. Frontend
- Navigate to the `frontend` folder.
- Install frontend dependencies:
  ```bash
  npm install
  ```
- Start the React app:
  ```bash
  npm start
  ```
- Ensure your wallet is connected to Arbitrum Sepolia when interacting with the dApp.

### 3. Rust Stylus Contract
- Navigate to the `rust-implementation` folder.
- Build the Rust contract:
  ```bash
  cargo build
  ```

## Use Cases

1. **Prepaid Electricity Management**: Users can top up credits in advance and have their balance automatically deducted based on actual electricity usage, improving flexibility.
2. **Smart Meters with Blockchain**: IoT meters can securely and transparently communicate with the blockchain, ensuring that electricity credits are deducted only when actual usage occurs.
3. **Transparent Utility Billing**: All transactions related to electricity credits are stored immutably on the blockchain, allowing users and utilities to audit usage.

## Future Improvements
- Integration with **real-world IoT meters** for automatic credit deduction.
- **Mobile-friendly** version of the dApp for improved user access.
- **Further decentralization** by implementing governance features to give users a say in contract upgrades.

## Conclusion

This project demonstrates a robust, decentralized approach to electricity credit management using blockchain technology. By combining a powerful frontend, smart contracts in Solidity and Rust, and the scalability of Arbitrum Sepolia, the system ensures secure, transparent, and efficient energy usage management.