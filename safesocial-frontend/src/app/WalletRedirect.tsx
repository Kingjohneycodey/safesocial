
"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
interface WalletRedirectProps {
  redirectPath?: string;
  children: React.ReactNode;
}

const WalletRedirect: React.FC<WalletRedirectProps> = ({
  redirectPath = "/dashboard",
  children,
}) => {
  const { isConnected } = useAccount();
  const router = useRouter();


  useEffect(() => {
    // Only redirect if we're on the home page and wallet gets connected
    // @ts-ignore
    if (isConnected && window.location.pathname === "/") {
      // Small delay to allow for smooth transition
      const timer = setTimeout(() => {
        // router.push(redirectPath);
      }, 1000);


      return () => clearTimeout(timer);
    }
  }, [isConnected, router, redirectPath]);

  return <>{children}</>;
};

export default WalletRedirect;
