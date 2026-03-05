import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Target, Heart, Globe, Zap, Award, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero */}
            <header className="max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 font-bold text-sm mb-6">
                    <Shield size={16} /> About Sentinel
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                    Built by Engineers,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                        For Engineers.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                    We started Sentinel because downtime costs businesses more than money — it costs trust.
                    Our mission is to make infrastructure monitoring accessible, beautiful, and intelligent.
                </p>
            </header>

            {/* Story Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-8 pb-16 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Our Story</h2>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>
                                Sentinel was born out of frustration. As software engineers, we spent countless hours
                                debugging production issues that could have been caught earlier with proper monitoring.
                            </p>
                            <p>
                                The tools available were either too complex for small teams or too simplistic for
                                growing businesses. We wanted something in between — powerful enough for enterprise
                                use, yet beautiful and intuitive enough for a solo developer.
                            </p>
                            <p>
                                Today, Sentinel monitors thousands of endpoints worldwide, helping teams of all sizes
                                stay ahead of downtime and deliver reliable digital experiences.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <StatBox number="99.9%" label="Platform Uptime" />
                        <StatBox number="10s" label="Check Interval" />
                        <StatBox number="500+" label="Active Monitors" />
                        <StatBox number="24/7" label="Alert Coverage" />
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-slate-900 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="bg-slate-800/50 rounded-3xl p-8 md:p-10 border border-slate-700">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="text-emerald-400" size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Our Mission</h3>
                            <p className="text-slate-400 leading-relaxed">
                                To empower every developer and business with enterprise-grade monitoring tools
                                that are beautiful, affordable, and incredibly easy to use. We believe that
                                no service should go down unnoticed.
                            </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-3xl p-8 md:p-10 border border-slate-700">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <Globe className="text-blue-400" size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">Our Vision</h3>
                            <p className="text-slate-400 leading-relaxed">
                                A world where infrastructure reliability is a given, not a luxury. We're building
                                the future of proactive monitoring — using AI-powered insights to predict and prevent
                                downtime before it impacts your users.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Meet the Team</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        A passionate group of engineers, designers, and problem-solvers committed to keeping your services online.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <TeamCard name="Alex Rivera" role="Founder & CEO" emoji="👨‍💻" />
                    <TeamCard name="Sarah Chen" role="Lead Engineer" emoji="👩‍🔬" />
                    <TeamCard name="Marcus Johnson" role="DevOps Architect" emoji="🛠️" />
                    <TeamCard name="Priya Sharma" role="Product Designer" emoji="🎨" />
                </div>
            </section>

            {/* Values */}
            <section className="bg-emerald-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <ValueCard icon={<Zap className="text-emerald-500" />} title="Speed First" desc="Every millisecond matters. We optimize relentlessly so you get alerts before your users notice." />
                        <ValueCard icon={<Heart className="text-rose-500" />} title="User Obsessed" desc="We build tools we'd want to use ourselves. Beautiful UIs, zero learning curve." />
                        <ValueCard icon={<Award className="text-amber-500" />} title="Radical Transparency" desc="Open incident reports, public status pages, and honest communication — always." />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Ready to join us?</h2>
                <p className="text-slate-500 mb-8 max-w-lg mx-auto">Start monitoring your infrastructure in under 60 seconds.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl text-lg hover:scale-105 transition-transform shadow-2xl">
                    Get Started <ArrowRight size={20} />
                </Link>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

const StatBox = ({ number, label }) => (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 text-center shadow-sm">
        <h4 className="text-2xl md:text-3xl font-black text-emerald-500 mb-1">{number}</h4>
        <p className="text-sm font-bold text-slate-500">{label}</p>
    </div>
);

const TeamCard = ({ name, role, emoji }) => (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 text-center shadow-sm hover:shadow-lg transition-shadow">
        <div className="text-5xl mb-4">{emoji}</div>
        <h4 className="text-lg font-black text-slate-900">{name}</h4>
        <p className="text-sm font-bold text-emerald-500">{role}</p>
    </div>
);

const ValueCard = ({ icon, title, desc }) => (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4">{icon}</div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
);

const Footer = () => (
    <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h5 className="text-white font-black mb-4">Product</h5>
                    <div className="space-y-2">
                        <Link to="/features" className="block text-slate-400 hover:text-white text-sm transition-colors">Features</Link>
                        <Link to="/pricing" className="block text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link>
                    </div>
                </div>
                <div>
                    <h5 className="text-white font-black mb-4">Company</h5>
                    <div className="space-y-2">
                        <Link to="/about" className="block text-slate-400 hover:text-white text-sm transition-colors">About</Link>
                        <Link to="/contact" className="block text-slate-400 hover:text-white text-sm transition-colors">Contact</Link>
                    </div>
                </div>
                <div>
                    <h5 className="text-white font-black mb-4">Legal</h5>
                    <div className="space-y-2">
                        <span className="block text-slate-400 text-sm">Privacy Policy</span>
                        <span className="block text-slate-400 text-sm">Terms of Service</span>
                    </div>
                </div>
                <div>
                    <h5 className="text-white font-black mb-4">Connect</h5>
                    <div className="space-y-2">
                        <a href="https://twitter.com" className="block text-slate-400 hover:text-white text-sm transition-colors">Twitter</a>
                        <a href="https://github.com" className="block text-slate-400 hover:text-white text-sm transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-white font-black">
                    <span className="text-emerald-500">●</span> Sentinel
                </div>
                <p className="text-slate-500 text-sm">© 2026 Sentinel. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export { Footer };
export default About;
