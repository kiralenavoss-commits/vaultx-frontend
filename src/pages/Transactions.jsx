import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../utils/api';
import { ArrowLeft, Filter } from 'lucide-react';

const typeColors = {
  deposit: 'text-blue-400',
  withdrawal: 'text-red-400',
  daily_earning: 'text-green-400',
  referral_bonus: 'text-purple-400',
  signup_bonus: 'text-yellow-400',
  spin_reward: 'text-orange-400',
  task_bonus: 'text-pink-400',
  login_streak: 'text-cyan-400',
  leaderboard_prize: 'text-yellow-400'
};

const typeIcons = {
  deposit: '💰',
  withdrawal: '📤',
  daily_earning: '📈',
  referral_bonus: '👥',
  signup_bonus: '🎁',
  spin_reward: '🎰',
  task_bonus: '✅',
  login_streak: '🔥',
  leaderboard_prize: '🏆'
};

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(transactions);
    } else {
      setFiltered(transactions.filter(tx => tx.type === filter));
    }
  }, [filter, transactions]);

  const fetchTransactions = async () => {
    try {
      const res = await userAPI.getTransactions();
      setTransactions(res.data.transactions);
      setFiltered(res.data.transactions);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'daily_earning', label: 'Earnings' },
    { value: 'referral_bonus', label: 'Referrals' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

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
          <h1 className="text-2xl font-black">Transaction History</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Transactions</p>
            <p className="text-2xl font-black text-white">{transactions.length}</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Pending</p>
            <p className="text-2xl font-black text-yellow-400">
              {transactions.filter(tx => tx.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Filter size={16} className="text-gray-500 shrink-0 mt-2" />
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filter === f.value
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-gray-950 border border-gray-800 rounded-xl">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            filtered.map((tx, i) => (
              <div
                key={i}
                className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex justify-between items-start"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-xl shrink-0">
                    {typeIcons[tx.type] || '💵'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm capitalize">
                      {tx.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{tx.description}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                    {tx.txHash && (
                      <p className="text-gray-700 text-xs mt-1 font-mono truncate max-w-48">
                        {tx.txHash}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`font-black text-lg ${
                    tx.type === 'withdrawal' ? 'text-red-400' : typeColors[tx.type] || 'text-green-400'
                  }`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    tx.status === 'approved'
                      ? 'bg-green-500/20 text-green-400'
                      : tx.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}