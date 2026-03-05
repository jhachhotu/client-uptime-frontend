import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMonitors, deleteMonitor } from '../services/monitorService';
import MonitorCard from '../components/MonitorCard';
import AddMonitorModal from '../components/AddMonitorModal';
import { Plus, Activity } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [monitors, setMonitors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const data = await getMonitors();
      setMonitors(data);
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

  return (
    <div>
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
            <Activity size={16} /> LIVE STATUS
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sentinel Dashboard</h1>
          <p className="text-slate-500 font-medium">
            Tracking {monitors.length} nodes —
            <span className="text-emerald-500 font-bold"> {upCount} UP</span>
            {downCount > 0 && <span className="text-red-500 font-bold"> · {downCount} DOWN</span>}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl"
        >
          <Plus size={20} /> Add Monitor
        </button>
      </header>

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