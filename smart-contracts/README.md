# Pay-As-You-Go Electricity dApp

## Overview

The Pay-As-You-Go (PAYG) Electricity dApp enables a decentralized and transparent way for users to manage their electricity consumption. The system allows users to top up electricity credits while enabling IoT-powered smart meters to deduct credits based on real-time usage. The contract is designed for deployment on the Arbitrum Sepolia network, providing low transaction fees and fast finality for an efficient and user-friendly experience.

## Application Features

1. **User Registration**  
   The contract allows an administrator (the contract owner) to register users who can then manage their electricity credits.
   
2. **Top-Up System**  
   Users can easily top up their electricity credits in tokens by sending a transaction with a specified value. This top-up is reflected immediately in the user’s balance, enabling them to use electricity seamlessly.
   
3. **IoT Meter Integration**  
   Registered IoT meters can interact with the contract to deduct electricity credits based on actual usage. The dApp ensures that only authorized meters can deduct these credits, ensuring security and preventing unauthorized access.
   
4. **Transparent Electricity Usage**  
   Users can track their electricity usage as every top-up and deduction event is recorded on the blockchain and accessible to all participants. This offers a transparent and verifiable system for electricity distribution.

5. **Withdrawal by Owner**  
   The contract allows the owner to withdraw the collected funds from users' payments, making it a complete solution for managing the financial aspects of electricity distribution.

## Use Cases

### 1. **Residential Pay-As-You-Go Electricity**
   - Homeowners can top up their electricity credits and monitor their energy consumption in real-time. Smart meters installed at homes will communicate with the blockchain to deduct credits based on usage, reducing reliance on centralized billing systems.

### 2. **Remote or Underserved Areas**
   - Areas with limited or no access to traditional banking infrastructure can use this decentralized application to manage electricity distribution. Blockchain ensures transparency and fairness in energy usage and payments.
   
### 3. **IoT and Smart Grids**
   - The integration of IoT devices (smart meters) with blockchain technology provides a secure and automated way to track electricity usage. This is highly applicable for smart cities and connected homes, where multiple devices need to be managed securely and transparently.

## Importance of Blockchain in Electricity Distribution

Blockchain technology is crucial to solving the inefficiencies and trust issues present in traditional energy distribution systems:

### 1. **Transparency**
   - Every transaction (top-up or electricity usage) is publicly recorded on the blockchain. Users can easily verify their energy consumption and payments without relying on centralized entities.

### 2. **Decentralization**
   - A decentralized approach allows users to interact with the system directly without intermediaries, reducing costs and friction.

### 3. **Security**
   - The smart contract ensures that only registered users and authorized IoT meters can interact with the system, preventing tampering or unauthorized access.

### 4. **Automation**
   - Through smart contracts, the entire process of managing electricity usage becomes automated. Users do not need to manually monitor their consumption; the smart meter automatically deducts credits based on real-time usage.

### 5. **Cost-Efficiency**
   - By deploying the contract on Arbitrum Sepolia, the dApp benefits from low gas fees and fast transaction speeds. This makes the system scalable and cost-effective for users and administrators alike.

## How to Interact with the dApp

1. **User Registration**
   - Contact the contract owner or admin to register your account.
   
2. **Topping Up Credits**
   - Once registered, you can top up electricity credits by sending tokens to the contract via a simple transaction.

3. **Electricity Usage**
   - As you consume electricity, IoT meters will automatically deduct the appropriate amount of credits from your account.

4. **Monitoring Usage**
   - You can monitor your usage and remaining balance by interacting with the contract, either through a user interface or directly via a blockchain explorer.

## Getting Started

1. Clone the repository:

   ```bash
   git https://github.com/michojekunle/pay-as-you-go-elec.git
   cd pay-as-you-go-elec/smart-contract
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   PRIVATE_KEY=<your_private_key>
   ```

### Compilation

1. Compile the smart contracts using Hardhat:

    ```bash
    npx hardhat compile
    ```
2. Deploy the contract on the Arbitrum Sepolia network:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/deploy.js --network arbitrumSepolia
   ```

## Smart Contract Details

- **Solidity Version**: `0.8.18`
- **Deployment Network**: Arbitrum Sepolia (Chain ID: 421614)
- **Main Contract Address**: `0x7042153d890F545E1fACaea4363DA2A861e546fC`

 

