"use client";
import { useState, useEffect } from "react";
import { connectWallet, depositToVault, WalletConnection, getVaultBalance } from "../lib/wallet";

export default function Home() {
  const [txns, setTxns] = useState<any[]>([]);
  const [categorized, setCategorized] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [potentialSavings, setPotentialSavings] = useState<any>(null);
  const [savings, setSavings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [vaultBalance, setVaultBalance] = useState<string>("0");
  const [networkStatus, setNetworkStatus] = useState<string>("Not Connected");

  // Calculate round-ups for display
  const calculateRoundups = () => {
    let totalRoundups = 0;
    const roundupDetails = txns.map((t: any) => {
      if (t.amount && typeof t.amount === 'number') {
        const remainder = t.amount % 100;
        const roundup = remainder !== 0 ? (100 - remainder) : 0;
        totalRoundups += roundup;
        return { ...t, roundup };
      }
      return { ...t, roundup: 0 };
    });
    return { totalRoundups, roundupDetails };
  };

  const { totalRoundups, roundupDetails } = calculateRoundups();

  // Connect wallet function
  async function handleConnectWallet() {
    setWalletConnecting(true);
    try {
      const connection = await connectWallet();
      setWallet(connection);
      setNetworkStatus("Mantle Sepolia Testnet");
      
      // Get initial vault balance
      try {
        const balance = await getVaultBalance(connection.signer, connection.address);
        setVaultBalance(balance);
      } catch (error) {
        console.error("Failed to get vault balance:", error);
      }
    } catch (error: any) {
      alert(`Failed to connect wallet: ${error.message}`);
    } finally {
      setWalletConnecting(false);
    }
  }

  // Check if wallet is already connected on page load
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setWallet(null);
          setVaultBalance("0");
          setNetworkStatus("Not Connected");
        } else if (wallet) {
          // Account changed but still connected, update balance
          getVaultBalance(wallet.signer, accounts[0]).then(setVaultBalance).catch(console.error);
        }
      });

      window.ethereum.on("chainChanged", (chainId: string) => {
        console.log("Network changed to:", parseInt(chainId, 16));
        // Reload the page to reset all connections when network changes
        window.location.reload();
      });
    }
  }, [wallet]);

  // Call Gemini API categorization
  async function handleCategorize() {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: txns }),
      });
      const data = await res.json();
      setCategorized(data.categorized || []);
      setAlerts(data.alerts || []);
      setTips(data.tips || []);
      setInsights(data.insights || null);
      setPotentialSavings(data.potentialSavings || null);
      setSavings(data.savings || null);
    } catch (error) {
      alert("Failed to categorize transactions");
    } finally {
      setLoading(false);
    }
  }

  // Call Flow EVM contract deposit using frontend wallet
  async function handleSave() {
    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      // Calculate roundups
      let roundups = 0;
      txns.forEach((t: any) => {
        if (t.amount && typeof t.amount === 'number') {
          const remainder = t.amount % 100;
          if (remainder !== 0) {
            roundups += (100 - remainder);
          }
        }
      });

      if (roundups === 0) {
        setSavings({
          saved: 0,
          message: "No round-ups to save",
        });
        return;
      }

      // Deposit using frontend wallet
      const amount = (roundups / 100).toString();
      const result = await depositToVault(wallet.signer, amount);
      
      // Wait for transaction confirmation
      const receipt = await result.tx.wait();
      
      // Update vault balance
      try {
        const newBalance = await getVaultBalance(wallet.signer, wallet.address);
        setVaultBalance(newBalance);
      } catch (error) {
        console.error("Failed to update vault balance:", error);
      }
      
      setSavings({
        saved: roundups,
        txHash: result.hash,
         message: `₹${roundups} saved to Mantle vault`,
        blockNumber: receipt.blockNumber,
      });
    } catch (error: any) {
      alert(`Failed to save round-ups: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            💸 ExpenseAI
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Expense Management & Smart Micro-Savings
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔗 Wallet Connection
          </h2>
          {!wallet ? (
            <div className="text-center">
              <button
                onClick={handleConnectWallet}
                disabled={walletConnecting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 font-medium text-lg transition-all duration-200"
              >
                {walletConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
              <p className="text-gray-500 mt-2 text-sm">
                Connect your MetaMask or Web3 wallet to start managing expenses
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <span className="text-green-600 font-medium text-lg">✅ Connected</span>
                <p className="font-mono text-sm text-gray-700 mt-1">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-medium text-lg">💰 Vault Balance</span>
                 <p className="font-bold text-xl text-gray-800">
                   {parseFloat(vaultBalance).toFixed(4)} MNT
                 </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <span className="text-purple-600 font-medium text-lg">🌐 Network</span>
                <p className="font-medium text-gray-800">
                  {networkStatus}
                </p>
              </div>
            </div>
          )}
          {wallet && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setWallet(null);
                  setNetworkStatus("Not Connected");
                  setVaultBalance("0");
                }}
                className="text-red-600 hover:text-red-800 font-medium px-6 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input & Actions */}
          <div className="space-y-6">
            {/* Transaction Input */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                📝 Transaction Input
              </h2>
              <textarea
                className="w-full h-48 p-4 border-2 border-gray-200 text-black rounded-lg font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                placeholder='Enter JSON transactions like:
[
  {"desc": "Uber Ride", "amount": 300, "date": "2024-01-15"},
  {"desc": "Electricity Bill", "amount": 1500, "date": "2024-01-20"},
  {"desc": "Grocery Shopping", "amount": 800, "date": "2024-01-18"}
]'
                onChange={(e) => {
                  try {
                    setTxns(JSON.parse(e.target.value));
                  } catch {
                    setTxns([]);
                  }
                }}
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500 text-sm">
                  💡 Tip: Include dates for better bill tracking and alerts
                </p>
                <button
                  onClick={() => {
                    const sampleData = [
                      {"desc": "Uber Ride", "amount": 290, "date": "2024-01-15"},
                      {"desc": "Electricity Bill", "amount": 1485, "date": "2024-01-20"},
                      {"desc": "Grocery Shopping", "amount": 880, "date": "2024-01-18"},
                      {"desc": "Netflix Subscription", "amount": 485, "date": "2024-01-01"},
                      {"desc": "Restaurant Dinner", "amount": 1190, "date": "2024-01-16"},
                      {"desc": "Gas Station", "amount": 1590, "date": "2024-01-17"},
                      {"desc": "Coffee Shop", "amount": 195, "date": "2024-01-19"},
                      {"desc": "Movie Tickets", "amount": 495, "date": "2024-01-21"}
                    ];
                    setTxns(sampleData);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  Load Sample Data
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🚀 Actions
              </h2>
              
              {/* Round-up Preview */}
              {txns.length > 0 && totalRoundups > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <h3 className="font-semibold text-green-800 mb-2">💰 Round-up Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700 mb-2">Round-up Details:</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {roundupDetails.map((t, i) => (
                          t.roundup > 0 && (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-green-700">{t.desc}</span>
                              <span className="font-medium">₹{t.roundup}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-700">Total Round-ups:</p>
                      <p className="text-2xl font-bold text-green-800">₹{totalRoundups}</p>
                      <p className="text-xs text-green-600">Will be saved to vault</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCategorize}
                  disabled={txns.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-medium transition-all duration-200"
                >
                  🧠 Categorize Expenses
                </button>
                <button
                  onClick={handleSave}
                  disabled={!wallet || loading || txns.length === 0 || totalRoundups === 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 font-medium transition-all duration-200"
                >
                  💰 Save Round-Ups (₹{totalRoundups})
                </button>
              </div>
              {loading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Processing...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Categorized Results */}
            {categorized.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Categorized Transactions
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-700">Description</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Amount</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorized.map((t, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 text-gray-800">{t.desc}</td>
                          <td className="p-3 font-semibold text-gray-900">₹{t.amount}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              t.category === 'Food' ? 'bg-orange-100 text-orange-800' :
                              t.category === 'Travel' ? 'bg-blue-100 text-blue-800' :
                              t.category === 'Bills' ? 'bg-red-100 text-red-800' :
                              t.category === 'Shopping' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {t.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
                <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                  ⚠️ Smart Alerts
                </h2>
                <ul className="space-y-2">
                  {alerts.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-700">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {tips.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-200">
                <h2 className="text-xl font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  💡 Smart Tips
                </h2>
                <ul className="space-y-2">
                  {tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-yellow-700">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Insights */}
            {insights && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
                <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  🔮 Spending Insights
                </h2>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Total Spent</h3>
                    <p className="text-2xl font-bold text-purple-900">₹{insights.totalSpent}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Category Breakdown</h3>
                      <div className="space-y-1">
                        {Object.entries(insights.categoryBreakdown || {}).map(([category, amount]: [string, any]) => (
                          <div key={category} className="flex justify-between text-sm">
                            <span className="text-purple-700">{category}:</span>
                            <span className="font-medium">₹{amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">Trends</h3>
                      <ul className="space-y-1">
                        {insights.spendingTrends?.map((trend: string, i: number) => (
                          <li key={i} className="text-sm text-purple-700">• {trend}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {insights.billAnomalies && insights.billAnomalies.length > 0 && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <h3 className="font-semibold text-red-800 mb-2">⚠️ Bill Anomalies</h3>
                      <ul className="space-y-1">
                        {insights.billAnomalies.map((anomaly: string, i: number) => (
                          <li key={i} className="text-sm text-red-700">• {anomaly}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Potential Savings */}
            {potentialSavings && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  💰 Potential Monthly Savings
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-900">₹{potentialSavings.monthly}</p>
                    <p className="text-blue-700 text-sm">{potentialSavings.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Micro-Savings Result */}
            {savings && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                  ✅ Round-Up Savings
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-700 text-lg">{savings.message}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Transaction Hash: <span className="font-mono text-gray-800">{savings.txHash}</span>
                    </p>
                    {savings.blockNumber && (
                      <p className="text-sm text-gray-600 mt-1">
                        Block: <span className="font-mono text-gray-800">{savings.blockNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
