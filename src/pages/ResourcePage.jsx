import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    HelpCircle, MapPin, FileCode, Library, Map, PenLine, MessageCircle,
    Gift, Heart, Lightbulb, BookOpen, Users, ArrowRight, Sparkles,
    ChevronRight, ExternalLink, CheckCircle2, Star, Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Footer } from './About';

const RESOURCE_DATA = {
    'help-center': {
        title: 'Help Center',
        subtitle: 'Find answers to every question about Sentinel monitoring',
        icon: <HelpCircle size={28} />,
        gradient: 'from-emerald-600 to-teal-500',
        color: 'emerald',
        description: 'Our comprehensive help center covers everything from getting started to advanced configuration. Browse guides, tutorials, and FAQs to get the most out of Sentinel.',
        sections: [
            { title: 'Getting Started', desc: 'Set up your first monitor in under 60 seconds', icon: <Zap size={20} /> },
            { title: 'Monitor Configuration', desc: 'Learn about all 7 monitoring types and their settings', icon: <BookOpen size={20} /> },
            { title: 'Account Management', desc: 'Manage your profile, team, and billing preferences', icon: <Users size={20} /> },
            { title: 'Alerting & Notifications', desc: 'Configure email alerts, escalation policies, and channels', icon: <Sparkles size={20} /> },
            { title: 'Integrations Guide', desc: 'Connect Sentinel with your favorite DevOps tools', icon: <ExternalLink size={20} /> },
            { title: 'Troubleshooting', desc: 'Resolve common issues and optimize performance', icon: <HelpCircle size={20} /> },
        ],
        faqs: [
            { q: 'How do I create my first monitor?', a: 'Navigate to Dashboard → Add Monitor. Choose your monitor type, enter the URL, and click Start Monitoring.' },
            { q: 'What monitoring intervals are available?', a: 'Sentinel checks your endpoints every 10 seconds for real-time updates.' },
            { q: 'How do email alerts work?', a: 'Sentinel sends HTML email alerts only when status changes — UP→DOWN or DOWN→UP. No alert spam.' },
            { q: 'Can I monitor internal services?', a: 'Yes! Use Port and Ping monitoring for internal infrastructure behind firewalls.' },
        ],
    },
    locations: {
        title: 'Location and IPs',
        subtitle: 'Global monitoring infrastructure for worldwide coverage',
        icon: <MapPin size={28} />,
        gradient: 'from-blue-600 to-cyan-500',
        color: 'blue',
        description: 'Sentinel monitors your services from strategically located data centers around the world. Understanding our monitoring locations helps you configure firewalls and allowlists.',
        sections: [
            { title: 'North America', desc: 'US East (Virginia), US West (Oregon), Canada (Montreal)', icon: <MapPin size={20} /> },
            { title: 'Europe', desc: 'Germany (Frankfurt), UK (London), Netherlands (Amsterdam)', icon: <MapPin size={20} /> },
            { title: 'Asia Pacific', desc: 'Singapore, Japan (Tokyo), Australia (Sydney)', icon: <MapPin size={20} /> },
            { title: 'IP Allowlisting', desc: 'Whitelist our monitoring IPs for accurate uptime checks', icon: <CheckCircle2 size={20} /> },
            { title: 'Latency Optimization', desc: 'Choose locations closest to your target servers', icon: <Zap size={20} /> },
            { title: 'Redundancy', desc: 'Multi-region checks ensure no single point of failure', icon: <Star size={20} /> },
        ],
    },
    'api-docs': {
        title: 'API Documentation',
        subtitle: 'Integrate Sentinel monitoring programmatically',
        icon: <FileCode size={28} />,
        gradient: 'from-indigo-600 to-purple-500',
        color: 'indigo',
        description: 'Our RESTful API lets you manage monitors, retrieve logs, access business analytics, and integrate Sentinel into your CI/CD pipelines and DevOps workflows.',
        sections: [
            { title: 'Authentication', desc: 'Custom JWT-based authentication with Bearer tokens and Google Auth', icon: <BookOpen size={20} /> },
            { title: 'Monitors API', desc: 'POST /add, GET /all, GET /{id}, DELETE /{id}', icon: <FileCode size={20} /> },
            { title: 'Logs API', desc: 'GET /{id}/logs?hours=24 — Retrieve monitoring history', icon: <Library size={20} /> },
            { title: 'Statistics API', desc: 'GET /stats — Business analytics and uptime metrics', icon: <Sparkles size={20} /> },
            { title: 'Public Status API', desc: 'GET /status — No auth, real-time system health', icon: <ExternalLink size={20} /> },
            { title: 'Webhooks', desc: 'Real-time event notifications for status changes', icon: <Zap size={20} /> },
        ],
        codeExample: `// Add a new HTTP monitor
fetch('/api/monitoring/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    name: 'My Production API',
    url: 'https://api.example.com/health',
    monitorType: 'HTTP'
  })
});`,
    },
    'knowledge-hub': {
        title: 'Knowledge Hub',
        subtitle: 'Deep-dive articles on monitoring best practices',
        icon: <Library size={28} />,
        gradient: 'from-amber-600 to-orange-500',
        color: 'amber',
        description: 'Our knowledge hub is a curated library of in-depth articles, best practices, and expert insights on uptime monitoring, incident response, and DevOps observability.',
        sections: [
            { title: 'Uptime Monitoring 101', desc: 'The complete beginner\'s guide to website monitoring', icon: <BookOpen size={20} /> },
            { title: 'SSL Best Practices', desc: 'Managing certificates, renewals, and security headers', icon: <CheckCircle2 size={20} /> },
            { title: 'Incident Response', desc: 'Building effective on-call rotations and escalation policies', icon: <Sparkles size={20} /> },
            { title: 'Performance Optimization', desc: 'Reducing response times and improving TTFB', icon: <Zap size={20} /> },
            { title: 'SLA Management', desc: 'Setting, tracking, and reporting uptime SLAs', icon: <Star size={20} /> },
            { title: 'DevOps Observability', desc: 'Integrating monitoring into your deployment pipeline', icon: <ExternalLink size={20} /> },
        ],
    },
    roadmap: {
        title: 'Product Roadmap',
        subtitle: 'See what we\'re building next for Sentinel',
        icon: <Map size={28} />,
        gradient: 'from-violet-600 to-purple-500',
        color: 'purple',
        description: 'Transparency is core to how we build. Our public roadmap shows what we\'re working on, what\'s planned, and what\'s shipped. Vote on features to help us prioritize.',
        milestones: [
            { phase: 'Shipped ✅', items: ['7-type monitoring (HTTP, SSL, Keyword, Port, Ping, API, DNS)', 'Real-time dashboard with 10s polling', 'Incident management & timeline', 'Business analytics & uptime %', 'Email alerts with root cause'] },
            { phase: 'In Progress 🚧', items: ['Multi-region monitoring', 'Team collaboration & roles', 'Slack & Teams notifications', 'Custom status pages', 'Performance trend charts'] },
            { phase: 'Planned 📋', items: ['Mobile app (iOS & Android)', 'Webhook integrations', 'Maintenance windows', 'Custom alert rules', 'API rate limit monitoring'] },
        ],
    },
    blog: {
        title: 'Blog',
        subtitle: 'Insights, tutorials, and news from the Sentinel team',
        icon: <PenLine size={28} />,
        gradient: 'from-rose-600 to-pink-500',
        color: 'rose',
        description: 'Stay up to date with the latest in monitoring, DevOps, and site reliability. Our team shares practical guides, product updates, and industry insights.',
        articles: [
            { title: 'Why 10-Second Monitoring Intervals Matter', category: 'Engineering', date: 'Feb 2026' },
            { title: 'Building a Multi-Type Monitoring Engine in Java', category: 'Tutorial', date: 'Feb 2026' },
            { title: 'SSL Certificate Monitoring: A Complete Guide', category: 'Guide', date: 'Jan 2026' },
            { title: 'How We Handle 1M+ Health Checks Per Day', category: 'Engineering', date: 'Jan 2026' },
            { title: 'Incident Response Playbooks for SRE Teams', category: 'Best Practice', date: 'Dec 2025' },
            { title: 'The Real Cost of Downtime: A Data-Driven Analysis', category: 'Research', date: 'Dec 2025' },
        ],
    },
    discord: {
        title: 'Discord Community',
        subtitle: 'Join 5,000+ monitoring professionals',
        icon: <MessageCircle size={28} />,
        gradient: 'from-indigo-600 to-blue-500',
        color: 'indigo',
        description: 'Connect with other Sentinel users, share best practices, get help from the community, and chat directly with our engineering team. Join our active Discord server.',
        sections: [
            { title: '#general', desc: 'General discussions about monitoring and uptime', icon: <MessageCircle size={20} /> },
            { title: '#help', desc: 'Get help from the community and Sentinel team', icon: <HelpCircle size={20} /> },
            { title: '#feature-requests', desc: 'Suggest and vote on new features', icon: <Lightbulb size={20} /> },
            { title: '#show-and-tell', desc: 'Share your monitoring setups and dashboards', icon: <Star size={20} /> },
            { title: '#announcements', desc: 'Product updates, releases, and maintenance notices', icon: <Sparkles size={20} /> },
            { title: '#devops', desc: 'DevOps, SRE, and observability discussions', icon: <BookOpen size={20} /> },
        ],
    },
    referral: {
        title: 'Referral Program',
        subtitle: 'Earn rewards for every friend you bring to Sentinel',
        icon: <Gift size={28} />,
        gradient: 'from-emerald-600 to-green-500',
        color: 'emerald',
        description: 'Love Sentinel? Share it with your friends and colleagues. For every successful referral, both you and your friend get premium monitoring credits.',
        sections: [
            { title: 'Share Your Link', desc: 'Get a unique referral link from your dashboard', icon: <ExternalLink size={20} /> },
            { title: 'Friend Signs Up', desc: 'Your friend creates an account using your link', icon: <Users size={20} /> },
            { title: 'Both Earn Rewards', desc: 'You both get 30 days of premium monitoring free', icon: <Gift size={20} /> },
            { title: 'Unlimited Referrals', desc: 'No cap on how many friends you can refer', icon: <Star size={20} /> },
            { title: 'Track Progress', desc: 'See all your referrals and rewards in your dashboard', icon: <BookOpen size={20} /> },
            { title: 'Leaderboard', desc: 'Top referrers get exclusive swag and early access', icon: <Zap size={20} /> },
        ],
    },
    affiliate: {
        title: 'Affiliate Program',
        subtitle: 'Earn commission promoting Sentinel monitoring',
        icon: <Heart size={28} />,
        gradient: 'from-pink-600 to-rose-500',
        color: 'rose',
        description: 'Join our affiliate program and earn recurring commissions for every customer you refer. Perfect for DevOps bloggers, YouTubers, and tech influencers.',
        sections: [
            { title: '20% Recurring Commission', desc: 'Earn on every payment, not just the first', icon: <Star size={20} /> },
            { title: '90-Day Cookie Window', desc: 'Long attribution window for conversions', icon: <Zap size={20} /> },
            { title: 'Marketing Materials', desc: 'Banners, landing pages, and email templates provided', icon: <BookOpen size={20} /> },
            { title: 'Real-Time Dashboard', desc: 'Track clicks, conversions, and earnings live', icon: <Sparkles size={20} /> },
            { title: 'Monthly Payouts', desc: 'Automatic payouts via PayPal or bank transfer', icon: <Gift size={20} /> },
            { title: 'Dedicated Support', desc: 'Personal affiliate manager for top performers', icon: <Users size={20} /> },
        ],
    },
    nonprofit: {
        title: 'Non-Profit Program',
        subtitle: 'Free monitoring for qualifying nonprofits',
        icon: <Heart size={28} />,
        gradient: 'from-teal-600 to-emerald-500',
        color: 'teal',
        description: 'We believe every organization deserves reliable monitoring. Qualifying non-profits and educational institutions get free access to Sentinel\'s full feature set.',
        sections: [
            { title: 'Free Premium Access', desc: 'Full feature set at no cost for qualifying orgs', icon: <Star size={20} /> },
            { title: 'Quick Application', desc: 'Apply in 2 minutes, approved within 48 hours', icon: <Zap size={20} /> },
            { title: 'All Monitor Types', desc: 'Access all 7 monitoring types including SSL and API', icon: <CheckCircle2 size={20} /> },
            { title: 'Priority Support', desc: 'Dedicated support channel for non-profit partners', icon: <HelpCircle size={20} /> },
            { title: 'Education Discount', desc: 'Universities and schools qualify for 80% off', icon: <BookOpen size={20} /> },
            { title: 'Community Impact', desc: 'Join 500+ non-profits using Sentinel worldwide', icon: <Users size={20} /> },
        ],
    },
    suggest: {
        title: 'Suggest a Feature',
        subtitle: 'Shape the future of Sentinel monitoring',
        icon: <Lightbulb size={28} />,
        gradient: 'from-yellow-500 to-amber-500',
        color: 'amber',
        description: 'Your ideas drive our roadmap. Submit feature suggestions, vote on existing ideas, and see what the community is requesting. The most popular suggestions get prioritized.',
        sections: [
            { title: 'Submit Ideas', desc: 'Share your feature request with a detailed description', icon: <Lightbulb size={20} /> },
            { title: 'Community Voting', desc: 'Upvote ideas you want to see built next', icon: <Star size={20} /> },
            { title: 'Status Tracking', desc: 'See if your suggestion is planned, in progress, or shipped', icon: <CheckCircle2 size={20} /> },
            { title: 'Direct Feedback', desc: 'Our team responds to every suggestion within 48h', icon: <MessageCircle size={20} /> },
            { title: 'Beta Access', desc: 'Suggest a feature and get early access when it ships', icon: <Zap size={20} /> },
            { title: 'Hall of Fame', desc: 'Top contributors featured on our community page', icon: <Users size={20} /> },
        ],
    },
};

const GRADIENTS = {
    emerald: 'from-emerald-600 to-teal-500', purple: 'from-purple-600 to-violet-500',
    blue: 'from-blue-600 to-cyan-500', indigo: 'from-indigo-600 to-purple-500',
    amber: 'from-amber-600 to-orange-500', rose: 'from-rose-600 to-pink-500',
    teal: 'from-teal-600 to-emerald-500',
};

const ResourcePage = () => {
    const { slug } = useParams();
    const data = RESOURCE_DATA[slug];

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar dark />
                <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">📚</div>
                    <h1 className="text-4xl font-black mb-4">Resource Not Found</h1>
                    <p className="text-slate-400 mb-8">This resource page doesn't exist.</p>
                    <Link to="/" className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl">Go Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const gradient = data.gradient;

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar dark />

            {/* ───── HERO ───── */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b ${gradient} opacity-[0.08] rounded-full blur-3xl`}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 bg-gradient-to-r ${gradient} text-white`}>
                        <Sparkles size={14} /> Resource
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                        {data.title}
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {data.description}
                    </p>
                </div>
            </header>

            {/* ───── SECTIONS GRID ───── */}
            {data.sections && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {data.sections.map((s, i) => (
                            <div key={i} className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all">
                                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    {s.icon}
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-white mb-1.5">{s.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ───── ROADMAP MILESTONES ───── */}
            {data.milestones && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {data.milestones.map((m, i) => (
                            <div key={i} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 sm:p-8">
                                <h3 className="text-lg sm:text-xl font-black text-white mb-5">{m.phase}</h3>
                                <div className="space-y-3">
                                    {m.items.map((item, j) => (
                                        <div key={j} className="flex items-start gap-3">
                                            <CheckCircle2 size={16} className={`flex-shrink-0 mt-0.5 ${i === 0 ? 'text-emerald-400' : i === 1 ? 'text-amber-400' : 'text-slate-500'}`} />
                                            <span className="text-sm text-slate-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ───── BLOG ARTICLES ───── */}
            {data.articles && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {data.articles.map((a, i) => (
                            <div key={i} className="group bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 hover:bg-slate-800/50 transition-all cursor-pointer">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-0.5 bg-gradient-to-r ${gradient} text-white text-[10px] font-black rounded-full`}>{a.category}</span>
                                    <span className="text-[10px] text-slate-500 font-bold">{a.date}</span>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">{a.title}</h3>
                                <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-emerald-400 transition-colors font-bold">
                                    Read more <ChevronRight size={12} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ───── FAQs ───── */}
            {data.faqs && (
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {data.faqs.map((faq, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-6">
                                <h4 className="font-bold text-white text-sm sm:text-base mb-2">{faq.q}</h4>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ───── CODE EXAMPLE ───── */}
            {data.codeExample && (
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center">Quick Start Example</h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
                        <pre className="text-emerald-400 text-xs sm:text-sm font-mono whitespace-pre leading-relaxed">{data.codeExample}</pre>
                    </div>
                </section>
            )}

            {/* ───── CTA ───── */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28 text-center">
                <div className={`bg-gradient-to-br ${gradient} rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/5 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-black/5 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to Get Started?</h2>
                        <p className="text-white/70 mb-6 max-w-md mx-auto text-sm sm:text-base">
                            Start monitoring your infrastructure in under 60 seconds.
                        </p>
                        <Link to="/features" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-xl inline-block text-sm sm:text-base">
                            Explore Features
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ResourcePage;
