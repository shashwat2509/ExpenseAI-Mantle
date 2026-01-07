import { ethers } from "ethers";
import VaultABI from "../VaultABI.json";

const MANTLE_RPC = process.env.NEXT_PUBLIC_MANTLE_RPC || "https://rpc.sepolia.mantle.xyz";
const VAULT_ADDRESS = "0x119CFa5bF364B5D4F9d66c8E65Fc46BD5B42c8ba";

if (!VAULT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_VAULT_ADDRESS environment variable is required");
}

export interface WalletConnection {
  address: string;
  signer: ethers.Signer;
  provider: ethers.Provider;
}

export async function connectWallet(): Promise<WalletConnection> {
  if (typeof window === "undefined") {
    throw new Error("Wallet connection is only available in the browser");
  }

  if (!window.ethereum) {
    throw new Error("MetaMask or other wallet extension is required");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const address = accounts[0];

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    const targetChainId = 5003; // Mantle Sepolia Testnet
    
    if (network.chainId !== BigInt(targetChainId)) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
        // Wait for network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: 'Mantle Sepolia Testnet',
              nativeCurrency: {
                name: 'MNT',
                symbol: 'MNT',
                decimals: 18
              },
              rpcUrls: [MANTLE_RPC],
              blockExplorerUrls: ['https://sepolia.mantlescan.xyz/']
            }]
          });
          // Wait for network addition to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw switchError;
        }
      }
    }

    return { address, signer, provider };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw new Error("Failed to connect wallet");
  }
}

export function getVaultContract(signer: ethers.Signer) {
  try {
    // We know VAULT_ADDRESS is defined due to the check at the top of the file
    return new ethers.Contract(VAULT_ADDRESS!, VaultABI, signer);
  } catch (error) {
    console.error("Error creating vault contract:", error);
    throw new Error("Failed to create vault contract");
  }
}

export async function depositToVault(signer: ethers.Signer, amount: string) {
  try {
    const vault = getVaultContract(signer);
    const tx = await vault.deposit({
      value: ethers.parseEther(amount)
    });
    
    return { hash: tx.hash, tx };
  } catch (error) {
    console.error("Error depositing to vault:", error);
    throw error;
  }
}

export async function getVaultBalance(signer: ethers.Signer, address: string) {
  try {
    const vault = getVaultContract(signer);
    const balance = await vault.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error: any) {
    // Handle network change errors gracefully
    if (error.code === "NETWORK_ERROR" || error.message?.includes("network changed")) {
      console.warn("Network change detected, retrying vault balance check...");
      // Wait a bit for network to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const vault = getVaultContract(signer);
        const balance = await vault.getBalance(address);
        return ethers.formatEther(balance);
      } catch (retryError) {
        console.error("Retry failed for vault balance:", retryError);
        return "0"; // Return 0 balance on persistent errors
      }
    }
    console.error("Error getting vault balance:", error);
    throw error;
  }
}

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}
