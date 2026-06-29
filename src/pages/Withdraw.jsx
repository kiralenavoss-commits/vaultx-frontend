import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../utils/api';
import { ArrowLeft, AlertCircle, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Withdraw() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.walletAddress) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.amount < 10) {
      toast.error('Minimum withdrawal is $10');
      return;
    }
    if (formData.amount > user?.balance) {
      toast.error('Insufficient balance');
      return;
    }
    setLoading(true);
    try {
      await userAPI.withdraw({
        amount: parseFloat(formData.amount),
        walletAddress: formData.walletAddress
      });
      toast.success('Withdrawal request submitted! Processing within 24 hours.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black">Withdraw Funds</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border border-yellow-400/30 rounded-xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-4xl font-black text-yellow-400">
            ${user?.balance?.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs mt-1">USDT</p>
        </div>

        {/* Warning */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-200">
            <p className="font-bold mb-1">Withdrawal Info:</p>
            <ul className="space-y-1 text-blue-200/80 list-disc list-inside">
              <li>Minimum withdrawal is <strong>$10 USDT</strong></li>
              <li>2% processing fee applies</li>
              <li>Processed within <strong>24 hours</strong></li>
              <li>Sent directly to your <strong>USDT TRC20</strong> wallet</li>
            </ul>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
          <h2 className="font-black text-lg mb-4 flex items-center gap-2">
            <Wallet className="text-yellow-400" size={20} />
            Withdrawal Request
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Amount (USDT) <span className="text-yellow-400">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount e.g. 50"
                min="10"
                max={user?.balance}
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
              {formData.amount >= 10 && (
                <p className="text-gray-500 text-xs mt-1">
                  You receive: ${(formData.amount * 0.98).toFixed(2)} after 2% fee
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[10, 50, 100, 500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFormData({ ...formData, amount: amt })}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-lg hover:bg-yellow-400/20 hover:text-yellow-400 transition"
                >
                  ${amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, amount: Math.floor(user?.balance || 0) })}
                className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-lg hover:bg-yellow-400/20 hover:text-yellow-400 transition"
              >
                Max
              </button>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Your USDT TRC20 Wallet Address <span className="text-yellow-400">*</span>
              </label>
              <input
                type="text"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="Enter your TRC20 wallet address"
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-400 transition placeholder-gray-600"
              />
              <p className="text-gray-500 text-xs mt-1">
                ⚠️ Double-check your address. Wrong address = lost funds.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Submit Withdrawal Request'
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}