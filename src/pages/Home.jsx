import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Zap, BarChart3, Bell, Globe, ArrowRight, Star,
  CheckCircle2, Activity, Lock, Search, Plug, Radio, Code, Waypoints
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Footer } from './About';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar dark={true} onOpenLogin={() => setIsLoginModalOpen(true)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={handleRegisterClick}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={handleLoginClick}
      />

      {/* Hero Section — Dark */}
      <header className="max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-24 pb-20 md:pb-36 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm mb-8">
            <Zap size={14} /> Real-time monitoring with 10-second pings
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Infrastructure<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Monitoring Platform
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track uptime, SSL certificates, DNS, ports, keywords, and API health
            in one beautiful, real-time dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl text-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              Start Free Monitoring <ArrowRight size={20} />
            </button>
            <Link
              to="/features"
              className="px-8 py-4 bg-slate-800 text-slate-300 font-bold rounded-xl text-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-all text-center"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </header>

      {/* Monitor Types Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20 md:pb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">7 Monitor Types. One Platform.</h2>
          <p className="text-slate-400 max-w-lg mx-auto">From HTTP pings to SSL expiry — we've got every angle covered.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <TypePill icon={<Globe size={20} />} label="HTTP(S)" desc="Endpoint" />
          <TypePill icon={<Lock size={20} />} label="SSL" desc="Certificate" />
          <TypePill icon={<Search size={20} />} label="Keyword" desc="Content" />
          <TypePill icon={<Plug size={20} />} label="Port" desc="TCP" />
          <TypePill icon={<Radio size={20} />} label="Ping" desc="ICMP" />
          <TypePill icon={<Code size={20} />} label="API" desc="REST" />
          <TypePill icon={<Waypoints size={20} />} label="DNS" desc="Resolution" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Activity className="text-emerald-400" />}
            title="Real-time Pings"
            desc="10-second heartbeats with state-change detection. Know the instant anything falters."
            accent="emerald"
          />
          <FeatureCard
            icon={<BarChart3 className="text-blue-400" />}
            title="Business Intelligence"
            desc="Uptime percentages, response time analytics, and incident tracking in one dashboard."
            accent="blue"
          />
          <FeatureCard
            icon={<Shield className="text-purple-400" />}
            title="Professional Alerts"
            desc="HTML email alerts with root-cause analysis. Only on state changes — no spam."
            accent="purple"
          />
          <FeatureCard
            icon={<Bell className="text-amber-400" />}
            title="Incident Timeline"
            desc="Detailed activity logs with timestamps, response times, and failure root causes."
            accent="amber"
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-slate-800 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Trusted by Engineering Teams</h2>
            <p className="text-slate-500">See what our users say about Sentinel.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="We caught a critical outage at 2 AM before any customer reported it. Sentinel paid for itself in one night."
              name="Jordan Mitchell"
              role="CTO, FinStack"
            />
            <TestimonialCard
              quote="The dashboard design is stunning. Our entire team uses it daily — even non-technical stakeholders."
              name="Elena Rodriguez"
              role="VP Engineering, DataFlow"
            />
            <TestimonialCard
              quote="Switched from a $500/mo competitor. Better SSL monitoring, better alerts, way better price."
              name="Rahul Patel"
              role="Lead DevOps, CloudNine"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Get Started in 60 Seconds</h2>
          <p className="text-slate-500">Three steps to complete infrastructure visibility.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StepCard number="01" title="Add Your Endpoint" desc="Enter any URL, hostname or IP. Choose from 7 monitor types. We start monitoring immediately." />
          <StepCard number="02" title="Watch Real-Time" desc="Your dashboard updates every 10 seconds with live UP/DOWN status, response times, and SSL data." />
          <StepCard number="03" title="Get Instant Alerts" desc="Professional HTML email alerts with root cause analysis the moment something goes wrong." />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 pb-20 md:pb-28 text-center">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <Globe size={48} className="mx-auto mb-6 text-emerald-200/60" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Monitor?</h2>
            <p className="text-emerald-100/80 max-w-lg mx-auto mb-8">
              Join hundreds of teams who trust Sentinel to keep their services online.
            </p>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Start Monitoring — Free
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const TypePill = ({ icon, label, desc }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-emerald-500/40 hover:bg-slate-800/50 transition-all group cursor-default">
    <div className="text-emerald-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
    <p className="font-black text-white text-sm">{label}</p>
    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc, accent }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:border-slate-700 transition-all group">
    <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center mb - 6 bg - ${accent} -500 / 10 group - hover: scale - 110 transition - transform`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

const TestimonialCard = ({ quote, name, role }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
    <p className="text-slate-300 leading-relaxed mb-6 text-sm">"{quote}"</p>
    <div>
      <p className="font-bold text-white text-sm">{name}</p>
      <p className="text-xs text-slate-500">{role}</p>
    </div>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="text-center">
    <div className="text-5xl md:text-6xl font-black text-emerald-500/15 mb-4">{number}</div>
    <h4 className="text-xl font-black text-white mb-3">{title}</h4>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Home;