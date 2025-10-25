# SafeSocial 🛡️
A decentralized social platform for secure content sharing and monetization.

SafeSocial is a comprehensive Web3 platform that empowers creators to share, monetize, and control their content with complete privacy and security. Built on blockchain technology, it ensures encrypted storage, pay-to-access content, and direct wallet-based authentication—no middlemen, no data exploitation.


## 🔗 Important Links
•⁠  ⁠📹 Demo Video: https://www.youtube.com/watch?v=sp-mYBt_bbk
•⁠  ⁠🌐 Live Application: (https://safesocial-demo.vercel.app)
•⁠  ⁠📊 Presentation Slides: https://tinyurl.com/27kmu7up



## 🌟 Key Features
- 🔐 **Total Security:** Content encrypted and stored on blockchain
- 💰 **Direct Payments:** Instant, secure payments with no middlemen
- 🎯 **Full Control:** Users decide access levels (private, public, paid)
- 🌐 **For Everyone:** Platform for creators, brands, professionals, and fans
- ⚡ **Wallet Integration:** Secure authentication using Web3 wallets
- 📱 **Modern UI:** Beautiful, responsive interface built with Next.js
- 🎥 **Media Support:** Images, videos, documents with inline preview
- 🔄 **Real-time Updates:** Live feed updates and notifications

---

## 🏗️ Architecture Overview

SafeSocial consists of three main components:

### 1. **Frontend** (`safesocial-frontend/`)
- **Next.js 16** with React 19 and TypeScript
- **Web3 Integration:** RainbowKit, wagmi, viem
- **Styling:** Tailwind CSS 4
- **State Management:** TanStack React Query
- **UI Components:** Custom components with Framer Motion animations

### 2. **Backend** (`safesocial-backend/`)
- **Node.js** with Express and TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens with bcrypt
- **File Storage:** IPFS via Pinata
- **Blockchain Integration:** Ethers.js for smart contract interaction

### 3. **Smart Contracts** (`safe-social-smart-contract/`)
- **Solidity** contracts deployed on BlockDAG network
- **DataVault.sol:** File registration and access control
- **PostRegistry.sol:** Post creation and payment management
- **Hardhat** development environment

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- Web3 wallet (MetaMask, WalletConnect, etc.)
- BlockDAG network access
- Pinata account for IPFS storage

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd safe-social
```

#### 2. Frontend Setup
```bash
cd safesocial-frontend
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

#### 3. Backend Setup
```bash
cd safesocial-backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

#### 4. Smart Contracts Setup
```bash
cd safe-social-smart-contract
npm install
cp .env.example .env
# Configure environment variables
npx hardhat compile
npx hardhat deploy
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Web3:** RainbowKit, wagmi, viem, ethers.js
- **State Management:** TanStack React Query
- **Animations:** Framer Motion
- **UI Components:** Radix UI, Lucide React

### Backend
- **Runtime:** Node.js with Express
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcrypt
- **File Storage:** IPFS via Pinata
- **Blockchain:** Ethers.js
- **Security:** Helmet, CORS

### Smart Contracts
- **Language:** Solidity
- **Framework:** Hardhat
- **Network:** BlockDAG
- **Libraries:** OpenZeppelin
- **Testing:** Hardhat test suite

---

## 📁 Project Structure

```
safe-social/
├── safesocial-frontend/           # Next.js frontend
│   ├── src/
│   │   ├── app/                   # Next.js app directory
│   │   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── signup/           # Authentication
│   │   │   └── services/         # API services
│   │   ├── components/           # React components
│   │   │   ├── ui/               # UI components
│   │   │   ├── PostCard.tsx      # Post display
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── MediaUpload.tsx    # File upload
│   │   ├── lib/                  # Utilities
│   │   └── abis/                 # Contract ABIs
│   └── package.json
├── safesocial-backend/            # Node.js backend
│   ├── src/
│   │   ├── controllers/          # API controllers
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── lib/                  # Utilities
│   │   └── service/              # External services
│   └── package.json
└── safe-social-smart-contract/    # Solidity contracts
    ├── contracts/                # Smart contracts
    │   ├── DataVault.sol        # File management
    │   └── PostRegistry.sol     # Post management
    ├── scripts/                  # Deployment scripts
    └── package.json
```

---

## 🔧 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript
npm run start    # Start production server
```

### Smart Contracts
```bash
npm run compile  # Compile contracts
npm run test     # Run tests
npm run deploy   # Deploy to network
```

---

## 🎯 Key Features Explained

### Content Management
- **File Upload:** Support for images, videos, documents
- **IPFS Storage:** Decentralized file storage
- **Inline Preview:** Images and videos display directly in posts
- **Access Control:** Public, private, and paid content options

### Payment System
- **BDAG Token Payments:** Native BlockDAG token integration
- **Pay-to-Access:** Secure payment flow for premium content
- **Creator Earnings:** Direct payments to content creators
- **Smart Contract Automation:** Automated access granting

### User Experience
- **Wallet Authentication:** Web3 wallet-based login
- **Real-time Feed:** Live updates and post refresh
- **Responsive Design:** Mobile-first approach
- **Toast Notifications:** User feedback system

---

## 🔒 Security Features

### Smart Contract Security
- **Access Control:** Role-based permissions
- **Payment Verification:** Secure payment processing
- **File Registration:** Immutable file records
- **Key Management:** Encrypted access keys

### Application Security
- **Client-side Encryption:** Files encrypted before upload
- **JWT Authentication:** Secure token-based auth
- **CORS Protection:** Cross-origin request security
- **Input Validation:** Comprehensive data validation

### Security Best Practices
- **Input Sanitization:** All user inputs validated
- **Rate Limiting:** API request throttling
- **Secure Headers:** Helmet.js security headers
- **Environment Variables:** Sensitive data protection

---

## 🌍 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Heroku)
```bash
# Configure environment variables
# Deploy to your preferred platform
```

### Smart Contracts (BlockDAG)
```bash
# Deploy contracts
npx hardhat run scripts/deploy.ts --network primordial
```

---

## 🔗 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_DATA_VAULT_ADDRESS=0x...
NEXT_PUBLIC_POST_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_GATEWAY=your_gateway
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/safesocial
JWT_SECRET=your_jwt_secret
PINATA_JWT=your_pinata_jwt
PINATA_GATEWAY=your_gateway
ADMIN_PRIVATE_KEY=your_admin_key
```

### Smart Contracts (.env)
```env
PRIMORDIAL_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

---

## 📱 How It Works

### For Creators
1. **Connect Wallet:** Securely sign in using Web3 wallet
2. **Upload Content:** Post videos, photos, files with pricing
3. **Set Access Plans:** Create paid or free content
4. **Share & Earn:** Content encrypted and stored on-chain

### For Users
1. **Browse Content:** Discover creators and their content
2. **Purchase Access:** Buy access using BDAG tokens
3. **Enjoy Content:** Stream, download based on access level
4. **Support Creators:** Direct payments with no platform fees

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@safesocial.com or join our Discord community.

---

## 🎉 Acknowledgments

- **BlockDAG Network** for blockchain infrastructure
- **IPFS/Pinata** for decentralized storage
- **OpenZeppelin** for smart contract libraries
- **Next.js Team** for the amazing framework

---

**Built with ❤️ by Team SafeSocial**

*Power Your Privacy. Monetize Without Middlemen.*
