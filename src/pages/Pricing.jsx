import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Zap, ArrowRight, Star, Shield, Sparkles, Users, Clock, Globe } from 'lucide-react';
import { Footer } from './About';
import Navbar from '../components/Navbar';

const Pricing = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [annual, setAnnual] = useState(false);

    const handleLogin = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar dark />

            {/* Hero */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-600 to-teal-500 opacity-[0.06] rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full text-white font-bold text-sm mb-6">
                        <Sparkles size={14} /> Simple Pricing
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                        Plans That Scale<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            With Your Business.
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10">
                        Start free, upgrade when you need more. No hidden fees, no surprises.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-10 sm:mb-14">
                        <span className={`font-bold text-sm sm:text-base ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${annual ? 'translate-x-8' : 'translate-x-1'}`}></div>
                        </button>
                        <span className={`font-bold text-sm sm:text-base ${annual ? 'text-white' : 'text-slate-500'}`}>
                            Annual <span className="text-emerald-400 text-xs font-black ml-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">SAVE 20%</span>
                        </span>
                    </div>
                </div>
            </header>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {/* Starter */}
                    <PricingCard
                        name="Starter"
                        desc="Perfect for personal projects and small apps."
                        price={0}
                        period={annual ? '/yr' : '/mo'}
                        cta="Start Free"
                        onClick={handleLogin}
                        features={[
                            { text: 'Up to 3 monitors', included: true },
                            { text: '5-minute check interval', included: true },
                            { text: 'Email alerts', included: true },
                            { text: 'Basic dashboard', included: true },
                            { text: 'Business analytics', included: false },
                            { text: 'Monthly reports', included: false },
                            { text: 'Priority support', included: false },
                        ]}
                    />

                    {/* Pro */}
                    <PricingCard
                        name="Professional"
                        desc="For growing teams that need deeper insights."
                        price={annual ? 190 : 19}
                        period={annual ? '/yr' : '/mo'}
                        cta="Start 14-Day Trial"
                        onClick={handleLogin}
                        popular={true}
                        features={[
                            { text: 'Up to 25 monitors', included: true },
                            { text: '10-second check interval', included: true },
                            { text: 'Email + Slack alerts', included: true },
                            { text: 'Full dashboard & analytics', included: true },
                            { text: 'Business intelligence', included: true },
                            { text: 'Monthly reports', included: true },
                            { text: 'Priority support', included: false },
                        ]}
                    />

                    {/* Enterprise */}
                    <PricingCard
                        name="Enterprise"
                        desc="For organizations with critical infrastructure."
                        price={annual ? 790 : 79}
                        period={annual ? '/yr' : '/mo'}
                        cta="Contact Sales"
                        onClick={() => window.location.href = '/contact'}
                        features={[
                            { text: 'Unlimited monitors', included: true },
                            { text: '5-second check interval', included: true },
                            { text: 'All alert channels', included: true },
                            { text: 'Advanced BI dashboard', included: true },
                            { text: 'Custom integrations', included: true },
                            { text: 'White-label reports', included: true },
                            { text: 'Dedicated support team', included: true },
                        ]}
                    />
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="border-y border-slate-800 py-16 sm:py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">All Plans Include</h2>
                        <p className="text-slate-500 text-sm sm:text-base">Core features available on every tier.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <IncludedFeature icon={<Globe size={20} />} title="7 Monitor Types" desc="HTTP, SSL, Keyword, Port, Ping, API, DNS" />
                        <IncludedFeature icon={<Shield size={20} />} title="Incident Tracking" desc="Auto-created timelines with root cause" />
                        <IncludedFeature icon={<Zap size={20} />} title="Email Alerts" desc="State-change detection, zero noise" />
                        <IncludedFeature icon={<Clock size={20} />} title="Real-Time Dashboard" desc="Live updates with 10s polling" />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Loved by Teams Worldwide</h2>
                        <p className="text-slate-500 text-sm sm:text-base">See what our customers have to say.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <TestimonialCard
                            quote="Sentinel caught a critical API failure at 2 AM before any of our users noticed. Worth every penny."
                            name="Jordan Mitchell" role="CTO, FinStack" stars={5}
                        />
                        <TestimonialCard
                            quote="The dashboard is gorgeous. Finally, a monitoring tool that my non-technical team can actually understand."
                            name="Elena Rodriguez" role="VP Engineering, DataFlow" stars={5}
                        />
                        <TestimonialCard
                            quote="We switched from a $500/mo tool and got better features with Sentinel at a fraction of the cost."
                            name="Rahul Patel" role="Lead DevOps, CloudNine" stars={5}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-10 text-center">Frequently Asked</h2>
                <div className="space-y-3">
                    <FaqItem q="Can I upgrade or downgrade anytime?" a="Yes! You can switch plans at any time. Changes take effect immediately and billing is prorated." />
                    <FaqItem q="What happens when I hit my monitor limit?" a="You'll receive a notification. Your existing monitors continue working — you just can't add new ones until you upgrade." />
                    <FaqItem q="Do you offer refunds?" a="Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked." />
                    <FaqItem q="What payment methods do you accept?" a="We accept all major credit cards, PayPal, and bank transfers for Enterprise plans." />
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 text-center">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/5 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-black/5 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Start Monitoring Now</h2>
                        <p className="text-white/70 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                            No credit card required. Set up your first monitor in 60 seconds.
                        </p>
                        <button onClick={handleLogin}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-xl text-sm sm:text-base"
                        >Get Started Free</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* ───── Sub Components ───── */
const PricingCard = ({ name, desc, price, period, cta, popular, features, onClick }) => (
    <div className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 transition-all ${popular
        ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/20 md:scale-105 border-0'
        : 'bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-slate-700'
        }`}>
        {popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-emerald-600 text-[10px] sm:text-xs font-black rounded-full shadow-lg">
                ⭐ MOST POPULAR
            </div>
        )}
        <h3 className={`text-lg sm:text-xl font-black mb-1.5 ${popular ? 'text-white' : 'text-white'}`}>{name}</h3>
        <p className={`text-xs sm:text-sm mb-5 sm:mb-6 ${popular ? 'text-emerald-100' : 'text-slate-500'}`}>{desc}</p>
        <div className="mb-5 sm:mb-6">
            <span className={`text-3xl sm:text-4xl lg:text-5xl font-black ${popular ? 'text-white' : 'text-white'}`}>
                ${price}
            </span>
            <span className={`text-sm font-bold ml-1 ${popular ? 'text-emerald-200' : 'text-slate-500'}`}>{period}</span>
        </div>
        <button onClick={onClick}
            className={`w-full text-center py-3 rounded-xl font-bold mb-6 sm:mb-8 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm ${popular
                ? 'bg-white text-emerald-600 shadow-lg'
                : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                }`}
        >{cta}</button>
        <div className="space-y-2.5 sm:space-y-3">
            {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 sm:gap-3">
                    {f.included
                        ? <Check size={14} className={popular ? 'text-emerald-200' : 'text-emerald-400'} />
                        : <X size={14} className={popular ? 'text-emerald-300/30' : 'text-slate-700'} />
                    }
                    <span className={`text-xs sm:text-sm font-medium ${f.included
                        ? (popular ? 'text-white' : 'text-slate-300')
                        : (popular ? 'text-emerald-200/40' : 'text-slate-600')
                        }`}>{f.text}</span>
                </div>
            ))}
        </div>
    </div>
);

const IncludedFeature = ({ icon, title, desc }) => (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-5 text-center hover:border-slate-700 transition-all">
        <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">{icon}</div>
        <h4 className="font-black text-white text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
    </div>
);

const TestimonialCard = ({ quote, name, role, stars }) => (
    <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-5 sm:p-6 lg:p-8 border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex gap-1 mb-4">
            {[...Array(stars)].map((_, i) => (
                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
            ))}
        </div>
        <p className="text-slate-300 leading-relaxed mb-5 text-xs sm:text-sm">"{quote}"</p>
        <div>
            <p className="font-bold text-white text-sm">{name}</p>
            <p className="text-xs text-slate-500">{role}</p>
        </div>
    </div>
);

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
            <button onClick={() => setOpen(!open)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left font-bold text-white flex justify-between items-center text-sm sm:text-base">
                {q}
                <span className={`text-slate-500 text-lg transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open && <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-slate-400 text-xs sm:text-sm leading-relaxed">{a}</div>}
        </div>
    );
};

export default Pricing;
