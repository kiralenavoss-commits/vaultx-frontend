import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAPI } from "../utils/api";
import { Copy, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const WALLET_ADDRESS = "TXCztGSFGn5YSopPHmf5HoY718fzHLfjej";

const plans = [
  { name: "Basic", rate: "1.5%", min: 500, color: "border-gray-500" },
  { name: "Silver", rate: "2.5%", min: 5000, color: "border-gray-400" },
  { name: "Gold", rate: "4%", min: 10000, color: "border-yellow-400" },
  { name: "Diamond", rate: "6%", min: 50000, color: "border-blue-400" },
  { name: "Elite", rate: "8%", min: 100000, color: "border-purple-400" },
];

export default function Deposit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: "",
    txHash: "",
    memo: "",
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.txHash) {
      toast.error("Please fill in amount and transaction hash");
      return;
    }
    if (formData.amount < 500) {
      toast.error("Minimum deposit is $500");
      return;
    }
    setLoading(true);
    try {
      await userAPI.deposit({
        amount: parseFloat(formData.amount),
        txHash: formData.txHash,
        memo: user?.id || formData.memo,
      });
      toast.success("Deposit submitted! Admin will confirm within 24 hours.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black">Make a Deposit</h1>
        </div>

        {/* Warning */}
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-yellow-200">
            <p className="font-bold mb-1">Important Instructions:</p>
            <ul className="space-y-1 text-yellow-200/80 list-disc list-inside">
              <li>
                Send <strong>USDT TRC20</strong> only to the address below
              </li>
              <li>
                Include your <strong>UserID as memo</strong> in the transaction
              </li>
              <li>
                Minimum deposit is <strong>$10 USDT</strong>
              </li>
              <li>Submit the transaction hash below after sending</li>
              <li>
                Admin confirms within <strong>24 hours</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-2">
            Send USDT TRC20 to this address:
          </p>
          <div className="bg-black rounded-xl p-4 flex items-center justify-between gap-3 border border-gray-700">
            <p className="text-yellow-400 font-mono text-sm break-all">
              {WALLET_ADDRESS}
            </p>
            <button
              onClick={copyAddress}
              className="shrink-0 p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition"
            >
              <Copy
                size={16}
                className={copied ? "text-green-400" : "text-yellow-400"}
              />
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm font-semibold">
              Your UserID (use as memo):
            </p>
            <p className="text-white font-mono font-bold">{user?.id}</p>
          </div>
        </div>

        {/* Plans Reference */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">
          <p className="font-bold mb-4">Investment Plans:</p>
          <div className="grid grid-cols-5 gap-2">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`border ${plan.color} rounded-lg p-2 text-center`}
              >
                <p className="text-xs font-bold text-yellow-400">{plan.rate}</p>
                <p className="text-xs text-gray-400">{plan.name}</p>
                <p className="text-xs text-gray-500">${plan.min}+</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit Form */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
          <h2 className="font-black text-lg mb-4">Submit Deposit</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Amount (USDT) <span className="text-yellow-400">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="Enter amount e.g. 100"
                min="10"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Transaction Hash <span className="text-yellow-400">*</span>
              </label>
              <input
                type="text"
                value={formData.txHash}
                onChange={(e) =>
                  setFormData({ ...formData, txHash: e.target.value })
                }
                placeholder="Paste your TRC20 transaction hash"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
              <p className="text-gray-500 text-xs mt-1">
                Find this in your wallet's transaction history
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Submit Deposit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
