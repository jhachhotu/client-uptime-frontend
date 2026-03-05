import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Globe, Clock, Lock, Search, Plug, Radio, Code, Waypoints, AlertTriangle } from 'lucide-react';

const TYPE_ICONS = {
  HTTP: <Globe size={18} />,
  SSL: <Lock size={18} />,
  KEYWORD: <Search size={18} />,
  PORT: <Plug size={18} />,
  PING: <Radio size={18} />,
  API: <Code size={18} />,
  DNS: <Waypoints size={18} />,
};

const TYPE_COLORS = {
  HTTP: 'emerald', SSL: 'purple', KEYWORD: 'blue',
  PORT: 'orange', PING: 'teal', API: 'indigo', DNS: 'amber',
};

const MonitorCard = ({ site, onDelete }) => {
  const isUp = site.status === 'UP';
  const isUnknown = site.status === 'UNKNOWN';
  const monitorType = site.monitorType || 'HTTP';
  const typeIcon = TYPE_ICONS[monitorType] || TYPE_ICONS.HTTP;
  const sslWarning = monitorType === 'SSL' && site.sslDaysRemaining != null && site.sslDaysRemaining <= 30;

  return (
    <div className={`relative group bg-white rounded-2xl border transition-all duration-500 
      ${isUp ? 'border-slate-100 shadow-sm hover:shadow-lg' : isUnknown ? 'border-slate-200 shadow-sm' : 'border-red-200 bg-red-50/30 shadow-md'}`}>

      {/* Delete Button */}
      <button
        onClick={(e) => { e.preventDefault(); onDelete(site.id); }}
        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
        title="Delete Monitor"
      >
        <Trash2 size={16} />
      </button>

      <Link to={`/incidents/${site.id}`} className="block p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-600' : isUnknown ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-600'}`}>
              {typeIcon}
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm truncate w-32" title={site.url}>
                {site.name || site.url}
              </h3>
              <p className="text-[10px] text-slate-400 truncate w-32">{site.url}</p>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-tighter border 
            ${isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : isUnknown ? 'bg-slate-50 text-slate-500 border-slate-200'
                : 'bg-red-50 text-red-600 border-red-100'}`}>
            {isUp ? '● ONLINE' : isUnknown ? '● PENDING' : '● OFFLINE'}
          </div>
        </div>

        {/* Monitor Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase">
            {monitorType}
          </span>
          {sslWarning && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold">
              <AlertTriangle size={10} /> SSL: {site.sslDaysRemaining}d left
            </span>
          )}
          {monitorType === 'PORT' && site.port && (
            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[10px] font-mono">
              :{site.port}
            </span>
          )}
        </div>

        {/* Response Time Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Response Time</span>
            <span className={isUp ? 'text-slate-600' : isUnknown ? 'text-slate-400' : 'text-red-500'}>
              {site.responseTime || 0}ms
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isUp ? 'bg-emerald-500' : isUnknown ? 'bg-slate-300' : 'bg-red-500'}`}
              style={{ width: isUp ? '100%' : isUnknown ? '30%' : '10%' }}
            ></div>
          </div>
        </div>

        {/* Last Check */}
        <div className="flex items-center gap-1 mt-4 text-[10px] text-slate-400 font-medium">
          <Clock size={10} />
          {site.lastCheck
            ? `Last checked: ${new Date(site.lastCheck).toLocaleTimeString()}`
            : 'Waiting for first check...'
          }
        </div>
      </Link>
    </div>
  );
};

export default MonitorCard;