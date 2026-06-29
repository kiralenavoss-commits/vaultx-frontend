import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Users, Zap, Star, ChevronRight, Clock } from 'lucide-react';

// Simulated live activity feed
const activities = [
  "John D. just earned $12.50 from Gold plan",
  "Sarah M. withdrew $250 successfully",
  "Ahmed K. joined using referral code",
  "Lisa T. just earned $45.00 from Elite plan",
  "Mike R. upgraded to Diamond plan",
  "Fatima A. won $10 on the spin wheel",
  "David L. just earned $8.75 from Silver plan",
  "Emma W. referred 3 friends today",
  "James O. withdrew $500 successfully",
  "Aisha B. joined VaultX and got $5 bonus",
  "Chen W. upgraded to Gold plan",
  "Maria S. earned $120 from Diamond plan",
];

const plans = [
  { name: 'Basic', rate: '1.5%', min: '$50', max: '$999', color: 'border-gray-500', badge: 'bg-gray-700' },
  { name: 'Silver', rate: '2.5%', min: '$1,000', max: '$4,999', color: 'border-gray-400', badge: 'bg-gray-600' },
  { name: 'Gold', rate: '4%', min: '$5,000', max: '$9,999', color: 'border-yellow-400', badge: 'bg-yellow-600', popular: true },
  { name: 'Diamond', rate: '6%', min: '$10,000', max: '$49,999', color: 'border-blue-400', badge: 'bg-blue-700' },
  { name: 'Elite', rate: '8%', min: '$50,000', max: 'Unlimited', color: 'border-purple-400', badge: 'bg-purple-700' },
];

const testimonials = [
  { name: 'James O.', location: 'Lagos, Nigeria', text: 'I started with the Basic plan and within a month upgraded to Gold. VaultX is the real deal!', stars: 5, earned: '$1,240' },
  { name: 'Sarah M.', location: 'Nairobi, Kenya', text: 'The daily earnings hit my balance every single day. Withdrew $500 with zero issues.', stars: 5, earned: '$3,800' },
  { name: 'Ahmed K.', location: 'Dubai, UAE', text: 'Referred 12 friends and earned $240 in referral bonuses alone. Amazing system!', stars: 5, earned: '$5,600' },
  { name: 'Maria S.', location: 'London, UK', text: 'The spin wheel gives me extra earnings daily. Love the VIP rewards system!', stars: 5, earned: '$2,100' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentActivity, setCurrentActivity] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [stats, setStats] = useState({ users: 12847, paid: 2847293, online: 342 });

  // Rotate activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 3),
        paid: prev.paid + Math.floor(Math.random() * 500),
        online: 300 + Math.floor(Math.random() * 100)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">VX</span>
            </div>
            <span className="text-xl font-black text-yellow-400">VaultX</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/10 transition font-semibold text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition text-sm"
            >
              Start Earning
            </button>
          </div>
        </div>
      </nav>

      {/* LIVE ACTIVITY TICKER */}
      <div className="fixed top-16 w-full z-40 bg-yellow-400/10 border-b border-yellow-400/20 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold whitespace-nowrap">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
          <p className="text-xs text-gray-300 animate-pulse">{activities[currentActivity]}</p>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">

          {/* Welcome bonus timer */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold">
              Welcome Bonus expires in: {String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            Your Crypto.
            <span className="text-yellow-400 block">Always Earning.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join <span className="text-yellow-400 font-bold">{stats.users.toLocaleString()}+ investors</span> earning daily returns on USDT. Start with a free $5 bonus — no credit card needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-yellow-400 text-black font-black text-lg rounded-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg shadow-yellow-400/30"
            >
              Claim Your $5 Bonus 🎁
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-bold text-lg rounded-xl hover:bg-yellow-400/10 transition"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <p className="text-yellow-400 font-black text-xl">{stats.users.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">Total Users</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <p className="text-yellow-400 font-black text-xl">${(stats.paid / 1000000).toFixed(2)}M</p>
              <p className="text-gray-500 text-xs">Total Paid</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
              <p className="text-green-400 font-black text-xl">{stats.online}</p>
              <p className="text-gray-500 text-xs">Online Now</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Why Choose <span className="text-yellow-400">VaultX?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <TrendingUp className="text-yellow-400" size={28} />, title: 'Daily Earnings', desc: 'Earn up to 8% daily on your USDT deposit. Returns credited every 24 hours automatically.' },
              { icon: <Shield className="text-yellow-400" size={28} />, title: 'Secure & Trusted', desc: 'Your funds are protected with military-grade encryption and multi-layer security.' },
              { icon: <Users className="text-yellow-400" size={28} />, title: '2-Level Referrals', desc: 'Earn 10% on direct referrals and 5% on their referrals. Build your passive income network.' },
              { icon: <Zap className="text-yellow-400" size={28} />, title: 'Instant Withdrawals', desc: 'Request withdrawals anytime. Processed within 24 hours directly to your USDT wallet.' },
              { icon: <Star className="text-yellow-400" size={28} />, title: 'VIP Rewards', desc: 'Climb from Bronze to Elite tier. Unlock exclusive bonuses, higher limits and special perks.' },
              { icon: <ChevronRight className="text-yellow-400" size={28} />, title: 'Daily Spin Wheel', desc: 'Spin every day for bonus rewards up to $10. Free spins for all members every 24 hours.' },
            ].map((feature, i) => (
              <div key={i} className="bg-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">
            Investment <span className="text-yellow-400">Plans</span>
          </h2>
          <p className="text-gray-400 text-center mb-12">Choose a plan that matches your investment goal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {plans.map((plan, i) => (
              <div key={i} className={`relative bg-gray-950 border-2 ${plan.color} rounded-xl p-5 hover:scale-105 transition`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">POPULAR</span>
                  </div>
                )}
                <div className={`inline-block ${plan.badge} text-white text-xs font-bold px-2 py-1 rounded mb-3`}>
                  {plan.name}
                </div>
                <div className="text-3xl font-black text-yellow-400 mb-1">{plan.rate}</div>
                <div className="text-gray-400 text-xs mb-3">Daily Returns</div>
                <div className="text-xs text-gray-500">Min: {plan.min}</div>
                <div className="text-xs text-gray-500">Max: {plan.max}</div>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-4 w-full py-2 bg-yellow-400 text-black font-bold text-xs rounded-lg hover:bg-yellow-300 transition"
                >
                  Start Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            What Our <span className="text-yellow-400">Investors Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-black border border-gray-800 rounded-xl p-6 hover:border-yellow-400/30 transition">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-4">"{t.text}"</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-black">{t.earned}</p>
                    <p className="text-gray-500 text-xs">Total Earned</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            Ready to Start <span className="text-yellow-400">Earning?</span>
          </h2>
          <p className="text-gray-400 mb-8">Join thousands of investors earning daily. Get your free $5 bonus today.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-yellow-400 text-black font-black text-xl rounded-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-2xl shadow-yellow-400/30"
          >
            Create Free Account 🚀
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-black font-black text-xs">VX</span>
            </div>
            <span className="text-yellow-400 font-black">VaultX</span>
          </div>
          <p className="text-gray-600 text-xs text-center">
            © 2024 VaultX. Your Crypto. Always Earning. | Investment involves risk. Only invest what you can afford.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="cursor-pointer hover:text-yellow-400">Terms</span>
            <span className="cursor-pointer hover:text-yellow-400">Privacy</span>
            <span className="cursor-pointer hover:text-yellow-400">Support</span>
          </div>
        </div>
      </footer>

    </div>
  );
}