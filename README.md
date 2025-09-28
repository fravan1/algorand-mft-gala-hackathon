
**Architecture**
![WhatsApp Image 2025-09-28 at 12 51 37](https://github.com/user-attachments/assets/ec50677a-e100-4e41-bb78-e403eaff870e)

**MFTGala Architecture Overview**

MFTGala is a digital asset (ASA)–based economic model built on Algorand. The system enables both content creators and users to interact through a liquidity and royalty sharing mechanism.

Flow Summary

Creator Inserts Asset

The creator adds an ASA (Algorand Standard Asset) into the system.

20% of the newly created asset is allocated to the ASA Pool, and 80% goes into the Liquidity Pool.

User Purchases

When a user buys ASA, the payment is distributed as follows:

80% → Liquidity Pool

10% → Creator

10% → Royalty

Sell Mechanism

Users can sell their ASAs.

After the sale, the tokens are processed back through the Liquidity Pool.

Royalty & Claim

Royalties accumulate in a separate pool.

Users can later claim their share from this pool.

This model ensures a sustainable economic structure while incentivizing creators.

**Tech Stack**

The project’s technologies are divided into two main layers: Frontend (Next.js) and Backend/Smart Contract (Python + Algorand ecosystem).

**1. Frontend (Next.js)**

Next.js 14 → React-based UI framework

TailwindCSS / Shadcn → Modern and fast UI development

WalletConnect / Pera Wallet SDK → Enables users to connect their Algorand wallets

Client SDK (algokit-utils) → Allows frontend to interact with Algorand smart contracts

**2. Backend / Smart Contract**

Algokit → Development framework for Algorand (deployment, testing, CI/CD support)

Algorand Typescript SDK (ts-algorand-sdk) → For creating and sending transactions, and asset management

**3. Blockchain Layer**

Algorand Standard Asset (ASA) → Tokenization mechanism

Liquidity Pool Logic → Handles buy & sell operations



