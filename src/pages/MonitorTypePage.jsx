import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Globe, Lock, Search, Plug, Radio, Code, Waypoints,
    CheckCircle2, ArrowRight, Shield, Activity, Bell, BarChart3,
    Clock, Zap, Server, Sparkles, ChevronRight, Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Footer } from './About';
import { createMonitor } from '../services/monitorService';

/* ───── Data ───── */
const MONITOR_DATA = {
    http: {
        type: 'HTTP', title: 'Website & Endpoint Monitoring',
        subtitle: 'Monitor any HTTP/HTTPS endpoint with 10-second pings',
        icon: <Globe size={28} />, color: 'emerald',
        description: 'Track the uptime and performance of any website or API endpoint. Sentinel sends real HTTP requests every 10 seconds, following redirects and bypassing bot filters to give you accurate, real-time status.',
        features: [
            { text: 'HTTP/HTTPS monitoring with 10-second intervals', icon: <Clock size={16} /> },
            { text: 'Smart bot-filter bypass (Vercel, Netlify, Cloudflare)', icon: <Shield size={16} /> },
            { text: 'Status code validation (2xx/3xx = UP)', icon: <CheckCircle2 size={16} /> },
            { text: 'Response time tracking with ms precision', icon: <Zap size={16} /> },
            { text: 'Automatic redirect following', icon: <ArrowRight size={16} /> },
            { text: 'State-change alerts via email', icon: <Bell size={16} /> },
        ],
        useCases: ['Production websites', 'REST APIs', 'Landing pages', 'Web apps', 'Health checks'],
        fields: { url: true },
        stats: [{ label: 'Check Interval', value: '10s' }, { label: 'Uptime SLA', value: '99.9%' }, { label: 'Response', value: '<50ms' }],
    },
    ssl: {
        type: 'SSL', title: 'SSL Certificate Monitoring',
        subtitle: 'Never let an SSL certificate expire unnoticed',
        icon: <Lock size={28} />, color: 'purple',
        description: 'Sentinel reads your SSL/TLS certificate directly and tracks its expiry date. Get alerted 30 days before expiry so you can renew on time — no more browser warnings.',
        features: [
            { text: 'Reads X.509 certificate expiry automatically', icon: <Lock size={16} /> },
            { text: 'Alerts 30 days before certificate expiry', icon: <Bell size={16} /> },
            { text: 'Tracks days remaining on dashboard', icon: <Clock size={16} /> },
            { text: 'Works with any HTTPS endpoint', icon: <Globe size={16} /> },
            { text: 'Certificate chain validation', icon: <Shield size={16} /> },
            { text: 'Wildcard & SAN certificate support', icon: <Star size={16} /> },
        ],
        useCases: ['Production HTTPS', 'API gateways', 'E-commerce', 'Banking apps', 'SaaS'],
        fields: { url: true },
        stats: [{ label: 'Alert Threshold', value: '30 days' }, { label: 'Chain Depth', value: 'Full' }, { label: 'Cert Types', value: 'All' }],
    },
    keyword: {
        type: 'KEYWORD', title: 'Keyword Monitoring',
        subtitle: 'Verify your page content is displaying correctly',
        icon: <Search size={28} />, color: 'blue',
        description: 'Beyond checking if a page loads, Keyword Monitoring reads actual page content and searches for specific text. If the keyword disappears you get alerted immediately.',
        features: [
            { text: 'Full page content scanning every check', icon: <Search size={16} /> },
            { text: 'Case-insensitive keyword search', icon: <Code size={16} /> },
            { text: 'Alert when keyword NOT found', icon: <Bell size={16} /> },
            { text: 'Detects broken deployments', icon: <Shield size={16} /> },
            { text: 'Catches defacement attacks', icon: <Lock size={16} /> },
            { text: 'Verifies availability + content', icon: <CheckCircle2 size={16} /> },
        ],
        useCases: ['E-commerce', 'Login pages', 'API health', 'Marketing pages', 'Content apps'],
        fields: { url: true, keyword: true },
        stats: [{ label: 'Scan Depth', value: 'Full Page' }, { label: 'Search', value: 'Case-free' }, { label: 'Speed', value: '<100ms' }],
    },
    port: {
        type: 'PORT', title: 'Port Monitoring',
        subtitle: 'Check if specific TCP ports are open and responding',
        icon: <Plug size={28} />, color: 'orange',
        description: 'Port Monitoring connects to a specific TCP port on your server to verify it\'s accepting connections. Essential for databases, mail servers, and custom services.',
        features: [
            { text: 'TCP socket connection check', icon: <Plug size={16} /> },
            { text: 'Custom port number (1-65535)', icon: <Server size={16} /> },
            { text: 'Works with hostname or IP', icon: <Globe size={16} /> },
            { text: 'Detects firewall blocks & crashes', icon: <Shield size={16} /> },
            { text: '10-second timeout accuracy', icon: <Clock size={16} /> },
            { text: 'Monitor DB, mail, custom services', icon: <BarChart3 size={16} /> },
        ],
        useCases: ['MySQL 3306', 'PostgreSQL 5432', 'MongoDB 27017', 'Redis 6379', 'SMTP 587', 'SSH 22'],
        fields: { url: true, port: true },
        stats: [{ label: 'Timeout', value: '10s' }, { label: 'Port Range', value: '1-65535' }, { label: 'Protocol', value: 'TCP' }],
    },
    ping: {
        type: 'PING', title: 'Ping Monitoring',
        subtitle: 'Check if your host is reachable on the network',
        icon: <Radio size={28} />, color: 'teal',
        description: 'Ping Monitoring uses ICMP-like reachability checks to verify server responsiveness. The most fundamental check — if a host doesn\'t respond to ping, it\'s likely completely down.',
        features: [
            { text: 'ICMP reachability via InetAddress', icon: <Radio size={16} /> },
            { text: 'Hostname and IP address support', icon: <Globe size={16} /> },
            { text: 'Detects complete server outages', icon: <Shield size={16} /> },
            { text: 'Network-level connectivity check', icon: <Activity size={16} /> },
            { text: 'Fast response time measurement', icon: <Zap size={16} /> },
            { text: 'Independent of HTTP stack', icon: <Server size={16} /> },
        ],
        useCases: ['Bare metal servers', 'VPS instances', 'Network gear', 'IoT devices', 'Internal infra'],
        fields: { url: true },
        stats: [{ label: 'Layer', value: 'Network' }, { label: 'Protocol', value: 'ICMP' }, { label: 'Accuracy', value: '99.9%' }],
    },
    api: {
        type: 'API', title: 'API Monitoring',
        subtitle: 'Test REST APIs with custom methods and bodies',
        icon: <Code size={28} />, color: 'indigo',
        description: 'API Monitoring goes beyond simple GET requests. Configure custom HTTP methods (POST, PUT, DELETE) with request bodies to test endpoints exactly as your app uses them.',
        features: [
            { text: 'GET, POST, PUT, DELETE methods', icon: <Code size={16} /> },
            { text: 'Custom JSON request body', icon: <Server size={16} /> },
            { text: 'Response status validation', icon: <CheckCircle2 size={16} /> },
            { text: 'application/json headers', icon: <Globe size={16} /> },
            { text: 'Tests as your app uses them', icon: <Activity size={16} /> },
            { text: 'Catches API-specific failures', icon: <Shield size={16} /> },
        ],
        useCases: ['REST APIs', 'GraphQL', 'Webhooks', 'Auth endpoints', 'Payment gateways', '3rd-party APIs'],
        fields: { url: true, httpMethod: true, httpBody: true },
        stats: [{ label: 'Methods', value: '4 HTTP' }, { label: 'Body', value: 'JSON' }, { label: 'Headers', value: 'Auto' }],
    },
    dns: {
        type: 'DNS', title: 'DNS Monitoring',
        subtitle: 'Verify DNS resolution and detect hijacking',
        icon: <Waypoints size={28} />, color: 'amber',
        description: 'DNS Monitoring resolves your domain and optionally compares to an expected IP. Detect hijacking, misconfigured records, or propagation issues before users do.',
        features: [
            { text: 'DNS resolution verification', icon: <Waypoints size={16} /> },
            { text: 'Expected IP address matching', icon: <Globe size={16} /> },
            { text: 'Detects DNS hijacking/poisoning', icon: <Shield size={16} /> },
            { text: 'Catches misconfigured records', icon: <Bell size={16} /> },
            { text: 'Monitors propagation changes', icon: <Activity size={16} /> },
            { text: 'Resolved IP audit trail', icon: <BarChart3 size={16} /> },
        ],
        useCases: ['Production domains', 'CDN configs', 'Load balancer DNS', 'Domain migration', 'Multi-region'],
        fields: { url: true, dnsExpectedIp: true },
        stats: [{ label: 'Lookup', value: 'A Record' }, { label: 'Match', value: 'IP Verify' }, { label: 'Speed', value: '<10ms' }],
    },
    'response-time': {
        type: 'HTTP', title: 'Response Time Monitoring',
        subtitle: 'Track and optimize your endpoint performance',
        icon: <Activity size={28} />, color: 'rose',
        description: 'Every check records precise response time in milliseconds. View trends to spot performance degradation before it impacts users.',
        features: [
            { text: 'Millisecond-precision tracking', icon: <Clock size={16} /> },
            { text: 'Historical response time data', icon: <BarChart3 size={16} /> },
            { text: 'Average response analytics', icon: <Activity size={16} /> },
            { text: 'Performance trend visualization', icon: <Zap size={16} /> },
            { text: 'Spot degradation early', icon: <Bell size={16} /> },
            { text: 'Compare across monitors', icon: <Globe size={16} /> },
        ],
        useCases: ['Performance APIs', 'E-commerce checkout', 'Real-time apps', 'SLA monitoring', 'CDN perf'],
        fields: { url: true },
        stats: [{ label: 'Precision', value: '1ms' }, { label: 'History', value: 'Full' }, { label: 'Trends', value: 'Live' }],
    },
    domain: {
        type: 'DNS', title: 'Domain Monitoring',
        subtitle: 'Monitor domain DNS resolution and availability',
        icon: <Globe size={28} />, color: 'cyan',
        description: 'Domain Monitoring verifies your domain resolves correctly. Track resolved IPs and detect unexpected changes to your domain configuration.',
        features: [
            { text: 'Domain DNS resolution tracking', icon: <Globe size={16} /> },
            { text: 'IP address change detection', icon: <Activity size={16} /> },
            { text: 'Works with any registered domain', icon: <CheckCircle2 size={16} /> },
            { text: 'Detects domain expiry/parking', icon: <Shield size={16} /> },
            { text: 'Monitors nameserver changes', icon: <Server size={16} /> },
            { text: 'Audit trail of resolved IPs', icon: <BarChart3 size={16} /> },
        ],
        useCases: ['Business domains', 'Subdomain monitoring', 'Partner domains', 'Portfolio mgmt'],
        fields: { url: true, dnsExpectedIp: true },
        stats: [{ label: 'Records', value: 'A/AAAA' }, { label: 'Detection', value: 'Instant' }, { label: 'Trail', value: 'Full' }],
    },
    incidents: {
        type: null, title: 'Incident Management',
        subtitle: 'Track, analyze, and resolve incidents efficiently',
        icon: <Shield size={28} />, color: 'red',
        description: 'Sentinel auto-creates incident records on status changes. View detailed timelines with root cause analysis, response times, and resolution tracking.',
        features: [
            { text: 'Automatic incident creation', icon: <Zap size={16} /> },
            { text: 'Detailed timeline with timestamps', icon: <Clock size={16} /> },
            { text: 'Root cause logging for failures', icon: <Shield size={16} /> },
            { text: 'Response time per check', icon: <Activity size={16} /> },
            { text: '24-hour uptime calculation', icon: <BarChart3 size={16} /> },
            { text: 'Historical data for post-mortems', icon: <Server size={16} /> },
        ],
        useCases: ['DevOps teams', 'SRE workflows', 'Post-mortems', 'SLA compliance'],
        fields: {},
        cta: { label: 'View Incidents', link: '/incidents' },
        stats: [{ label: 'Detection', value: 'Instant' }, { label: 'Timeline', value: 'Full' }, { label: 'Alerts', value: 'Email' }],
    },
    alerting: {
        type: null, title: 'IT Alerting Software',
        subtitle: 'Professional email alerts with root cause analysis',
        icon: <Bell size={28} />, color: 'yellow',
        description: 'Sentinel sends professionally formatted HTML email alerts only on status changes — UP→DOWN or DOWN→UP. No alert fatigue, each alert includes root cause and downtime duration.',
        features: [
            { text: 'State-change detection only', icon: <Bell size={16} /> },
            { text: 'Professional HTML emails', icon: <Sparkles size={16} /> },
            { text: 'Root cause in every alert', icon: <Shield size={16} /> },
            { text: 'Downtime duration tracking', icon: <Clock size={16} /> },
            { text: 'Recovery notifications', icon: <CheckCircle2 size={16} /> },
            { text: 'Smart deduplication', icon: <Zap size={16} /> },
        ],
        useCases: ['On-call engineers', 'DevOps', 'IT operations', 'Service desk'],
        fields: {},
        cta: { label: 'Get Started', link: '/incidents' },
        stats: [{ label: 'Templates', value: 'HTML' }, { label: 'Noise', value: 'Zero' }, { label: 'Speed', value: '<1s' }],
    },
    'status-pages': {
        type: null, title: 'Public Status Pages',
        subtitle: 'Share real-time system health with your users',
        icon: <Activity size={28} />, color: 'green',
        description: 'Beautiful public status page with no login required. Show users and stakeholders the real-time health of all monitored services with automatic refresh every 15 seconds.',
        features: [
            { text: 'Public — no authentication', icon: <Globe size={16} /> },
            { text: 'Auto-refresh every 15 seconds', icon: <Clock size={16} /> },
            { text: 'Overall system health banner', icon: <Activity size={16} /> },
            { text: 'Per-service status + response time', icon: <BarChart3 size={16} /> },
            { text: 'Monitor type badges', icon: <Sparkles size={16} /> },
            { text: 'SSL expiry warnings', icon: <Lock size={16} /> },
        ],
        useCases: ['SaaS status', 'Enterprise health', 'Customer dashboards', 'Internal dashboards'],
        fields: {},
        cta: { label: 'View Status Page', link: '/status' },
        stats: [{ label: 'Refresh', value: '15s' }, { label: 'Auth', value: 'None' }, { label: 'Design', value: 'Premium' }],
    },
};

const GRADIENT_MAP = {
    emerald: 'from-emerald-600 to-teal-500',
    purple: 'from-purple-600 to-violet-500',
    blue: 'from-blue-600 to-cyan-500',
    orange: 'from-orange-600 to-amber-500',
    teal: 'from-teal-600 to-emerald-500',
    indigo: 'from-indigo-600 to-blue-500',
    amber: 'from-amber-600 to-yellow-500',
    rose: 'from-rose-600 to-pink-500',
    cyan: 'from-cyan-600 to-teal-500',
    red: 'from-red-600 to-rose-500',
    yellow: 'from-yellow-600 to-amber-500',
    green: 'from-green-600 to-emerald-500',
};

const COLOR_MAP = {
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-200', ring: 'focus:ring-emerald-500', glow: 'shadow-emerald-500/25' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-200', ring: 'focus:ring-purple-500', glow: 'shadow-purple-500/25' },
    blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200', ring: 'focus:ring-blue-500', glow: 'shadow-blue-500/25' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200', ring: 'focus:ring-orange-500', glow: 'shadow-orange-500/25' },
    teal: { bg: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-500', border: 'border-teal-200', ring: 'focus:ring-teal-500', glow: 'shadow-teal-500/25' },
    indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-200', ring: 'focus:ring-indigo-500', glow: 'shadow-indigo-500/25' },
    amber: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200', ring: 'focus:ring-amber-500', glow: 'shadow-amber-500/25' },
    rose: { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-200', ring: 'focus:ring-rose-500', glow: 'shadow-rose-500/25' },
    cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-500', border: 'border-cyan-200', ring: 'focus:ring-cyan-500', glow: 'shadow-cyan-500/25' },
    red: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-500', border: 'border-red-200', ring: 'focus:ring-red-500', glow: 'shadow-red-500/25' },
    yellow: { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', ring: 'focus:ring-yellow-500', glow: 'shadow-yellow-500/25' },
    green: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-500', border: 'border-green-200', ring: 'focus:ring-green-500', glow: 'shadow-green-500/25' },
};

/* ───── Related features for "Explore More" ───── */
const ALL_TYPES = [
    { slug: 'http', label: 'HTTP', icon: <Globe size={16} /> },
    { slug: 'ssl', label: 'SSL', icon: <Lock size={16} /> },
    { slug: 'keyword', label: 'Keyword', icon: <Search size={16} /> },
    { slug: 'port', label: 'Port', icon: <Plug size={16} /> },
    { slug: 'ping', label: 'Ping', icon: <Radio size={16} /> },
    { slug: 'api', label: 'API', icon: <Code size={16} /> },
    { slug: 'dns', label: 'DNS', icon: <Waypoints size={16} /> },
];

/* ───── Component ───── */
const MonitorTypePage = () => {
    const { type } = useParams();
    const { isAuthenticated } = useAuth();
    const data = MONITOR_DATA[type];

    const [formData, setFormData] = useState({ name: '', url: '', keyword: '', port: '', httpMethod: 'GET', httpBody: '', dnsExpectedIp: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar dark />
                <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🔍</div>
                    <h1 className="text-4xl font-black mb-4">Feature Not Found</h1>
                    <p className="text-slate-400 mb-8">This monitoring type doesn't exist.</p>
                    <Link to="/features" className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors">View All Features</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const colors = COLOR_MAP[data.color] || COLOR_MAP.emerald;
    const gradient = GRADIENT_MAP[data.color] || GRADIENT_MAP.emerald;
    const hasForm = data.type && data.fields && Object.keys(data.fields).length > 0;
    const otherTypes = ALL_TYPES.filter(t => t.slug !== type);

    const handleLogin = () => {
        if (isAuthenticated) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/login';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { handleLogin(); return; }
        setSubmitting(true);
        try {
            const payload = { ...formData, monitorType: data.type };
            if (payload.port) payload.port = parseInt(payload.port);
            else delete payload.port;
            if (!payload.keyword) delete payload.keyword;
            if (!payload.httpBody) delete payload.httpBody;
            if (!payload.dnsExpectedIp) delete payload.dnsExpectedIp;
            await createMonitor(payload);
            setSuccess(true);
            setFormData({ name: '', url: '', keyword: '', port: '', httpMethod: 'GET', httpBody: '', dnsExpectedIp: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            alert('Failed to add monitor. Make sure you\'re logged in and the backend is running.');
        } finally { setSubmitting(false); }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar dark />

            {/* ───── DARK HERO ───── */}
            <header className="relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b ${gradient} opacity-[0.08] rounded-full blur-3xl`}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
                        {/* Left — Info */}
                        <div className="flex-1 min-w-0">
                            <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-5 sm:mb-6 bg-gradient-to-r ${gradient} text-white`}>
                                <Sparkles size={14} /> {data.type || 'Feature'}
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-5 tracking-tight leading-[1.1]">
                                {data.title}
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                                {data.description}
                            </p>

                            {/* Stats pills */}
                            {data.stats && (
                                <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                                    {data.stats.map((s, i) => (
                                        <div key={i} className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3">
                                            <p className={`text-lg sm:text-xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{s.value}</p>
                                            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Use cases */}
                            {data.useCases && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {data.useCases.map((uc, i) => (
                                        <span key={i} className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800/60 backdrop-blur border border-slate-700/50 text-slate-400 rounded-lg text-[10px] sm:text-xs font-bold">
                                            {uc}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* CTA for non-form pages */}
                            {data.cta && (
                                <Link to={data.cta.link}
                                    className={`inline-flex items-center gap-2 mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl ${colors.glow} text-sm sm:text-base`}
                                >
                                    {data.cta.label} <ArrowRight size={18} />
                                </Link>
                            )}
                        </div>

                        {/* Right — Glassmorphism Form */}
                        {hasForm && (
                            <div className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0">
                                <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-7 lg:p-8">
                                    <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                        <div className={`p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
                                            {React.cloneElement(data.icon, { size: 20, className: 'text-white' })}
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-white">Add {data.type} Monitor</h3>
                                            <p className="text-xs text-slate-500">Start monitoring in seconds</p>
                                        </div>
                                    </div>

                                    {success && (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 mb-4 font-bold text-xs sm:text-sm flex items-center gap-2">
                                            <CheckCircle2 size={16} /> Monitor added! Check your dashboard.
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                        <FormInput label="Display Name" placeholder="e.g. My Production API" required
                                            value={formData.name} onChange={v => setFormData({ ...formData, name: v })} ring={colors.ring} />

                                        {data.fields.url && (
                                            <FormInput label={data.type === 'PORT' || data.type === 'PING' ? 'Host / IP Address' : 'Endpoint URL'}
                                                placeholder="https://example.com" required
                                                value={formData.url} onChange={v => setFormData({ ...formData, url: v })} ring={colors.ring} />
                                        )}

                                        {data.fields.keyword && (
                                            <FormInput label="Keyword to Find" placeholder="e.g. Welcome, Login" required
                                                value={formData.keyword} onChange={v => setFormData({ ...formData, keyword: v })} ring={colors.ring} />
                                        )}

                                        {data.fields.port && (
                                            <FormInput label="Port Number" placeholder="e.g. 3306, 5432" type="number" required
                                                value={formData.port} onChange={v => setFormData({ ...formData, port: v })} ring={colors.ring} />
                                        )}

                                        {data.fields.httpMethod && (
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-slate-400 mb-1.5">HTTP Method</label>
                                                <select className={`w-full p-2.5 sm:p-3 bg-slate-800 border border-slate-700 rounded-xl ${colors.ring} focus:ring-2 outline-none text-sm text-white`}
                                                    value={formData.httpMethod} onChange={e => setFormData({ ...formData, httpMethod: e.target.value })}>
                                                    <option value="GET">GET</option>
                                                    <option value="POST">POST</option>
                                                    <option value="PUT">PUT</option>
                                                    <option value="DELETE">DELETE</option>
                                                </select>
                                            </div>
                                        )}

                                        {data.fields.httpBody && (formData.httpMethod === 'POST' || formData.httpMethod === 'PUT') && (
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-slate-400 mb-1.5">Request Body (JSON)</label>
                                                <textarea rows={3} className={`w-full p-2.5 sm:p-3 bg-slate-800 border border-slate-700 rounded-xl ${colors.ring} focus:ring-2 outline-none text-sm text-white resize-none font-mono`}
                                                    placeholder='{"key": "value"}'
                                                    value={formData.httpBody} onChange={e => setFormData({ ...formData, httpBody: e.target.value })} />
                                            </div>
                                        )}

                                        {data.fields.dnsExpectedIp && (
                                            <FormInput label="Expected IP (optional)" placeholder="e.g. 76.76.21.21"
                                                value={formData.dnsExpectedIp} onChange={v => setFormData({ ...formData, dnsExpectedIp: v })} ring={colors.ring} />
                                        )}

                                        <button type="submit" disabled={submitting}
                                            className={`w-full py-3 sm:py-3.5 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl shadow-lg ${colors.glow} hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm sm:text-base`}
                                        >
                                            {submitting ? 'Adding...' : isAuthenticated ? '🚀 Start Monitoring' : '🔐 Login & Start Monitoring'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ───── FEATURES GRID ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28">
                <div className="flex items-center gap-3 mb-8 sm:mb-10">
                    <div className={`h-1 w-8 sm:w-12 rounded-full bg-gradient-to-r ${gradient}`}></div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Key Features</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {data.features.map((feature, i) => (
                        <div key={i}
                            className="group flex items-start gap-3 sm:gap-4 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className={`p-2 rounded-lg ${colors.light} ${colors.text} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">{feature.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── HOW IT WORKS ───── */}
            <section className="border-y border-slate-800 py-16 sm:py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">How It Works</h2>
                        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">Three steps to complete monitoring coverage.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        <StepCard gradient={gradient} number="01" title="Add Your Endpoint"
                            desc="Enter your URL, choose the monitor type, configure settings. We start monitoring immediately." />
                        <StepCard gradient={gradient} number="02" title="Watch Real-Time"
                            desc="Dashboard updates every 10 seconds. Green = safe, red = action needed. Full timeline of events." />
                        <StepCard gradient={gradient} number="03" title="Get Instant Alerts"
                            desc="Professional HTML email alerts with root cause analysis the moment something changes." />
                    </div>
                </div>
            </section>

            {/* ───── EXPLORE MORE ───── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Explore More Monitor Types</h2>
                    <p className="text-slate-500 text-sm sm:text-base">Every type of monitoring you need, in one platform.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                    {otherTypes.map(t => (
                        <Link key={t.slug} to={`/monitor/${t.slug}`}
                            className="group bg-slate-900/50 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center hover:border-slate-600 hover:bg-slate-800/50 transition-all"
                        >
                            <div className="text-slate-500 group-hover:text-emerald-400 transition-colors flex justify-center mb-2 group-hover:scale-110 transition-transform">
                                {t.icon}
                            </div>
                            <p className="font-bold text-white text-xs sm:text-sm">{t.label}</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Monitor</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ───── CTA ───── */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28 text-center">
                <div className={`bg-gradient-to-br ${gradient} rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/5 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-black/5 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4">Ready to Monitor?</h2>
                        <p className="text-white/70 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                            Set up {data.title.toLowerCase()} in under 60 seconds. No credit card required.
                        </p>
                        <button onClick={handleLogin}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-xl text-sm sm:text-base"
                        >
                            Get Started Free
                        </button>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.5s ease-out both; }
      `}</style>
        </div>
    );
};

/* ───── Sub Components ───── */
const FormInput = ({ label, placeholder, required, type = 'text', value, onChange, ring }) => (
    <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-400 mb-1.5">{label}</label>
        <input type={type} required={required} className={`w-full p-2.5 sm:p-3 bg-slate-800 border border-slate-700 rounded-xl ${ring} focus:ring-2 outline-none text-sm text-white placeholder-slate-600`}
            placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
);

const StepCard = ({ gradient, number, title, desc }) => (
    <div className="text-center">
        <div className={`text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-b ${gradient} bg-clip-text text-transparent opacity-20 mb-3 sm:mb-4`}>{number}</div>
        <h4 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3">{title}</h4>
        <p className="text-slate-500 leading-relaxed text-xs sm:text-sm">{desc}</p>
    </div>
);

export default MonitorTypePage;
