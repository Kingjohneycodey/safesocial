"use client";
import { createConfig, http } from 'wagmi';

// export const blockdag = {
//   id: 1043,
//   name: 'BlockDAG',
//   network: 'blockdag',
//   nativeCurrency: {
//     name: 'BlockDAG',
//     symbol: 'BDAG',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc.primordial.bdagscan.com'],
//     },
//     public: {
//       http: ['https://rpc.primordial.bdagscan.com'],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'BlockDAG Explorer',
//       url: 'https://primordial.bdagscan.com',
//     },
//   },
//   testnet: true,
// };

// export const config = createConfig({
//   chains: [blockdag],
//   transports: {
//     [blockdag.id]: http(),
//   },
// });

// export const sepolia = {
//   id: 11155111,
//   name: 'Sepolia',
//   network: 'sepolia',
//   nativeCurrency: {
//     name: 'SepoliaETH',
//     symbol: 'ETH',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: { http: [process.env.NEXT_PUBLIC_RPC_URL!] },
//     public: { http: [process.env.NEXT_PUBLIC_RPC_URL!] },
//   },
//   blockExplorers: {
//     default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
//   },
//   testnet: true,
// };

// export const config = createConfig({
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(),
//   },
// });

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SafeSocial DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // Get this from WalletConnect Cloud
  chains: [sepolia], // just sepolia, or add mainnet for future
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL!), // use your Infura/Alchemy url
    // [mainnet.id]: http('https://mainnet-endpoint-if-needed'),
  },
});