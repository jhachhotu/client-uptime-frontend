import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Globe, Lock, Search, Plug, Radio, Code, Waypoints, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { Footer } from './About';
import Navbar from '../components/Navbar';

const TYPE_ICONS = {
    HTTP: <Globe size={16} />,
    SSL: <Lock size={16} />,
    KEYWORD: <Search size={16} />,
    PORT: <Plug size={16} />,
    PING: <Radio size={16} />,
    API: <Code size={16} />,
    DNS: <Waypoints size={16} />,
};

const StatusPage = () => {
    const [monitors, setMonitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetch, setLastFetch] = useState(null);

    const fetchStatus = async () => {
        try {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/monitoring';
            const response = await fetch(`${API_BASE}/status`);
            const data = await response.json();
            setMonitors(data);
            setLastFetch(new Date());
        } catch (error) {
            console.error('Failed to fetch status', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 15000);
        return () => clearInterval(interval);
    }, []);

    const upCount = monitors.filter(m => m.status === 'UP').length;
    const downCount = monitors.filter(m => m.status === 'DOWN').length;
    const total = monitors.length;
    const allUp = downCount === 0 && total > 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Header */}
            <div className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-8 text-center">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">System Status</h1>
                <p className="text-slate-500">Real-time health of all monitored services.</p>
            </div>

            {/* Overall Status Banner */}
            <div className="max-w-5xl mx-auto px-6 md:px-8 mb-8">
                <div className={`rounded-2xl p-6 text-center font-bold ${loading
                    ? 'bg-slate-100 text-slate-500'
                    : allUp
                        ? 'bg-emerald-500 text-white'
                        : downCount > 0
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                    }`}>
                    {loading ? (
                        <span className="flex items-center justify-center gap-2"><RefreshCw size={18} className="animate-spin" /> Loading status...</span>
                    ) : allUp ? (
                        <span className="flex items-center justify-center gap-2"><CheckCircle2 size={20} /> All Systems Operational</span>
                    ) : downCount > 0 ? (
                        <span className="flex items-center justify-center gap-2"><XCircle size={20} /> {downCount} Service{downCount > 1 ? 's' : ''} Experiencing Issues</span>
                    ) : (
                        <span>No monitors configured</span>
                    )}
                </div>
            </div>

            {/* Stats */}
            {!loading && total > 0 && (
                <div className="max-w-5xl mx-auto px-6 md:px-8 mb-8 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
                        <p className="text-2xl font-black text-slate-900">{total}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Monitors</p>
                    </div>
                    <div className="bg-white rounded-xl border border-emerald-100 p-4 text-center shadow-sm">
                        <p className="text-2xl font-black text-emerald-500">{upCount}</p>
                        <p className="text-xs font-bold text-emerald-400 uppercase">Online</p>
                    </div>
                    <div className={`bg-white rounded-xl border p-4 text-center shadow-sm ${downCount > 0 ? 'border-red-200' : 'border-slate-200'}`}>
                        <p className={`text-2xl font-black ${downCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>{downCount}</p>
                        <p className={`text-xs font-bold uppercase ${downCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>Offline</p>
                    </div>
                </div>
            )}

            {/* Monitor List */}
            <div className="max-w-5xl mx-auto px-6 md:px-8 pb-16 space-y-3">
                {monitors.map(monitor => {
                    const isUp = monitor.status === 'UP';
                    const isUnknown = monitor.status === 'UNKNOWN';
                    const icon = TYPE_ICONS[monitor.monitorType] || TYPE_ICONS.HTTP;
                    const sslWarning = monitor.monitorType === 'SSL' && monitor.sslDaysRemaining != null && monitor.sslDaysRemaining <= 30;

                    return (
                        <div
                            key={monitor.id}
                            className={`bg-white rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${isUp ? 'border-slate-200' : isUnknown ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Status dot */}
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${isUp ? 'bg-emerald-100' : isUnknown ? 'bg-slate-100' : 'bg-red-100'
                                    }`}>
                                    {isUp
                                        ? <CheckCircle2 size={18} className="text-emerald-600" />
                                        : isUnknown
                                            ? icon
                                            : <XCircle size={18} className="text-red-600" />
                                    }
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{monitor.name || monitor.url}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{monitor.monitorType || 'HTTP'}</span>
                                        <span className="text-xs text-slate-400 truncate max-w-xs">{monitor.url}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 ml-14 sm:ml-0">
                                {sslWarning && (
                                    <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                        <AlertTriangle size={12} /> {monitor.sslDaysRemaining}d
                                    </span>
                                )}
                                <span className="text-xs text-slate-400 font-mono">{monitor.responseTime || 0}ms</span>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : isUnknown ? 'bg-slate-50 text-slate-500 border-slate-200'
                                        : 'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                    {isUp ? '● ONLINE' : isUnknown ? '● PENDING' : '● OFFLINE'}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && total === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <Globe size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="font-bold">No monitors configured yet.</p>
                    </div>
                )}

                {/* Last updated time */}
                {lastFetch && (
                    <p className="text-center text-xs text-slate-400 pt-4 flex items-center justify-center gap-1">
                        <Clock size={10} /> Last updated: {lastFetch.toLocaleTimeString()} · Auto-refreshes every 15s
                    </p>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default StatusPage;
