import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMonitors, deleteMonitor } from '../services/monitorService';
import { getSubscription } from '../services/paymentService';
import MonitorCard from '../components/MonitorCard';
import AddMonitorModal from '../components/AddMonitorModal';
import { Plus, Activity, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [monitors, setMonitors] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [monitorsData, subData] = await Promise.all([
        getMonitors().catch(() => []),
        getSubscription().catch(() => null)
      ]);
      setMonitors(monitorsData || []);
      if (subData) setSubscription(subData);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Disconnect this monitor?")) {
      try {
        await deleteMonitor(id);
        loadData(); // Refresh the grid
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete monitor. Check if the backend is running!");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 10000); // 10s real-time polling
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Count UP/DOWN for header stats
  const upCount = monitors.filter(m => m.status === 'UP').length;
  const downCount = monitors.filter(m => m.status === 'DOWN').length;

  const maxMonitors = subscription?.maxMonitors || 3;
  const isAtLimit = monitors.length >= maxMonitors;

  return (
    <div>
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              <Activity size={14} /> LIVE STATUS
            </span>
            {subscription && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-slate-200">
                <Sparkles size={12} className="text-emerald-400" />
                {subscription.tierDisplayName} Plan ({monitors.length}/{maxMonitors >= 1000 ? '∞' : maxMonitors})
              </span>
            )}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sentinel Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Tracking {monitors.length} nodes —
            <span className="text-emerald-500 font-bold"> {upCount} UP</span>
            {downCount > 0 && <span className="text-red-500 font-bold"> · {downCount} DOWN</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/billing"
            className="px-4 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all"
          >
            Manage Plan
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl"
          >
            <Plus size={20} /> Add Monitor
          </button>
        </div>
      </header>

      {/* Quota Limit Banner if reached */}
      {isAtLimit && (
        <div className="max-w-6xl mx-auto mb-8 p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-black text-slate-900">
                Monitor limit reached ({monitors.length} / {maxMonitors} used)
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                You have reached the maximum monitor allowance for your {subscription?.tierDisplayName || 'Starter'} plan. Upgrade to unlock up to 25 or unlimited monitors with 10-second checks.
              </p>
            </div>
          </div>
          <Link
            to="/billing"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors shrink-0 shadow-sm"
          >
            Upgrade Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {monitors.map(site => (
          <MonitorCard
            key={site.id}
            site={site}
            onDelete={() => handleDelete(site.id)}
          />
        ))}
      </div>

      <AddMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Dashboard;