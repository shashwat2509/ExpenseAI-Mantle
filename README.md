# 💸 ExpenseAI - AI Expense & Micro-Savings Manager

A Next.js application that combines AI-powered expense categorization with blockchain-based micro-savings on Mantle.

🌐 **Live Demo**: [expense-ai-u2-u.vercel.app](https://expense-ai-u2-u.vercel.app)

## ✨ Features

- **AI Expense Categorization**: Uses Google Gemini AI to automatically categorize transactions
- **Frontend Wallet Integration**: Connect MetaMask or other Web3 wallets directly in the browser
- **Micro-Savings**: Automatically calculate and save round-ups to a Mantle smart contract
- **Real-time Balance Tracking**: Monitor your vault balance in real-time

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini AI API key
- `VAULT_ADDRESS`: The deployed Vault smart contract address (0x119CFa5bF364B5D4F9d66c8E65Fc46BD5B42c8ba)
- `NEXT_PUBLIC_MANTLE_RPC`: Mantle RPC endpoint (https://rpc.sepolia.mantle.xyz)

### Smart Contract

The application uses a simple Vault contract with the following functions:
- `deposit()`: Accept MNT tokens
- `withdraw(amount)`: Withdraw specified amount
- `getBalance(user)`: Get user's balance

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask or Web3 wallet
2. **Enter Transactions**: Paste JSON transaction data in the textarea
3. **Categorize**: Click "Categorize Expenses" to get AI-powered categorization
4. **Save Round-ups**: Click "Save Round-Ups" to automatically save spare change to your vault

### Transaction Format

```json
[
  {"desc": "Uber Ride", "amount": 347, "date": "2024-01-15"},
  {"desc": "Electricity Bill", "amount": 1547, "date": "2024-01-20"},
  {"desc": "Grocery Shopping", "amount": 823, "date": "2024-01-18"},
  {"desc": "Netflix Subscription", "amount": 499, "date": "2024-01-01"},
  {"desc": "Restaurant Dinner", "amount": 1247, "date": "2024-01-16"}
]
```

**💡 Pro Tip:** Use amounts that don't end in "00" to create round-ups for testing:
- ₹347 → saves ₹53 (rounds up to ₹400)
- ₹1547 → saves ₹53 (rounds up to ₹1600)
- ₹823 → saves ₹77 (rounds up to ₹900)

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **AI**: Google Gemini 2.0 Flash for expense categorization
- **Blockchain**: Mantle integration with ethers.js
- **Styling**: Tailwind CSS 4

## 🔒 Security

- No private keys stored on the server
- All blockchain transactions signed by user's wallet
- Environment variables properly configured for public/private access
- Input validation and error handling throughout

## 🌐 Network Configuration

The application is deployed on **Mantle Sepolia Testnet**:

- **Chain ID**: 5003
- **Currency**: MNT
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Contract Address**: 0x119CFa5bF364B5D4F9d66c8E65Fc46BD5B42c8ba

## 📝 License

This project is licensed under the MIT License.