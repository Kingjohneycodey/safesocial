"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!address) {
      setAuthenticated(false);
      return;
    }
    const signedKey = `signedIn_${address}`;
    const isSigned = localStorage.getItem(signedKey) === 'true';
    setAuthenticated(isSigned);
  }, [address]);

  useEffect(() => {
    // Don't attempt auth if disconnecting is in progress
    if (!address || !isConnected || disconnecting) return;
    const signedKey = `signedIn_${address}`;
    if (localStorage.getItem(signedKey) === 'true') {
      setAuthenticated(true);
      return;
    }
    if (authenticated) return;
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/nonce`, { address });
        const nonce = data.nonce;
        const signature = await signMessageAsync({ message: nonce });
        const res = await axios.post(`${API_URL}/api/auth/login`, { address, signature });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem(`signedIn_${address}`, 'true');
          setAuthenticated(true);
          if (res.data.onboarding) {
            router.push('/signup');
          } else {
            router.push('/dashboard');
          }
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message || 'Login failed');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Login failed');
        }
       
      } finally {
        setLoading(false);
      }
    })();
  }, [address, isConnected, authenticated, signMessageAsync, router, disconnecting]);

  useEffect(() => {
    // Reset disconnecting flag after disconnect is finished
    if (!isConnected && disconnecting) {
      setDisconnecting(false);
    }
    if (!isConnected && address) {
      localStorage.removeItem(`signedIn_${address}`);
      setAuthenticated(false);
    }
  }, [isConnected, address, disconnecting]);

  const handleDisconnect = () => {
    if (address) localStorage.removeItem(`signedIn_${address}`);
    localStorage.removeItem('token');
    setAuthenticated(false);
    setMenuOpen(false);
    setDisconnecting(true);
    disconnect();
    // Redirect to home page after disconnect
    router.push('/');
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div className="flex flex-col items-end gap-2 relative">
            {!connected && (
              <button
                onClick={openConnectModal}
                className="px-5 py-2 rounded-lg font-semibold bg-[var(--secondary-color)] text-black transition-all duration-200"
                disabled={!ready || loading}
                style={{ minWidth: 140 }}
              >
                Connect Wallet
              </button>
            )}
            {connected && account && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((m) => !m)}
                  className="px-5 py-2 rounded-lg font-semibold bg-[var(--secondary-color)] text-black transition-all duration-200"
                  style={{ minWidth: 140 }}
                >
                  {account.address.slice(0, 6) + '...' + account.address.slice(-4)}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                    <Link
                      href="/dashboard"
                      className="block w-full px-4 py-3 text-sm text-neutral-800 hover:bg-gray-100 text-left font-semibold"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleDisconnect}
                      className="block w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-100 text-left font-semibold"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}
            {loading && <span className="text-green-400 text-sm mt-1">Authenticating...</span>}
            {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
