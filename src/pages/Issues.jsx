import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LifeBuoy,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UploadCloud,
  Image as ImageIcon,
  X,
  ExternalLink,
  ShieldAlert,
  Server,
  Filter,
  Trash2,
  Maximize2,
  RefreshCw,
  Cpu,
  Cloud
} from 'lucide-react';
import {
  getIssues,
  createIssue,
  updateIssueStatus,
  deleteIssue,
  getMonitors
} from '../services/monitorService';

const CATEGORIES = [
  { id: 'BUG', label: 'Bug / Defect', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'DOWNTIME', label: 'Downtime / Outage', color: 'text-red-600 bg-red-50 border-red-200' },
  { id: 'PERFORMANCE', label: 'High Latency / Lag', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'UI_GLITCH', label: 'UI / Visual Glitch', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'SECURITY', label: 'Security Concern', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'OTHER', label: 'Other Support', color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

const PRIORITIES = [
  { id: 'LOW', label: 'Low', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'MEDIUM', label: 'Medium', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'HIGH', label: 'High', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'CRITICAL', label: 'Critical', badge: 'bg-red-50 text-red-700 border-red-200' },
];

const STATUSES = [
  { id: 'OPEN', label: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'INVESTIGATING', label: 'Investigating', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'RESOLVED', label: 'Resolved', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { id: 'CLOSED', label: 'Closed', color: 'bg-slate-50 text-slate-400 border-slate-100' },
];

const Issues = () => {
  const [searchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('BUG');
  const [priority, setPriority] = useState('MEDIUM');
  const [websiteId, setWebsiteId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [issuesData, monitorsData] = await Promise.all([
        getIssues(),
        getMonitors().catch(() => [])
      ]);
      setIssues(issuesData || []);
      setMonitors(monitorsData || []);
    } catch (err) {
      console.error('Failed to load issues', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check if URL has ?raise=true and pre-select websiteId if passed
    const prefillWebsite = searchParams.get('websiteId');
    if (prefillWebsite) {
      setWebsiteId(prefillWebsite);
      setCategory('DOWNTIME');
      setPriority('HIGH');
      setIsModalOpen(true);
    } else if (searchParams.get('raise') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Support Ctrl+V paste of screenshots
  useEffect(() => {
    const handlePaste = (e) => {
      if (!isModalOpen) return;
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          handleFileSelect(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isModalOpen]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Only image files (PNG, JPEG, WebP) are allowed as proof.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 10MB.');
      return;
    }
    setErrorMsg('');
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearProof = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter both title and description.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('priority', priority);
      if (websiteId) {
        formData.append('websiteId', websiteId);
      }
      if (proofFile) {
        formData.append('proof', proofFile);
      }

      await createIssue(formData);

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('BUG');
      setPriority('MEDIUM');
      setWebsiteId('');
      clearProof();
      setIsModalOpen(false);

      // Reload
      await loadData();
    } catch (err) {
      console.error('Error raising issue:', err);
      setErrorMsg(err.message || 'Failed to submit issue. Please check your network.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIssueStatus(id, newStatus);
      setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue and its S3 proof?')) return;
    try {
      await deleteIssue(id);
      setIssues(prev => prev.filter(issue => issue.id !== id));
    } catch (err) {
      console.error('Failed to delete issue', err);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filterStatus === 'ALL') return true;
    return issue.status === filterStatus;
  });

  const openCount = issues.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;
  const criticalCount = issues.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length;
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
            <LifeBuoy size={18} /> ISSUE & INCIDENT CENTER
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Raise Issues & Incident Proofs
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Submit bug reports and downtime proof screenshots processed via AWS S3 & Lambda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh Issues"
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all cursor-pointer"
          >
            <Plus size={20} /> Raise New Issue
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Issues</p>
          <p className="text-2xl font-black text-slate-900">{issues.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm bg-amber-50/20">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Active / In Progress</p>
          <p className="text-2xl font-black text-amber-700">{openCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm bg-red-50/20">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">High / Critical</p>
          <p className="text-2xl font-black text-red-700">{criticalCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm bg-emerald-50/20">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Resolved</p>
          <p className="text-2xl font-black text-emerald-700">{resolvedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex gap-2">
          {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st} {st !== 'ALL' && `(${issues.filter(i => i.status === st).length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Cloud size={14} className="text-emerald-500" /> AWS S3 Storage &bull; <Cpu size={14} className="text-blue-500" /> AWS Lambda Trigger
        </div>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-3"></div>
          Loading issues and proof attachments...
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-900">No issues found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1 mb-6">
            {filterStatus === 'ALL'
              ? "You haven't raised any issues yet. If a website goes down or glitches, raise an issue with screenshot proof."
              : `There are currently no issues with status '${filterStatus}'.`}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors"
          >
            Raise an Issue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const catObj = CATEGORIES.find(c => c.id === issue.category) || CATEGORIES[0];
            const prioObj = PRIORITIES.find(p => p.id === issue.priority) || PRIORITIES[1];
            const statObj = STATUSES.find(s => s.id === issue.status) || STATUSES[0];

            return (
              <div
                key={issue.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${catObj.color}`}>
                      {catObj.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${prioObj.badge}`}>
                      {prioObj.label} Priority
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statObj.color}`}>
                      ● {statObj.label}
                    </span>
                    {issue.websiteName && (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Server size={12} /> {issue.websiteName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>{issue.createdAt ? new Date(issue.createdAt).toLocaleString() : 'Just now'}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">{issue.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Screenshot Proof Section */}
                {issue.screenshotUrl && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => setLightboxImg(issue.screenshotUrl)}
                        className="relative group w-20 h-16 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 cursor-pointer flex-shrink-0"
                      >
                        <img
                          src={issue.screenshotUrl}
                          alt="Issue Proof"
                          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 size={16} className="text-white" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-emerald-500" /> Screenshot Proof Attached
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Cloud size={10} className="text-blue-500" /> AWS S3 Object
                          </span>
                          {issue.lambdaProcessed && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Cpu size={10} className="text-emerald-600" /> Lambda Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setLightboxImg(issue.screenshotUrl)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      Inspect Full Proof <ExternalLink size={12} />
                    </button>
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Reported by <span className="font-bold text-slate-600">{issue.userName || issue.userEmail}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {issue.status === 'OPEN' && (
                      <button
                        onClick={() => handleStatusChange(issue.id, 'INVESTIGATING')}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        Start Investigation
                      </button>
                    )}
                    {issue.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleStatusChange(issue.id, 'RESOLVED')}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(issue.id)}
                      title="Delete Ticket"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Raise Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-black text-xl">
                <LifeBuoy className="text-emerald-500" size={24} />
                Raise an Issue with Proof
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Issue Summary / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 502 Bad Gateway observed on checkout endpoint"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Associated Monitored Service (Optional)
                </label>
                <select
                  value={websiteId}
                  onChange={e => setWebsiteId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- General / No Specific Monitor --</option>
                  {monitors.map(m => (
                    <option key={m.id} value={m.id}>{m.name || m.url} ({m.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe steps to reproduce, error codes observed, or impact..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* Drag & Drop Screenshot / Image Proof Uploader */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Screenshot Proof / Image Attachment
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Stored securely in AWS S3 and processed by AWS Lambda. You can also paste screenshots directly with <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">Ctrl + V</kbd>.
                </p>

                {proofPreview ? (
                  <div className="relative border border-slate-200 rounded-2xl p-3 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={proofPreview}
                        alt="Proof Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-xs">
                          {proofFile ? proofFile.name : 'Pasted Screenshot.png'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {proofFile ? `${(proofFile.size / 1024).toFixed(1)} KB` : 'Ready for S3 upload'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearProof}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/20"
                  >
                    <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-xs font-bold text-slate-700">
                      Click to browse or drag & drop screenshot
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, WebP up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileSelect(e.target.files?.[0])}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading to S3 & Processing...
                    </>
                  ) : (
                    'Submit Issue'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Resolution Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImg}
              alt="Full Proof Screenshot"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-slate-700"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-12 right-0 text-white font-bold text-sm flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm"
            >
              <X size={16} /> Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
