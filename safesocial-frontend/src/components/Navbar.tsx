import ConnectWallet from "@/app/_components/ConnectWallet";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleLogoClick = () => {
    if (isConnected) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="w-full bg-black/10 backdrop-blur-md border-b border-white/20 px-2 md:px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
       <div className="flex items-center space-x-2">
       <Image src="/logo.png" alt="SafeSocial" width={50} height={50} />
        <div
          className="cursor-pointer text-2xl font-bold text-var(--secondary-color)"
          onClick={handleLogoClick}
        >
          SafeSocial
        </div>
       </div>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-8">
          <a
            href="#hero"
            className="text-gray-200 hover:text-green-400 font-medium transition"
          >
            Home
          </a>
          <a
            href="#works"
            className="text-gray-200 hover:text-green-400 font-medium transition"
          >
            How it works
          </a>
          <a
            href="#why"
            className="text-gray-200 hover:text-green-400 font-medium transition"
          >
            Customers
          </a>
          <a
            href="#contact"
            className="text-gray-200 hover:text-green-400 font-medium transition"
          >
            Contact us
          </a>
        </div>

        {/* Connect Wallet Button */}
        <div className="w-40 flex justify-end">
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
