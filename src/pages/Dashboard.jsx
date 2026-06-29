import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import {
  TrendingUp,
  Wallet,
  Users,
  LogOut,
  RotateCcw,
  Star,
  Trophy,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";

const planRates = {
  none: 0,
  basic: 1.5,
  silver: 2.5,
  gold: 4,
  diamond: 6,
  elite: 8,
};

const vipColors = {
  Bronze: "text-orange-400",
  Silver: "text-gray-300",
  Gold: "text-yellow-400",
  Platinum: "text-blue-300",
  Elite: "text-purple-400",
};

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [spinDeg, setSpinDeg] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const spinRewards = [1, 2, 3, 5, 0.5, 10, 0, 2];

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await userAPI.getDashboard();
      setDashboard(res.data);
      updateUser(res.data.user);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);
    try {
      const res = await userAPI.spin();
      const reward = res.data.reward;
      const rewardIndex = spinRewards.indexOf(reward);
      const extraSpins = 5;
      const targetDeg =
        spinDeg + 360 * extraSpins + rewardIndex * (360 / spinRewards.length);
      setSpinDeg(targetDeg);
      setTimeout(() => {
        setSpinResult(res.data);
        setSpinning(false);
        fetchDashboard();
        if (reward > 0) toast.success(`🎉 You won $${reward}!`);
        else toast.info("Better luck tomorrow!");
      }, 4000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Spin failed");
      setSpinning(false);
    }
  };

  const tasks = [
    {
      id: "follow_twitter",
      title: "Follow us on Twitter",
      reward: 0.5,
      icon: "🐦",
    },
    {
      id: "join_telegram",
      title: "Join our Telegram",
      reward: 0.5,
      icon: "📱",
    },
    { id: "share_facebook", title: "Share on Facebook", reward: 1, icon: "📘" },
    { id: "write_review", title: "Write a Review", reward: 2, icon: "⭐" },
    { id: "verify_email", title: "Verify your Email", reward: 1, icon: "📧" },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-400 font-bold">Loading your dashboard...</p>
        </div>
      </div>
    );

  const currentUser = dashboard?.user || user;
  const transactions = dashboard?.transactions || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TOP NAV */}
      <nav className="bg-gray-950 border-b border-gray-800 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">VX</span>
            </div>
            <span className="text-yellow-400 font-black text-lg">VaultX</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white font-bold text-sm">
                {currentUser?.username}
              </p>
              <p
                className={`text-xs font-semibold ${vipColors[currentUser?.vipTier] || "text-yellow-400"}`}
              >
                {currentUser?.vipTier} Member
              </p>
            </div>
            {currentUser?.isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-500 transition"
              >
                Admin
              </button>
            )}
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BALANCE CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border border-yellow-400/30 rounded-xl p-4 col-span-2 lg:col-span-1">
            <p className="text-gray-400 text-xs mb-1">Total Balance</p>
            <p className="text-3xl font-black text-yellow-400">
              ${currentUser?.balance?.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">USDT</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Earned</p>
            <p className="text-xl font-black text-green-400">
              ${currentUser?.totalEarned?.toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-1">All time</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Daily Rate</p>
            <p className="text-xl font-black text-blue-400">
              {planRates[currentUser?.plan] || 0}%
            </p>
            <p className="text-gray-500 text-xs mt-1 capitalize">
              {currentUser?.plan} plan
            </p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Login Streak</p>
            <p className="text-xl font-black text-orange-400">
              🔥 {currentUser?.loginStreak || 0}
            </p>
            <p className="text-gray-500 text-xs mt-1">Days</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Deposit",
              icon: <ArrowDownLeft size={18} />,
              path: "/deposit",
              color: "bg-green-600 hover:bg-green-500",
            },
            {
              label: "Withdraw",
              icon: <ArrowUpRight size={18} />,
              path: "/withdraw",
              color: "bg-blue-600 hover:bg-blue-500",
            },
            {
              label: "Referral",
              icon: <Users size={18} />,
              path: "/referral",
              color: "bg-purple-600 hover:bg-purple-500",
            },
            {
              label: "Leaderboard",
              icon: <Trophy size={18} />,
              path: "/leaderboard",
              color: "bg-orange-600 hover:bg-orange-500",
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["overview", "spin", "tasks", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize whitespace-nowrap transition ${
                activeTab === tab
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Investment Plan */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="text-yellow-400" size={20} />
                Investment Plan
              </h3>
              {currentUser?.plan === "none" ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">
                    No active plan. Deposit USDT to start earning daily!
                  </p>
                  <button
                    onClick={() => navigate("/deposit")}
                    className="px-6 py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition"
                  >
                    Start Earning Now
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-black text-yellow-400 capitalize">
                        {currentUser?.plan} Plan
                      </p>
                      <p className="text-gray-400 text-sm">
                        {planRates[currentUser?.plan]}% daily returns
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-black text-xl">
                        +$
                        {(
                          (currentUser?.planAmount || 0) *
                          (planRates[currentUser?.plan] / 100)
                        ).toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-xs">Per day</p>
                    </div>
                  </div>
                  <div className="bg-black rounded-lg p-3 flex justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">Plan Amount</p>
                      <p className="text-white font-bold">
                        ${currentUser?.planAmount?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Weekly Earnings</p>
                      <p className="text-green-400 font-bold">
                        ${currentUser?.weeklyEarnings?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">VIP Tier</p>
                      <p
                        className={`font-bold ${vipColors[currentUser?.vipTier]}`}
                      >
                        {currentUser?.vipTier}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-lg flex items-center gap-2">
                  <Clock className="text-yellow-400" size={20} />
                  Recent Activity
                </h3>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-yellow-400 text-xs hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  No transactions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold capitalize">
                          {tx.type.replace(/_/g, " ")}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${tx.type === "withdrawal" ? "text-red-400" : "text-green-400"}`}
                        >
                          {tx.type === "withdrawal" ? "-" : "+"}$
                          {tx.amount.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs capitalize ${
                            tx.status === "approved"
                              ? "text-green-500"
                              : tx.status === "pending"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Referral Summary */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <Users className="text-yellow-400" size={20} />
                Referral Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-yellow-400">
                    {currentUser?.referralLevel1?.length || 0}
                  </p>
                  <p className="text-gray-500 text-xs">Level 1 (10%)</p>
                </div>
                <div className="bg-black rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-yellow-400">
                    {currentUser?.referralLevel2?.length || 0}
                  </p>
                  <p className="text-gray-500 text-xs">Level 2 (5%)</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/referral")}
                className="w-full py-2 border border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400/10 transition text-sm"
              >
                Share Referral Link
              </button>
            </div>

            {/* VIP Status */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                VIP Status
              </h3>
              <div className="space-y-3">
                {["Bronze", "Silver", "Gold", "Platinum", "Elite"].map(
                  (tier, i) => {
                    const thresholds = [0, 500, 2000, 10000, 50000];
                    const isCurrent = currentUser?.vipTier === tier;
                    const isAchieved =
                      thresholds[i] <= (currentUser?.totalDeposited || 0);
                    return (
                      <div
                        key={tier}
                        className={`flex justify-between items-center p-2 rounded-lg ${isCurrent ? "bg-yellow-400/10 border border-yellow-400/30" : ""}`}
                      >
                        <span
                          className={`font-bold text-sm ${vipColors[tier]} ${!isAchieved ? "opacity-40" : ""}`}
                        >
                          {isCurrent ? "👑 " : ""}
                          {tier}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ${thresholds[i].toLocaleString()}+ deposited
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}

        {/* SPIN TAB */}
        {activeTab === "spin" && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 text-center">
              <h3 className="font-black text-2xl mb-2">Daily Spin Wheel</h3>
              <p className="text-gray-400 text-sm mb-8">
                Spin once per day for bonus rewards!
              </p>

              {/* Wheel */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div
                  className="w-48 h-48 rounded-full border-4 border-yellow-400 flex items-center justify-center relative overflow-hidden transition-transform"
                  style={{
                    transform: `rotate(${spinDeg}deg)`,
                    transition: spinning
                      ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                      : "none",
                    background:
                      "conic-gradient(#1a1a1a 0deg 45deg, #222 45deg 90deg, #1a1a1a 90deg 135deg, #222 135deg 180deg, #1a1a1a 180deg 225deg, #222 225deg 270deg, #1a1a1a 270deg 315deg, #222 315deg 360deg)",
                  }}
                >
                  {spinRewards.map((reward, i) => (
                    <div
                      key={i}
                      className="absolute text-xs font-black text-yellow-400"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${i * 45}deg) translate(-50%, -80px)`,
                        transformOrigin: "top center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${reward}
                    </div>
                  ))}
                </div>
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 text-yellow-400 text-2xl">
                  ▼
                </div>
              </div>

              {spinResult && (
                <div
                  className={`mb-6 p-4 rounded-xl ${spinResult.reward > 0 ? "bg-green-400/10 border border-green-400/30" : "bg-gray-800"}`}
                >
                  <p
                    className={`font-black text-lg ${spinResult.reward > 0 ? "text-green-400" : "text-gray-400"}`}
                  >
                    {spinResult.message}
                  </p>
                </div>
              )}

              <button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full py-4 bg-yellow-400 text-black font-black text-lg rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RotateCcw
                  size={20}
                  className={spinning ? "animate-spin" : ""}
                />
                {spinning ? "Spinning..." : "SPIN NOW!"}
              </button>
              <p className="text-gray-500 text-xs mt-3">
                One free spin every 24 hours
              </p>
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <div className="max-w-lg mx-auto">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-xl mb-2 flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                Bonus Tasks
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Complete each task once to earn bonus rewards!
              </p>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const completed = currentUser?.tasksCompleted?.includes(
                    task.id,
                  );
                  return (
                    <div
                      key={task.id}
                      className={`flex justify-between items-center p-4 rounded-xl border ${
                        completed
                          ? "border-green-500/30 bg-green-500/5 opacity-60"
                          : "border-gray-800 bg-black"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{task.icon}</span>
                        <div>
                          <p
                            className={`font-semibold text-sm ${completed ? "line-through text-gray-500" : "text-white"}`}
                          >
                            {task.title}
                          </p>
                          <p className="text-yellow-400 text-xs font-bold">
                            +${task.reward} reward
                          </p>
                        </div>
                      </div>
                      {completed ? (
                        <span className="text-green-400 font-bold text-sm px-3 py-1 bg-green-400/10 rounded-lg">
                          ✓ Claimed
                        </span>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              const res = await userAPI.completeTask({
                                taskId: task.id,
                              });
                              toast.success(`✅ ${res.data.message}`);
                              fetchDashboard();
                            } catch (error) {
                              toast.error(
                                error.response?.data?.message || "Failed",
                              );
                            }
                          }}
                          className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs rounded-lg hover:bg-yellow-300 transition"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <Wallet className="text-yellow-400" size={20} />
              Transaction History
            </h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 bg-black rounded-xl border border-gray-800"
                  >
                    <div>
                      <p className="font-semibold capitalize">
                        {tx.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-gray-500 text-xs">{tx.description}</p>
                      <p className="text-gray-600 text-xs">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-black text-lg ${tx.type === "withdrawal" ? "text-red-400" : "text-green-400"}`}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}$
                        {tx.amount.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs capitalize font-semibold ${
                          tx.status === "approved"
                            ? "text-green-500"
                            : tx.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
