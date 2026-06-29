import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, depositsRes, withdrawalsRes, usersRes] =
        await Promise.all([
          adminAPI.getStats(),
          adminAPI.getPendingDeposits(),
          adminAPI.getPendingWithdrawals(),
          adminAPI.getUsers(),
        ]);
      setStats(statsRes.data);
      setPendingDeposits(depositsRes.data.deposits);
      setPendingWithdrawals(withdrawalsRes.data.withdrawals);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (id) => {
    try {
      await adminAPI.approveDeposit(id);
      toast.success("Deposit approved!");
      fetchAll();
    } catch (error) {
      toast.error("Failed to approve deposit");
    }
  };

  const handleRejectDeposit = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    try {
      await adminAPI.rejectDeposit(id, reason);
      toast.success("Deposit rejected");
      fetchAll();
    } catch (error) {
      toast.error("Failed to reject deposit");
    }
  };

  const handleApproveWithdrawal = async (id) => {
    try {
      await adminAPI.approveWithdrawal(id);
      toast.success("Withdrawal approved!");
      fetchAll();
    } catch (error) {
      toast.error("Failed to approve withdrawal");
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    try {
      await adminAPI.rejectWithdrawal(id, reason);
      toast.success("Withdrawal rejected and refunded");
      fetchAll();
    } catch (error) {
      toast.error("Failed to reject withdrawal");
    }
  };

  const handleBanUser = async (id, username, isBanned) => {
    if (!window.confirm(`${isBanned ? "Unban" : "Ban"} user ${username}?`))
      return;
    try {
      await adminAPI.banUser(id);
      toast.success(`User ${isBanned ? "unbanned" : "banned"}`);
      fetchAll();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-400 font-bold">Loading Admin Panel...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Nav */}
      <nav className="bg-gray-950 border-b border-red-800/50 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="text-red-400" size={20} />
            <span className="text-red-400 font-black">VaultX Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">{user?.username}</span>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-800 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            {
              label: "Total Users",
              value: stats?.totalUsers || 0,
              icon: <Users size={18} />,
              color: "text-blue-400",
            },
            {
              label: "Total Deposits",
              value: `$${(stats?.totalDeposits || 0).toFixed(2)}`,
              icon: <TrendingUp size={18} />,
              color: "text-green-400",
            },
            {
              label: "Total Withdrawn",
              value: `$${(stats?.totalWithdrawals || 0).toFixed(2)}`,
              icon: <DollarSign size={18} />,
              color: "text-red-400",
            },
            {
              label: "Pending Deposits",
              value: stats?.pendingDeposits || 0,
              icon: <Clock size={18} />,
              color: "text-yellow-400",
            },
            {
              label: "Pending Withdrawals",
              value: stats?.pendingWithdrawals || 0,
              icon: <Clock size={18} />,
              color: "text-orange-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-950 border border-gray-800 rounded-xl p-4"
            >
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "stats", label: "📊 Overview" },
            {
              key: "deposits",
              label: `💰 Deposits (${pendingDeposits.length})`,
            },
            {
              key: "withdrawals",
              label: `📤 Withdrawals (${pendingWithdrawals.length})`,
            },
            { key: "users", label: `👥 Users (${users.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab.key
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DEPOSITS TAB */}
        {activeTab === "deposits" && (
          <div className="space-y-4">
            <h2 className="font-black text-xl">Pending Deposits</h2>
            {pendingDeposits.length === 0 ? (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 text-center">
                <CheckCircle
                  className="text-green-400 mx-auto mb-3"
                  size={40}
                />
                <p className="text-gray-400">No pending deposits. All clear!</p>
              </div>
            ) : (
              pendingDeposits.map((deposit, i) => (
                <div
                  key={i}
                  className="bg-gray-950 border border-yellow-400/20 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-lg text-yellow-400">
                        ${deposit.amount.toFixed(2)} USDT
                      </p>
                      <p className="text-white font-semibold">
                        {deposit.user?.username}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {deposit.user?.email}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(deposit.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="bg-yellow-400/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                      PENDING
                    </span>
                  </div>
                  {deposit.txHash && (
                    <div className="bg-black rounded-lg p-3 mb-4">
                      <p className="text-gray-500 text-xs mb-1">
                        Transaction Hash:
                      </p>
                      <p className="text-gray-300 font-mono text-xs break-all">
                        {deposit.txHash}
                      </p>
                    </div>
                  )}
                  {deposit.memo && (
                    <div className="bg-black rounded-lg p-3 mb-4">
                      <p className="text-gray-500 text-xs mb-1">
                        Memo (UserID):
                      </p>
                      <p className="text-gray-300 font-mono text-xs">
                        {deposit.memo}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveDeposit(deposit._id)}
                      className="flex-1 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectDeposit(deposit._id)}
                      className="flex-1 py-2 bg-red-700 text-white font-bold rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* WITHDRAWALS TAB */}
        {activeTab === "withdrawals" && (
          <div className="space-y-4">
            <h2 className="font-black text-xl">Pending Withdrawals</h2>
            {pendingWithdrawals.length === 0 ? (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 text-center">
                <CheckCircle
                  className="text-green-400 mx-auto mb-3"
                  size={40}
                />
                <p className="text-gray-400">
                  No pending withdrawals. All clear!
                </p>
              </div>
            ) : (
              pendingWithdrawals.map((withdrawal, i) => (
                <div
                  key={i}
                  className="bg-gray-950 border border-orange-400/20 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-lg text-orange-400">
                        ${withdrawal.amount.toFixed(2)} USDT
                      </p>
                      <p className="text-white font-semibold">
                        {withdrawal.user?.username}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {withdrawal.user?.email}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="bg-orange-400/20 text-orange-400 text-xs font-bold px-2 py-1 rounded-full">
                      PENDING
                    </span>
                  </div>
                  <div className="bg-black rounded-lg p-3 mb-4">
                    <p className="text-gray-500 text-xs mb-1">
                      Send to wallet:
                    </p>
                    <p className="text-yellow-400 font-mono text-xs break-all">
                      {withdrawal.walletAddress}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveWithdrawal(withdrawal._id)}
                      className="flex-1 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve & Send
                    </button>
                    <button
                      onClick={() => handleRejectWithdrawal(withdrawal._id)}
                      className="flex-1 py-2 bg-red-700 text-white font-bold rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject & Refund
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div>
            <h2 className="font-black text-xl mb-4">
              All Users ({users.length})
            </h2>
            <div className="space-y-3">
              {users.map((u, i) => (
                <div
                  key={i}
                  className={`bg-gray-950 border rounded-xl p-4 ${u.isBanned ? "border-red-800" : "border-gray-800"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{u.username}</p>
                        {u.isAdmin && (
                          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                        {u.isBanned && (
                          <span className="bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full">
                            Banned
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Balance:{" "}
                          <span className="text-yellow-400 font-bold">
                            ${u.balance?.toFixed(2)}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Plan:{" "}
                          <span className="text-white capitalize">
                            {u.plan}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          VIP: <span className="text-white">{u.vipTier}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">
                        Joined: {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!u.isAdmin && (
                      <button
                        onClick={() =>
                          handleBanUser(u._id, u.username, u.isBanned)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                          u.isBanned
                            ? "bg-green-700 text-white hover:bg-green-600"
                            : "bg-red-800 text-white hover:bg-red-700"
                        }`}
                      >
                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("deposits")}
                  className="w-full py-3 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400/20 transition flex justify-between items-center px-4"
                >
                  <span>Review Pending Deposits</span>
                  <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {pendingDeposits.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("withdrawals")}
                  className="w-full py-3 bg-orange-400/10 border border-orange-400/30 text-orange-400 font-bold rounded-xl hover:bg-orange-400/20 transition flex justify-between items-center px-4"
                >
                  <span>Process Withdrawals</span>
                  <span className="bg-orange-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {pendingWithdrawals.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full py-3 bg-blue-400/10 border border-blue-400/30 text-blue-400 font-bold rounded-xl hover:bg-blue-400/20 transition flex justify-between items-center px-4"
                >
                  <span>Manage Users</span>
                  <span className="bg-blue-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {users.length}
                  </span>
                </button>
              </div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-lg mb-4">Platform Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Users", value: stats?.totalUsers || 0 },
                  {
                    label: "Total Deposited",
                    value: `$${(stats?.totalDeposits || 0).toFixed(2)}`,
                  },
                  {
                    label: "Total Withdrawn",
                    value: `$${(stats?.totalWithdrawals || 0).toFixed(2)}`,
                  },
                  {
                    label: "Net Balance",
                    value: `$${((stats?.totalDeposits || 0) - (stats?.totalWithdrawals || 0)).toFixed(2)}`,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
                  >
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="font-black text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
