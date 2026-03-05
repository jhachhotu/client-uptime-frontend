import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Mail, Phone, MapPin, Send, MessageSquare, Github, Twitter, Linkedin,
    ArrowRight, Sparkles, Clock, CheckCircle2, Globe, ExternalLink
} from 'lucide-react';
import { Footer } from './About';
import Navbar from '../components/Navbar';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
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
                        <Sparkles size={14} /> Get in Touch
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                        We'd Love to<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            Hear From You.
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto">
                        Have a question, feedback, or need enterprise support? Our team typically responds within 2 hours.
                    </p>
                </div>
            </header>

            {/* Quick Stats */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatPill icon={<Clock size={14} />} label="Response Time" value="< 2 hrs" />
                    <StatPill icon={<Globe size={14} />} label="Location" value="Bihar, India" />
                    <StatPill icon={<CheckCircle2 size={14} />} label="Support" value="24/7" />
                    <StatPill icon={<Mail size={14} />} label="Email" value="Direct" />
                </div>
            </section>

            {/* Contact Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">

                    {/* Contact Form */}
                    <div className="lg:col-span-3 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10">
                        <h2 className="text-xl sm:text-2xl font-black text-white mb-6">Send a Message</h2>

                        {sent && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 mb-6 font-bold text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} /> Message sent successfully! We'll get back to you within 2 hours.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Name</label>
                                    <input required
                                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600 transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
                                    <input required type="email"
                                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600 transition-all"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Subject</label>
                                <select
                                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="">Select a topic...</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="enterprise">Enterprise Sales</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="bug">Bug Report</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Message</label>
                                <textarea required rows={5}
                                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder-slate-600 transition-all"
                                    placeholder="Tell us how we can help..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
                            >
                                <Send size={16} /> Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                        <ContactInfoCard
                            icon={<Phone className="text-emerald-400" size={20} />}
                            title="Call Us"
                            info="+91 7542077327"
                            subinfo="Mon-Sat, 9am to 7pm IST"
                            gradient="from-emerald-600 to-teal-500"
                        />
                        <ContactInfoCard
                            icon={<Mail className="text-blue-400" size={20} />}
                            title="Email Us"
                            info="support@sentinel.dev"
                            subinfo="We reply within 2 hours"
                            gradient="from-blue-600 to-cyan-500"
                        />
                        <ContactInfoCard
                            icon={<MapPin className="text-rose-400" size={20} />}
                            title="Our Location"
                            info="Bihar, India"
                            subinfo="Building from the heart of India"
                            gradient="from-rose-600 to-pink-500"
                        />

                        {/* Social Links */}
                        <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 sm:p-6">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Connect With Us</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <SocialLink
                                    icon={<Linkedin size={20} />}
                                    label="LinkedIn"
                                    href="https://www.linkedin.com/in/kumarchhotu/"
                                    color="text-blue-400 hover:bg-blue-500/10"
                                />
                                <SocialLink
                                    icon={<Github size={20} />}
                                    label="GitHub"
                                    href="https://github.com/jhachhotu"
                                    color="text-slate-300 hover:bg-slate-700"
                                />
                                <SocialLink
                                    icon={<Twitter size={20} />}
                                    label="Twitter"
                                    href="https://x.com/kumarck55555"
                                    color="text-sky-400 hover:bg-sky-500/10"
                                />
                            </div>
                        </div>

                        {/* Quick CTA */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                            <div className="relative z-10">
                                <h4 className="font-black mb-1.5 text-sm sm:text-base">Need Enterprise Support?</h4>
                                <p className="text-emerald-100 text-xs sm:text-sm mb-4">Schedule a call with our team for custom solutions and dedicated support.</p>
                                <Link to="/pricing" className="inline-flex items-center gap-2 text-sm font-bold bg-white text-emerald-600 px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-transform shadow-lg">
                                    View Plans <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
                        {/* Animated dots */}
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping opacity-30 animation-delay-1000"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-rose-500 rounded-full animate-ping opacity-30 animation-delay-2000"></div>

                        <div className="inline-flex p-4 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl text-white mb-6">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2">Bihar, India</h3>
                        <p className="text-slate-400 text-sm sm:text-base mb-6">Building world-class monitoring tools from the heart of India 🇮🇳</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
                                <p className="text-lg font-black text-white">IST</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Timezone</p>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
                                <p className="text-lg font-black text-white">🇮🇳</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">India</p>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
                                <p className="text-lg font-black text-white">Remote</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Work Mode</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* ───── Sub Components ───── */
const StatPill = ({ icon, label, value }) => (
    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">{icon}</div>
        <div>
            <p className="text-[10px] text-slate-600 font-bold uppercase">{label}</p>
            <p className="text-xs sm:text-sm text-white font-bold">{value}</p>
        </div>
    </div>
);

const ContactInfoCard = ({ icon, title, info, subinfo, gradient }) => (
    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 sm:p-6 flex items-start gap-4 hover:border-slate-700 transition-all group">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <h4 className="font-black text-white mb-0.5 text-sm sm:text-base">{title}</h4>
            <p className="text-slate-300 text-sm font-medium">{info}</p>
            {subinfo && <p className="text-slate-500 text-xs mt-1">{subinfo}</p>}
        </div>
    </div>
);

const SocialLink = ({ icon, label, href, color }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-col items-center gap-1.5 p-3 bg-slate-800/50 border border-slate-700 rounded-xl ${color} transition-all hover:scale-105 active:scale-95`}
        title={label}
    >
        {icon}
        <span className="text-[10px] font-bold text-slate-500">{label}</span>
    </a>
);

export default Contact;
