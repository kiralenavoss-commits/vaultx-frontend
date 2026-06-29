import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import { ArrowLeft, Copy, Gift, Share2 } from "lucide-react";

export default function Referral() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await userAPI.getDashboard();
      setDashboard(res.data);
    } catch (error) {
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referralCode);
    toast.success("Referral code copied!");
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join VaultX - Earn Daily on Crypto",
        text: "Join VaultX and get a free $5 bonus! Earn daily returns on USDT.",
        url: referralLink,
      });
    } else {
      copyLink();
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const currentUser = dashboard?.user || user;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-yellow-400 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black">Referral Program</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-yellow-400">
              {currentUser?.referralLevel1?.length || 0}
            </p>
            <p className="text-gray-500 text-xs">Level 1</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-yellow-400">
              {currentUser?.referralLevel2?.length || 0}
            </p>
            <p className="text-gray-500 text-xs">Level 2</p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-green-400">
              $
              {(
                (currentUser?.referralLevel1?.length || 0) * 2 +
                (currentUser?.referralLevel2?.length || 0) * 1
              ).toFixed(0)}
            </p>
            <p className="text-gray-500 text-xs">Earned</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="font-black text-lg mb-4 flex items-center gap-2">
            <Gift className="text-yellow-400" size={20} />
            How It Works
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 text-black font-black text-sm">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">
                  Share your referral link
                </p>
                <p className="text-gray-500 text-xs">
                  Send your unique link to friends and family
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 text-black font-black text-sm">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">They join VaultX</p>
                <p className="text-gray-500 text-xs">
                  Your friend signs up using your link and gets $5 free
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 text-black font-black text-sm">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">
                  You earn referral bonuses
                </p>
                <p className="text-gray-500 text-xs">
                  $2 per Level 1 referral • $1 per Level 2 referral
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-yellow-400">10%</p>
            <p className="text-gray-300 font-semibold text-sm">
              Level 1 Commission
            </p>
            <p className="text-gray-500 text-xs mt-1">
              On their daily earnings
            </p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-yellow-400">5%</p>
            <p className="text-gray-300 font-semibold text-sm">
              Level 2 Commission
            </p>
            <p className="text-gray-500 text-xs mt-1">
              On their referrals' earnings
            </p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-4">
          <p className="text-gray-400 text-sm mb-2">Your Referral Code</p>
          <div className="flex items-center justify-between bg-black rounded-xl p-4 border border-gray-700 mb-4">
            <p className="text-yellow-400 font-black text-xl tracking-widest">
              {user?.referralCode}
            </p>
            <button
              onClick={copyCode}
              className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition"
            >
              <Copy size={16} className="text-yellow-400" />
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-2">Your Referral Link</p>
          <div className="flex items-center justify-between bg-black rounded-xl p-3 border border-gray-700 mb-4">
            <p className="text-gray-300 text-xs truncate mr-2">
              {referralLink}
            </p>
            <button
              onClick={copyLink}
              className="shrink-0 p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition"
            >
              <Copy size={16} className="text-yellow-400" />
            </button>
          </div>

          <button
            onClick={shareLink}
            className="w-full py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-300 transition flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share My Referral Link
          </button>
        </div>

        {/* Referral tip */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm font-semibold">
            💡 Pro Tip: Share on WhatsApp, Telegram, and social media for
            maximum referrals!
          </p>
        </div>
      </div>
    </div>
  );
}
