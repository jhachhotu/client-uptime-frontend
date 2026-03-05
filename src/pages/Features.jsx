import React from 'react';
import { Link } from 'react-router-dom';
import {
    Zap, BarChart3, Shield, Bell, Clock, Globe,
    Activity, Mail, Server, Lock, Smartphone,
    ArrowRight, CheckCircle2, LineChart
} from 'lucide-react';
import { Footer } from './About';
import Navbar from '../components/Navbar';

const Features = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero */}
            <header className="max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 font-bold text-sm mb-6">
                    <Zap size={16} /> Powerful Features
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                    Everything You Need<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                        to Stay Online.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                    From real-time pings to business intelligence — Sentinel gives you full visibility
                    into your infrastructure's health.
                </p>
            </header>

            {/* Main Feature Grid */}
            <section className="max-w-7xl mx-auto px-6 md:px-8 pb-16 md:pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard
                        icon={<Activity className="text-emerald-500" />}
                        title="Real-Time Monitoring"
                        desc="10-second heartbeat intervals ensure you know the instant a service goes down. No delays, no blind spots."
                        highlight={true}
                    />
                    <FeatureCard
                        icon={<Bell className="text-amber-500" />}
                        title="Instant Alerts"
                        desc="Professional HTML email alerts with root cause analysis sent the moment downtime is detected."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="text-blue-500" />}
                        title="Business Analytics"
                        desc="Map infrastructure health to business impact. See uptime percentages, response time trends, and incident history."
                    />
                    <FeatureCard
                        icon={<Shield className="text-purple-500" />}
                        title="Enterprise Security"
                        desc="Secured by modern JWT and Google authentication integrations. Your monitoring data is protected by enterprise-grade security."
                    />
                    <FeatureCard
                        icon={<Clock className="text-rose-500" />}
                        title="Incident Timeline"
                        desc="Detailed activity logs with timestamps, response times, and status changes — all in a beautiful timeline view."
                    />
                    <FeatureCard
                        icon={<Globe className="text-teal-500" />}
                        title="Multi-Protocol Checks"
                        desc="Monitor HTTP/HTTPS endpoints with smart bot-filter bypass. Support for Vercel, Netlify, and all modern hosting."
                    />
                    <FeatureCard
                        icon={<Mail className="text-indigo-500" />}
                        title="Monthly Reports"
                        desc="Automated professional HTML reports delivered on the 1st of every month with uptime stats and insights."
                    />
                    <FeatureCard
                        icon={<Server className="text-orange-500" />}
                        title="Microservice Architecture"
                        desc="Built on Spring Boot microservices with Eureka discovery, Config Server, and API Gateway for scalability."
                    />
                    <FeatureCard
                        icon={<Lock className="text-slate-500" />}
                        title="State Change Detection"
                        desc="Smart alerts only when status actually changes — no alert fatigue. Get notified on transitions, not every ping."
                    />
                </div>
            </section>

            {/* Feature Showcase */}
            <section className="bg-slate-900 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Three simple steps to complete visibility.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <StepCard number="01" title="Add Your Endpoint" desc="Enter your website URL and we'll start monitoring immediately. No complex configuration needed." />
                        <StepCard number="02" title="Real-Time Dashboard" desc="Watch live status updates every 10 seconds. Green means safe, red means action needed." />
                        <StepCard number="03" title="Get Alerted Instantly" desc="Receive professional email alerts with root cause analysis the moment something goes wrong." />
                    </div>
                </div>
            </section>

            {/* Checklist */}
            <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Why Teams Choose Sentinel</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            We combine the power of enterprise monitoring with the simplicity of modern design.
                        </p>
                        <div className="space-y-4">
                            <CheckItem text="10-second monitoring intervals for real-time awareness" />
                            <CheckItem text="Smart state-change detection prevents alert fatigue" />
                            <CheckItem text="Beautiful, responsive dashboard works on any device" />
                            <CheckItem text="Professional HTML email alerts with root cause analysis" />
                            <CheckItem text="Automated monthly uptime reports" />
                            <CheckItem text="Enterprise-grade JWT security and Google Auth" />
                            <CheckItem text="Complete incident timeline with response time tracking" />
                            <CheckItem text="Business intelligence with uptime-to-impact mapping" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
                        <LineChart size={48} className="mb-6 opacity-80" />
                        <h3 className="text-2xl font-black mb-3">99.9% Uptime Guarantee</h3>
                        <p className="text-emerald-100 leading-relaxed mb-6">
                            Our monitoring platform itself runs on distributed infrastructure ensuring
                            your monitors are always watching.
                        </p>
                        <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:scale-105 transition-transform">
                            View Plans <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, highlight }) => (
    <div className={`p-6 md:p-8 rounded-2xl border transition-all hover:shadow-lg ${highlight
        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400'
        : 'bg-white border-slate-100 shadow-sm'
        }`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${highlight ? 'bg-white/20' : 'bg-slate-50'
            }`}>
            {icon}
        </div>
        <h3 className={`text-xl font-bold mb-2 ${highlight ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${highlight ? 'text-emerald-100' : 'text-slate-500'}`}>{desc}</p>
    </div>
);

const StepCard = ({ number, title, desc }) => (
    <div className="text-center">
        <div className="text-5xl md:text-6xl font-black text-emerald-500/20 mb-4">{number}</div>
        <h4 className="text-xl font-black text-white mb-3">{title}</h4>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const CheckItem = ({ text }) => (
    <div className="flex items-start gap-3">
        <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
        <span className="text-slate-700 font-medium">{text}</span>
    </div>
);

export default Features;
