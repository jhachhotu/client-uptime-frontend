import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Globe, Lock, Search, Plug, Radio, Code, Waypoints,
    ChevronDown, Activity, ShieldAlert, Bell, BarChart3,
    Menu, X, ArrowRight, BookOpen, Users, Wrench,
    HelpCircle, MapPin, FileCode, Library,
    Map, PenLine, MessageCircle, Gift, Heart, Lightbulb,
    Calculator, Wifi, Clock, Bot, Eye
} from 'lucide-react';

const FEATURES_MENU = [
    {
        title: 'Uptime Monitoring',
        icon: <Activity size={18} className="text-emerald-400" />,
        items: [
            { label: 'Website & endpoint monitoring', icon: <Globe size={14} />, link: '/monitor/http' },
            { label: 'Keyword monitoring', icon: <Search size={14} />, link: '/monitor/keyword' },
            { label: 'Ping monitoring', icon: <Radio size={14} />, link: '/monitor/ping' },
            { label: 'Port monitoring', icon: <Plug size={14} />, link: '/monitor/port' },
            { label: 'API monitoring', icon: <Code size={14} />, link: '/monitor/api' },
        ]
    },
    {
        title: 'Monitoring Features',
        icon: <BarChart3 size={18} className="text-emerald-400" />,
        items: [
            { label: 'SSL monitoring', icon: <Lock size={14} />, link: '/monitor/ssl' },
            { label: 'Response time monitoring', icon: <Activity size={14} />, link: '/monitor/response-time' },
            { label: 'DNS monitoring', icon: <Waypoints size={14} />, link: '/monitor/dns' },
            { label: 'Domain monitoring', icon: <Globe size={14} />, link: '/monitor/domain' },
        ]
    },
    {
        title: 'Management',
        icon: <ShieldAlert size={18} className="text-emerald-400" />,
        items: [
            { label: 'Incident management', icon: <ShieldAlert size={14} />, link: '/monitor/incidents' },
            { label: 'IT alerting software', icon: <Bell size={14} />, link: '/monitor/alerting' },
            { label: 'Status pages', icon: <Activity size={14} />, link: '/monitor/status-pages' },
        ]
    }
];

const RESOURCES_MENU = [
    {
        title: 'Help & Learn',
        icon: <BookOpen size={18} className="text-emerald-400" />,
        items: [
            { label: 'Help center', icon: <HelpCircle size={14} />, link: '/resources/help-center' },
            { label: 'Location and IPs', icon: <MapPin size={14} />, link: '/resources/locations' },
            { label: 'API docs', icon: <FileCode size={14} />, link: '/resources/api-docs' },
            { label: 'Knowledge hub', icon: <Library size={14} />, link: '/resources/knowledge-hub' },
        ]
    },
    {
        title: 'Community',
        icon: <Users size={18} className="text-emerald-400" />,
        items: [
            { label: 'Roadmap', icon: <Map size={14} />, link: '/resources/roadmap' },
            { label: 'Blog', icon: <PenLine size={14} />, link: '/resources/blog' },
            { label: 'Discord', icon: <MessageCircle size={14} />, link: '/resources/discord' },
            { label: 'Referral program', icon: <Gift size={14} />, link: '/resources/referral' },
            { label: 'Affiliate program', icon: <Heart size={14} />, link: '/resources/affiliate' },
            { label: 'Non-profit', icon: <Heart size={14} />, link: '/resources/nonprofit' },
            { label: 'Suggest a feature', icon: <Lightbulb size={14} />, link: '/resources/suggest' },
        ]
    },
    {
        title: 'Free Tools',
        icon: <Wrench size={18} className="text-emerald-400" />,
        items: [
            { label: 'Subnet calculator', desc: 'Find the subnet of any IP address', icon: <Calculator size={14} />, link: '/tools/subnet-calculator' },
            { label: 'DNS lookup', desc: 'Instantly check DNS records for any domain', icon: <Wifi size={14} />, link: '/tools/dns-lookup' },
            { label: 'Uptime calculator', desc: 'Calculate uptime, downtime, and outage costs', icon: <Clock size={14} />, link: '/tools/uptime-calculator' },
            { label: 'CrontabRobot', desc: 'Create and validate crontab expressions', icon: <Bot size={14} />, link: '/tools/crontab' },
            { label: 'Website change detection', desc: 'Track visual changes on any webpage', icon: <Eye size={14} />, link: '/tools/change-detection' },
        ]
    }
];

const Navbar = ({ dark = false, onOpenLogin }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const featuresRef = useRef(null);
    const resourcesRef = useRef(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/dashboard');
        } else if (onOpenLogin) {
            onOpenLogin();
        } else {
            navigate('/login'); // Fallback if no modal prop is provided
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (featuresRef.current && !featuresRef.current.contains(e.target)) setFeaturesOpen(false);
            if (resourcesRef.current && !resourcesRef.current.contains(e.target)) setResourcesOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const textClass = dark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';
    const logoClass = dark ? 'text-white' : 'text-slate-900';

    const closeAll = () => { setFeaturesOpen(false); setResourcesOpen(false); setMobileOpen(false); };

    return (
        <>
            <nav className="relative z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-5">
                    {/* Logo */}
                    <Link to="/" className={`flex items-center gap-2 text-xl md:text-2xl font-black ${logoClass}`}>
                        <span className="text-emerald-500">●</span> Sentinel
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Features Dropdown */}
                        <div ref={featuresRef} className="relative">
                            <button
                                onClick={() => { setFeaturesOpen(!featuresOpen); setResourcesOpen(false); }}
                                className={`flex items-center gap-1 px-4 py-2 font-bold transition-colors rounded-lg ${textClass}`}
                            >
                                Features <ChevronDown size={14} className={`transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {featuresOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[700px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 grid grid-cols-3 gap-6 animate-fadeIn">
                                    {FEATURES_MENU.map((section, i) => (
                                        <div key={i}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-1.5 bg-emerald-50 rounded-lg">{section.icon}</div>
                                                <h4 className="font-black text-slate-900 text-sm">{section.title}</h4>
                                            </div>
                                            <div className="space-y-1">
                                                {section.items.map((item, j) => (
                                                    <Link key={j} to={item.link || '/features'} onClick={closeAll}
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all font-medium">
                                                        <span className="text-slate-400">{item.icon}</span>
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/pricing" className={`px-4 py-2 font-bold transition-colors rounded-lg ${textClass}`}>Pricing</Link>

                        {/* Resources Dropdown */}
                        <div ref={resourcesRef} className="relative">
                            <button
                                onClick={() => { setResourcesOpen(!resourcesOpen); setFeaturesOpen(false); }}
                                className={`flex items-center gap-1 px-4 py-2 font-bold transition-colors rounded-lg ${textClass}`}
                            >
                                Resources <ChevronDown size={14} className={`transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {resourcesOpen && (
                                <div className="absolute top-full right-0 mt-3 w-[780px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 grid grid-cols-3 gap-6 animate-fadeIn">
                                    {RESOURCES_MENU.map((section, i) => (
                                        <div key={i}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-1.5 bg-emerald-50 rounded-lg">{section.icon}</div>
                                                <h4 className="font-black text-slate-900 text-sm">{section.title}</h4>
                                            </div>
                                            <div className="space-y-1">
                                                {section.items.map((item, j) => (
                                                    <Link key={j} to={item.link} onClick={closeAll}
                                                        className="flex items-start gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group">
                                                        <span className="text-slate-400 mt-0.5 flex-shrink-0">{item.icon}</span>
                                                        <div>
                                                            <p className="text-sm font-bold">{item.label}</p>
                                                            {item.desc && <p className="text-[11px] text-slate-400 group-hover:text-emerald-500 leading-tight mt-0.5">{item.desc}</p>}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/contact" className={`px-4 py-2 font-bold transition-colors rounded-lg ${textClass}`}>Contact</Link>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link to="/dashboard"
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                            >Go to Dashboard <ArrowRight size={16} /></Link>
                        ) : (
                            <>
                                <button onClick={handleLogin}
                                    className={`px-5 py-2 font-bold transition-colors ${dark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                                >Login</button>
                                <button onClick={handleLogin}
                                    className="px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                                >Get Started Free</button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className={`lg:hidden p-2 rounded-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
                        <div className="px-6 py-4 space-y-1">
                            <Link to="/features" onClick={closeAll} className="block px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Features</Link>
                            <Link to="/pricing" onClick={closeAll} className="block px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Pricing</Link>
                            <Link to="/resources/help-center" onClick={closeAll} className="block px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Resources</Link>
                            <Link to="/contact" onClick={closeAll} className="block px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Contact</Link>
                            <hr className="my-3 border-slate-100" />
                            {isAuthenticated ? (
                                <Link to="/dashboard" onClick={closeAll} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl text-center">Go to Dashboard <ArrowRight size={16} /></Link>
                            ) : (
                                <>
                                    <button onClick={handleLogin} className="block w-full px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl text-left">Login</button>
                                    <button onClick={handleLogin} className="block w-full px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl text-center">Get Started Free</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
        </>
    );
};

export default Navbar;
