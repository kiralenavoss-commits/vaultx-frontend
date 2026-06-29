import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../utils/api';
import { ArrowLeft, Trophy, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const vipColors = {
  Bronze: 'text-orange-400',
  Silver: 'text-gray-300',
  Gold: 'text-yellow-400',
  Platinum: 'text-blue-300',
  Elite: 'text-purple-400'
};

const prizes = ['🥇 $100', '🥈 $50', '🥉 $25', '$10', '$10', '$5', '$5', '$5', '$5', '$5'];

export default function Leaderboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await userAPI.getLeaderboard();
      setLeaderboard(res.data.leaderboard);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-black">Weekly Leaderboard</h1>
        </div>

        {/* Prize Pool Banner */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-xl p-5 mb-6 text-center">
          <Trophy className="text-yellow-400 mx-auto mb-2" size={32} />
          <p className="text-yellow-400 font-black text-2xl">$200 Prize Pool</p>
          <p className="text-gray-400 text-sm mt-1">Distributed every Monday to top earners</p>
        </div>

        {/* Prize Breakdown */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">
          <p className="font-bold mb-3 text-sm">Weekly Prize Breakdown:</p>
          <div className="grid grid-cols-5 gap-2">
            {prizes.slice(0, 5).map((prize, i) => (
              <div key={i} className="text-center">
                <p className="text-lg">{prize.split(' ')[0]}</p>
                <p className="text-yellow-400 text-xs font-bold">{prize.split(' ')[1]}</p>
                <p className="text-gray-600 text-xs">#{i + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <h2 className="font-black text-lg mb-4 flex items-center gap-2">
            <Crown className="text-yellow-400" size={20} />
            Top Earners This Week
          </h2>

          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="text-gray-700 mx-auto mb-3" size={40} />
              <p className="text-gray-500">No earnings yet this week.</p>
              <p className="text-gray-600 text-sm">Be the first to earn!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    entry.username === user?.username
                      ? 'border-yellow-400/50 bg-yellow-400/10'
                      : 'border-gray-800 bg-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      i === 0 ? 'bg-yellow-400 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {entry.username}
                        {entry.username === user?.username && (
                          <span className="text-yellow-400 text-xs ml-1">(You)</span>
                        )}
                      </p>
                      <p className={`text-xs ${vipColors[entry.vipTier] || 'text-gray-500'}`}>
                        {entry.vipTier} • {entry.plan} plan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-black">${entry.weeklyEarnings?.toFixed(2)}</p>
                    <p className="text-gray-600 text-xs">this week</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Motivation */}
        <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="text-purple-300 text-sm font-semibold">
            💎 Upgrade your plan to earn more and climb the leaderboard!
          </p>
          <button
            onClick={() => navigate('/deposit')}
            className="mt-2 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-500 transition"
          >
            Upgrade Now
          </button>
        </div>

      </div>
    </div>
  );
}