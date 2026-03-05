import React, { useState } from 'react';
import { createMonitor } from '../services/monitorService';
import { Globe, Lock, Search, Plug, Radio, Code, Waypoints } from 'lucide-react';

const MONITOR_TYPES = [
  { id: 'HTTP', label: 'HTTP(S)', icon: <Globe size={18} />, desc: 'Website & endpoint monitoring' },
  { id: 'SSL', label: 'SSL', icon: <Lock size={18} />, desc: 'Certificate expiry monitoring' },
  { id: 'KEYWORD', label: 'Keyword', icon: <Search size={18} />, desc: 'Check if page contains text' },
  { id: 'PORT', label: 'Port', icon: <Plug size={18} />, desc: 'TCP port availability check' },
  { id: 'PING', label: 'Ping', icon: <Radio size={18} />, desc: 'ICMP reachability check' },
  { id: 'API', label: 'API', icon: <Code size={18} />, desc: 'REST API monitoring' },
  { id: 'DNS', label: 'DNS', icon: <Waypoints size={18} />, desc: 'DNS resolution monitoring' },
];

const AddMonitorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', url: '', monitorType: 'HTTP',
    keyword: '', port: '', httpMethod: 'GET', httpBody: '', dnsExpectedIp: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.port) payload.port = parseInt(payload.port);
      else delete payload.port;
      if (!payload.keyword) delete payload.keyword;
      if (!payload.httpBody) delete payload.httpBody;
      if (!payload.dnsExpectedIp) delete payload.dnsExpectedIp;

      await createMonitor(payload);
      if (typeof onSuccess === 'function') onSuccess();
      onClose();
      setFormData({ name: '', url: '', monitorType: 'HTTP', keyword: '', port: '', httpMethod: 'GET', httpBody: '', dnsExpectedIp: '' });
    } catch (error) {
      console.error("Failed to add monitor:", error);
      alert("Failed to add monitor. Check if the backend is running!");
    }
  };

  const selectedType = formData.monitorType;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6">New Monitor</h2>

        {/* Monitor Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-3">Monitor Type</label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {MONITOR_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, monitorType: type.id })}
                className={`flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all ${selectedType === type.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                title={type.desc}
              >
                {type.icon}
                <span className="mt-1">{type.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">{MONITOR_TYPES.find(t => t.id === selectedType)?.desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
            <input
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. My Production API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {selectedType === 'PORT' || selectedType === 'PING' ? 'Host / URL' : 'Endpoint URL'}
            </label>
            <input
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder={selectedType === 'PORT' ? 'https://myserver.com' : 'https://mysite.com'}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          {/* KEYWORD-specific */}
          {selectedType === 'KEYWORD' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Keyword to Find</label>
              <input
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Welcome, Login, 200 OK"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1">Alert triggers if this text is NOT found on the page.</p>
            </div>
          )}

          {/* PORT-specific */}
          {selectedType === 'PORT' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Port Number</label>
              <input
                required type="number" min="1" max="65535"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 3306, 5432, 27017"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              />
            </div>
          )}

          {/* API-specific */}
          {selectedType === 'API' && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">HTTP Method</label>
                <select
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.httpMethod}
                  onChange={(e) => setFormData({ ...formData, httpMethod: e.target.value })}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              {(formData.httpMethod === 'POST' || formData.httpMethod === 'PUT') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Request Body (JSON)</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none font-mono text-sm"
                    placeholder='{"key": "value"}'
                    value={formData.httpBody}
                    onChange={(e) => setFormData({ ...formData, httpBody: e.target.value })}
                  />
                </div>
              )}
            </>
          )}

          {/* DNS-specific */}
          {selectedType === 'DNS' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Expected IP (optional)</label>
              <input
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 76.76.21.21"
                value={formData.dnsExpectedIp}
                onChange={(e) => setFormData({ ...formData, dnsExpectedIp: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1">Alert if DNS resolves to a different IP. Leave blank to just verify resolution.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Start Monitoring</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMonitorModal;