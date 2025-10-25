// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from 'wagmi';
// import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
// import { config } from './wagmi';
// import React from 'react';

// export function Providers({ children }: { children: React.ReactNode }) {
//   const [queryClient] = React.useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>
//       <WagmiProvider config={config}>
//         <RainbowKitProvider
//           theme={lightTheme({
//             accentColor: '#22c55e',
//             accentColorForeground: 'white',
//             borderRadius: 'large',
//             fontStack: 'rounded',
//             overlayBlur: 'large',
//           })}
//         >
//           {children}
//         </RainbowKitProvider>
//       </WagmiProvider>
//     </QueryClientProvider>
//   );
// }

'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './wagmi';



const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
