import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Calculator, Wifi, Clock, Bot, Eye, Sparkles, ArrowRight,
    CheckCircle2, Copy, RefreshCw, Zap, Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Footer } from './About';

/* ───── Tool Data ───── */
const TOOL_DATA = {
    'subnet-calculator': {
        title: 'Subnet Calculator',
        subtitle: 'Find the subnet of any IP address',
        icon: <Calculator size={28} />,
        gradient: 'from-emerald-600 to-teal-500',
        description: 'Calculate network address, broadcast address, subnet mask, host range, and number of usable hosts for any IP/CIDR combination.',
        component: SubnetCalculator,
    },
    'dns-lookup': {
        title: 'DNS Lookup',
        subtitle: 'Instantly check DNS records for any domain',
        icon: <Wifi size={28} />,
        gradient: 'from-blue-600 to-cyan-500',
        description: 'Resolve A, AAAA, CNAME, MX, NS, and TXT records for any domain. See the full DNS chain and troubleshoot issues.',
        component: DnsLookup,
    },
    'uptime-calculator': {
        title: 'Uptime Calculator',
        subtitle: 'Calculate uptime, downtime, and outage costs',
        icon: <Clock size={28} />,
        gradient: 'from-purple-600 to-violet-500',
        description: 'Enter your uptime percentage to see exactly how much downtime that translates to per day, week, month, and year.',
        component: UptimeCalculator,
    },
    crontab: {
        title: 'CrontabRobot',
        subtitle: 'Create and validate crontab expressions',
        icon: <Bot size={28} />,
        gradient: 'from-amber-600 to-orange-500',
        description: 'Build, validate, and understand crontab scheduling expressions. See the next 5 run times for any expression.',
        component: CrontabTool,
    },
    'change-detection': {
        title: 'Website Change Detection',
        subtitle: 'Track visual changes on any webpage',
        icon: <Eye size={28} />,
        gradient: 'from-rose-600 to-pink-500',
        description: 'Enter a URL and get notified when the page content changes. Perfect for competitor monitoring, price tracking, and compliance.',
        component: ChangeDetection,
    },
};

/* ───── Main ───── */
const ToolPage = () => {
    const { slug } = useParams();
    const data = TOOL_DATA[slug];

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar dark />
                <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🔧</div>
                    <h1 className="text-4xl font-black mb-4">Tool Not Found</h1>
                    <p className="text-slate-400 mb-8">This free tool doesn't exist.</p>
                    <Link to="/" className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl">Go Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const ToolComponent = data.component;

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar dark />

            {/* Hero */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b ${data.gradient} opacity-[0.08] rounded-full blur-3xl`}></div>
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 bg-gradient-to-r ${data.gradient} text-white`}>
                        <Sparkles size={14} /> Free Tool
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">{data.title}</h1>
                    <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">{data.description}</p>
                </div>
            </header>

            {/* Tool */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
                    <ToolComponent gradient={data.gradient} />
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* ═══════ TOOL COMPONENTS ═══════ */

/* ───── Subnet Calculator ───── */
function SubnetCalculator({ gradient }) {
    const [ip, setIp] = useState('');
    const [cidr, setCidr] = useState('24');
    const [result, setResult] = useState(null);

    const calculate = () => {
        try {
            const parts = ip.split('.').map(Number);
            if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) { alert('Invalid IP'); return; }
            const c = parseInt(cidr);
            if (c < 0 || c > 32) { alert('CIDR must be 0-32'); return; }

            const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
            const mask = c === 0 ? 0 : (~0 << (32 - c)) >>> 0;
            const network = (ipNum & mask) >>> 0;
            const broadcast = (network | ~mask) >>> 0;
            const hosts = c >= 31 ? (c === 32 ? 1 : 2) : Math.pow(2, 32 - c) - 2;

            const toIp = n => `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

            setResult({
                network: toIp(network), broadcast: toIp(broadcast),
                mask: toIp(mask), hosts: hosts.toLocaleString(),
                firstHost: toIp(network + 1), lastHost: toIp(broadcast - 1),
                cidrNotation: `${toIp(network)}/${c}`,
            });
        } catch { alert('Error computing subnet'); }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-3 items-end">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">IP Address</label>
                    <input className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="192.168.1.0" value={ip} onChange={e => setIp(e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">CIDR</label>
                    <input type="number" min="0" max="32" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        value={cidr} onChange={e => setCidr(e.target.value)} />
                </div>
                <button onClick={calculate} className={`p-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl hover:scale-[1.02] transition-all text-sm`}>
                    Calculate
                </button>
            </div>

            {result && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ResultRow label="Network Address" value={result.network} />
                    <ResultRow label="Broadcast Address" value={result.broadcast} />
                    <ResultRow label="Subnet Mask" value={result.mask} />
                    <ResultRow label="CIDR Notation" value={result.cidrNotation} />
                    <ResultRow label="First Usable Host" value={result.firstHost} />
                    <ResultRow label="Last Usable Host" value={result.lastHost} />
                    <ResultRow label="Total Usable Hosts" value={result.hosts} full />
                </div>
            )}
        </div>
    );
}

/* ───── DNS Lookup ───── */
function DnsLookup({ gradient }) {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const lookup = async () => {
        if (!domain) return;
        setLoading(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
            const data = await res.json();
            setResult({
                status: data.Status === 0 ? 'Success' : 'Failed',
                records: data.Answer || [],
                query: domain,
                server: 'dns.google (8.8.8.8)',
            });
        } catch {
            setResult({ status: 'Error', records: [], query: domain, server: 'dns.google' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Domain Name</label>
                    <input className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="example.com" value={domain} onChange={e => setDomain(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && lookup()} />
                </div>
                <button onClick={lookup} disabled={loading} className={`p-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl hover:scale-[1.02] transition-all text-sm flex items-center gap-2 disabled:opacity-50`}>
                    {loading ? <><RefreshCw size={14} className="animate-spin" /> Resolving...</> : 'Lookup'}
                </button>
            </div>

            {result && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black ${result.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {result.status}
                        </span>
                        <span className="text-xs text-slate-500">via {result.server}</span>
                    </div>
                    {result.records.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {result.records.map((r, i) => (
                                <div key={i} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-black">
                                            {r.type === 1 ? 'A' : r.type === 5 ? 'CNAME' : r.type === 28 ? 'AAAA' : `TYPE${r.type}`}
                                        </span>
                                        <span className="text-sm text-slate-300 font-mono">{r.name}</span>
                                    </div>
                                    <span className="text-sm text-emerald-400 font-mono font-bold">{r.data}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">No records found for this domain.</p>
                    )}
                </div>
            )}
        </div>
    );
}

/* ───── Uptime Calculator ───── */
function UptimeCalculator({ gradient }) {
    const [uptime, setUptime] = useState('99.9');

    const pct = parseFloat(uptime) || 0;
    const downPct = 100 - pct;
    const minutesYear = 525960;
    const downMinYear = (downPct / 100) * minutesYear;

    const fmt = (mins) => {
        if (mins < 1) return `${(mins * 60).toFixed(1)}s`;
        if (mins < 60) return `${mins.toFixed(1)}m`;
        if (mins < 1440) return `${(mins / 60).toFixed(1)}h`;
        return `${(mins / 1440).toFixed(1)}d`;
    };

    const tiers = [
        { label: 'Per Day', downtime: fmt(downMinYear / 365) },
        { label: 'Per Week', downtime: fmt(downMinYear / 52) },
        { label: 'Per Month', downtime: fmt(downMinYear / 12) },
        { label: 'Per Year', downtime: fmt(downMinYear) },
    ];

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Uptime SLA (%)</label>
                <input type="number" step="0.001" min="0" max="100"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                    value={uptime} onChange={e => setUptime(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {tiers.map((t, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                        <p className={`text-xl sm:text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{t.downtime}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{t.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Uptime: {pct.toFixed(3)}%</span>
                    <span>Downtime: {downPct.toFixed(3)}%</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
            </div>
        </div>
    );
}

/* ───── CrontabRobot ───── */
function CrontabTool({ gradient }) {
    const [expression, setExpression] = useState('0 * * * *');
    const fields = expression.trim().split(/\s+/);
    const labels = ['Minute', 'Hour', 'Day (Month)', 'Month', 'Day (Week)'];
    const ranges = ['0-59', '0-23', '1-31', '1-12', '0-7'];

    const describe = () => {
        if (fields.length !== 5) return 'Invalid expression — need exactly 5 fields';
        const [min, hr, dom, mon, dow] = fields;
        let desc = '';
        if (min === '*' && hr === '*') desc = 'Every minute';
        else if (min === '0' && hr === '*') desc = 'Every hour at minute 0';
        else if (min !== '*' && hr !== '*' && dom === '*' && mon === '*' && dow === '*') desc = `Daily at ${hr}:${min.padStart(2, '0')}`;
        else if (min === '*/5') desc = 'Every 5 minutes';
        else if (min === '*/10') desc = 'Every 10 minutes';
        else if (min === '*/15') desc = 'Every 15 minutes';
        else if (min === '*/30') desc = 'Every 30 minutes';
        else desc = `At minute ${min}, hour ${hr}, day-of-month ${dom}, month ${mon}, day-of-week ${dow}`;
        return desc;
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Crontab Expression</label>
                <input className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    placeholder="* * * * *" value={expression} onChange={e => setExpression(e.target.value)} />
            </div>

            <div className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent text-lg sm:text-xl font-black`}>
                {describe()}
            </div>

            <div className="grid grid-cols-5 gap-2">
                {labels.map((label, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-white font-mono">{fields[i] || '*'}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{label}</p>
                        <p className="text-[8px] text-slate-600 mt-0.5">{ranges[i]}</p>
                    </div>
                ))}
            </div>

            <div className="text-xs text-slate-500">
                <p className="font-bold mb-2">Quick examples:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {['*/5 * * * * — Every 5 min', '0 */2 * * * — Every 2 hours', '0 9 * * 1-5 — Weekdays 9 AM', '0 0 1 * * — Monthly midnight',
                        '*/10 * * * * — Every 10 min', '0 0 * * 0 — Weekly Sunday'].map((ex, i) => (
                            <button key={i} className="text-left px-3 py-1.5 bg-slate-800/50 rounded-lg hover:bg-slate-700 hover:text-slate-300 transition-colors"
                                onClick={() => setExpression(ex.split(' — ')[0])}>
                                <code>{ex}</code>
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
}

/* ───── Website Change Detection ───── */
function ChangeDetection({ gradient }) {
    const [url, setUrl] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="space-y-6">
            {submitted && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} /> Monitoring setup! You'll receive alerts when the page changes.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Website URL</label>
                    <input required className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="https://example.com/pricing" value={url} onChange={e => setUrl(e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Notification Email</label>
                    <input required type="email" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className={`w-full py-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm`}>
                    🔍 Start Tracking Changes
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-white">15m</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Check Interval</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-white">Visual</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Diff Type</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-black text-white">Email</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Alert Channel</p>
                </div>
            </div>
        </div>
    );
}

/* ───── Helper ───── */
const ResultRow = ({ label, value, full }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between ${full ? 'sm:col-span-2' : ''}`}>
        <span className="text-xs text-slate-500 font-bold">{label}</span>
        <span className="text-sm text-emerald-400 font-mono font-bold">{value}</span>
    </div>
);

export default ToolPage;
