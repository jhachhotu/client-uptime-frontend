import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMonitors } from '../services/monitorService';
import { AlertCircle, CheckCircle2, XCircle, Clock, ArrowRight, Activity, Globe } from 'lucide-react';

const Incidents = () => {
    const { isAuthenticated } = useAuth();
    const [monitors, setMonitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'down', 'up'

    const loadData = async () => {
        try {
            const data = await getMonitors();
            setMonitors(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
            const interval = setInterval(loadData, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const filtered = monitors.filter(m => {
        if (filter === 'down') return m.status === 'DOWN';
        if (filter === 'up') return m.status === 'UP';
        return true;
    });

    const downCount = monitors.filter(m => m.status === 'DOWN').length;
    const upCount = monitors.filter(m => m.status === 'UP').length;

    if (loading) return <div className="p-10 text-center text-slate-500">Loading incidents...</div>;

    return (
        <div>
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
                    <AlertCircle size={16} /> INCIDENT CENTER
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Incidents & Status</h1>
                <p className="text-slate-500 font-medium mt-1">
                    Real-time health overview of all monitored services.
                </p>
            </header>

            {/* Stats Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Monitors</p>
                    <p className="text-2xl font-black text-slate-900">{monitors.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Operational</p>
                    <p className="text-2xl font-black text-emerald-600">{upCount}</p>
                </div>
                <div className={`bg-white rounded-2xl border p-5 shadow-sm ${downCount > 0 ? 'border-red-200 bg-red-50/30' : 'border-slate-200'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${downCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>Down</p>
                    <p className={`text-2xl font-black ${downCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>{downCount}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-6xl mx-auto flex gap-2 mb-6">
                <FilterTab label="All" count={monitors.length} active={filter === 'all'} onClick={() => setFilter('all')} />
                <FilterTab label="Down" count={downCount} active={filter === 'down'} onClick={() => setFilter('down')} color="red" />
                <FilterTab label="Up" count={upCount} active={filter === 'up'} onClick={() => setFilter('up')} color="emerald" />
            </div>

            {/* Incidents List */}
            <div className="max-w-6xl mx-auto space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <CheckCircle2 size={48} className="text-emerald-300 mx-auto mb-4" />
                        <p className="text-lg font-bold text-slate-900 mb-1">
                            {filter === 'down' ? 'No incidents detected!' : 'No monitors found'}
                        </p>
                        <p className="text-slate-400 text-sm">
                            {filter === 'down' ? 'All your services are running smoothly.' : 'Add monitors from the Dashboard to track services.'}
                        </p>
                    </div>
                ) : (
                    filtered.map(site => (
                        <IncidentRow key={site.id} site={site} />
                    ))
                )}
            </div>
        </div>
    );
};

const IncidentRow = ({ site }) => {
    const isUp = site.status === 'UP';
    const isUnknown = site.status === 'UNKNOWN';

    return (
        <Link
            to={`/incidents/${site.id}`}
            className={`block bg-white rounded-2xl border p-4 md:p-6 transition-all hover:shadow-md ${isUp ? 'border-slate-200' : isUnknown ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
                }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${isUp ? 'bg-emerald-100' : isUnknown ? 'bg-slate-100' : 'bg-red-100'
                        }`}>
                        {isUp
                            ? <CheckCircle2 size={20} className="text-emerald-600" />
                            : isUnknown
                                ? <Globe size={20} className="text-slate-500" />
                                : <XCircle size={20} className="text-red-600" />
                        }
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-black text-slate-900 text-sm md:text-base">{site.name || site.url}</h3>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{site.url}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 ml-14 sm:ml-0">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${isUp
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : isUnknown
                            ? 'bg-slate-50 text-slate-500 border-slate-200'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {isUp ? '● ONLINE' : isUnknown ? '● PENDING' : '● OFFLINE'}
                    </div>

                    {/* Response Time */}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                        <Activity size={12} />
                        <span className="font-mono">{site.responseTime || 0}ms</span>
                    </div>

                    {/* Last Check */}
                    <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>{site.lastCheck ? new Date(site.lastCheck).toLocaleTimeString() : 'Pending'}</span>
                    </div>

                    <ArrowRight size={16} className="text-slate-300 flex-shrink-0" />
                </div>
            </div>
        </Link>
    );
};

const FilterTab = ({ label, count, active, onClick, color = 'slate' }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${active
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
    >
        {label} <span className={`ml-1 ${active ? 'text-slate-300' : 'text-slate-400'}`}>({count})</span>
    </button>
);

export default Incidents;
