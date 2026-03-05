import React, { useState, useEffect } from 'react';
import { getBusinessStats } from '../services/monitorService';
import {
  TrendingUp, Activity, AlertTriangle, Users, Clock,
  CheckCircle2, XCircle, ArrowUpRight, Gauge, Timer, Wifi, WifiOff, BarChart3
} from 'lucide-react';

const BusinessAnalytics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const result = await getBusinessStats();
      setStats(result);
    } catch (error) {
      console.error("Failed to fetch business metrics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const totalMonitors = stats.length;
  const avgUptime = totalMonitors > 0
    ? (stats.reduce((acc, s) => acc + s.uptimePercentage, 0) / totalMonitors).toFixed(2) : '0.00';
  const totalIncidents = stats.reduce((acc, s) => acc + s.incidentCount, 0);
  const downSites = stats.filter(s => s.status === 'DOWN').length;
  const upSites = stats.filter(s => s.status === 'UP').length;
  const avgResponseTime = totalMonitors > 0
    ? Math.round(stats.reduce((acc, s) => acc + s.avgResponseTime, 0) / totalMonitors) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold text-sm">Calculating Business Impact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Real-time infrastructure health and performance analytics.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Global Uptime"
          value={`${avgUptime}%`}
          icon={<TrendingUp size={18} />}
          iconBg="bg-emerald-500"
          trend={parseFloat(avgUptime) >= 99 ? "Excellent" : parseFloat(avgUptime) >= 95 ? "Good" : "Attention"}
          trendGood={parseFloat(avgUptime) >= 95}
        />
        <KpiCard
          title="Avg Response"
          value={`${avgResponseTime}ms`}
          icon={<Activity size={18} />}
          iconBg="bg-blue-500"
          trend={avgResponseTime < 500 ? "Fast" : avgResponseTime < 1000 ? "Normal" : "Slow"}
          trendGood={avgResponseTime < 1000}
        />
        <KpiCard
          title="Total Incidents"
          value={totalIncidents.toLocaleString()}
          icon={<AlertTriangle size={18} />}
          iconBg="bg-amber-500"
          trend={`${downSites} down now`}
          trendGood={downSites === 0}
        />
        <KpiCard
          title="Monitors"
          value={totalMonitors.toString()}
          icon={<Gauge size={18} />}
          iconBg="bg-purple-500"
          trend={`${upSites} online`}
          trendGood={true}
        />
      </div>

      {/* Summary Bar */}
      {totalMonitors > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Health</p>
            <p className="text-xs font-bold text-slate-500">{upSites}/{totalMonitors} healthy</p>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
            {upSites > 0 && (
              <div className="bg-emerald-500 rounded-l-full transition-all" style={{ width: `${(upSites / totalMonitors) * 100}%` }}></div>
            )}
            {downSites > 0 && (
              <div className="bg-red-500 rounded-r-full transition-all" style={{ width: `${(downSites / totalMonitors) * 100}%` }}></div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2.5">
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> UP ({upSites})</span>
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500"></span> DOWN ({downSites})</span>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Monitor</th>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Uptime</th>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Response</th>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Incidents</th>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Downtime</th>
              <th className="px-5 lg:px-6 py-4 text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats.map((site, i) => {
              const isUp = site.status === 'UP';
              return (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 lg:px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">{site.name || site.url}</p>
                    <p className="text-[10px] lg:text-xs text-slate-400 truncate max-w-[200px] lg:max-w-xs">{site.url}</p>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isUp ? <Wifi size={12} /> : <WifiOff size={12} />}
                      {isUp ? 'UP' : 'DOWN'}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 lg:w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${site.uptimePercentage >= 99 ? 'bg-emerald-500' : site.uptimePercentage >= 95 ? 'bg-blue-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(site.uptimePercentage, 100)}%` }}></div>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-700">{site.uptimePercentage.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-5 lg:px-6 py-4 font-mono text-xs text-slate-600">{site.avgResponseTime}ms</td>
                  <td className="px-5 lg:px-6 py-4">
                    <span className={`font-black text-sm ${site.incidentCount > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                      {site.incidentCount}
                    </span>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <span className="text-xs text-slate-500 font-medium">{site.totalDowntime || '0 min'}</span>
                  </td>
                  <td className="px-5 lg:px-6 py-4">
                    <HealthBadge uptime={site.uptimePercentage} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {stats.length === 0 && (
          <div className="text-center py-16">
            <BarChart3 size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">No monitors yet</p>
            <p className="text-slate-300 text-xs mt-1">Add monitors from the Dashboard to see analytics.</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {stats.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <BarChart3 size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">No monitors yet</p>
            <p className="text-slate-300 text-xs mt-1">Add monitors from the Dashboard.</p>
          </div>
        )}

        {stats.map((site, i) => {
          const isUp = site.status === 'UP';
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-sm truncate">{site.name || site.url}</p>
                  <p className="text-[10px] text-slate-400 truncate">{site.url}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {isUp ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {isUp ? 'UP' : 'DOWN'}
                </span>
              </div>

              {/* Uptime Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>Uptime</span>
                  <span className="font-mono">{site.uptimePercentage.toFixed(2)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${site.uptimePercentage >= 99 ? 'bg-emerald-500' : site.uptimePercentage >= 95 ? 'bg-blue-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(site.uptimePercentage, 100)}%` }}></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Response</p>
                  <p className="text-xs font-black text-slate-700 font-mono">{site.avgResponseTime}ms</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Incidents</p>
                  <p className={`text-xs font-black ${site.incidentCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>{site.incidentCount}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-3 py-2 text-center">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Downtime</p>
                  <p className="text-xs font-black text-slate-700">{site.totalDowntime || '0m'}</p>
                </div>
              </div>

              {/* Health Badge */}
              <div className="flex justify-end">
                <HealthBadge uptime={site.uptimePercentage} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ───── Sub Components ───── */
const KpiCard = ({ title, value, icon, iconBg, trend, trendGood }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className={`p-2 sm:p-2.5 ${iconBg} text-white rounded-xl`}>{icon}</div>
      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg ${trendGood ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mt-0.5">{value}</h3>
  </div>
);

const HealthBadge = ({ uptime }) => {
  if (uptime >= 99) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 size={10} /> Excellent</span>;
  if (uptime >= 95) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-700"><ArrowUpRight size={10} /> Good</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-100 text-red-700"><AlertTriangle size={10} /> Critical</span>;
};

export default BusinessAnalytics;