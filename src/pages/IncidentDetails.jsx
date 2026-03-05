import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, ShieldAlert, Activity, AlertCircle, CheckCircle2, Send, MessageCircle, User } from 'lucide-react';
import { getMonitorById, getMonitorLogs, getComments, addComment } from '../services/monitorService';

const IncidentDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [site, setSite] = useState(null);
  const [logs, setLogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const commentRef = useRef(null);

  const fetchData = async () => {
    try {
      const [siteData, logsData, commentsData] = await Promise.all([
        getMonitorById(id),
        getMonitorLogs(id, 24),
        getComments(id)
      ]);
      setSite(siteData);
      setLogs(logsData);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to load incident details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  // Auto-focus comment section if ?comment=true (from email link)
  useEffect(() => {
    if (!loading && searchParams.get('comment') === 'true' && commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: 'smooth' });
      commentRef.current.querySelector('textarea')?.focus();
    }
  }, [loading, searchParams]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(id, newComment.trim());
      setNewComment('');
      const updated = await getComments(id);
      setComments(updated);
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-slate-500 font-bold text-sm">Retrieving Incident History...</p>
      </div>
    </div>
  );

  if (!site) return <div className="p-10 text-center text-red-500 font-bold font-mono">INCIDENT_NOT_FOUND: #{id}</div>;

  const isUp = site.status === 'UP';
  const upLogs = logs.filter(l => l.status === 'UP').length;
  const totalLogs = logs.length;
  const uptimePercent = totalLogs > 0 ? ((upLogs / totalLogs) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link to="/incidents" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
        <ArrowLeft size={16} /> Back to Incidents
      </Link>

      {/* Incident Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className={`p-5 sm:p-8 ${isUp ? 'bg-emerald-500' : 'bg-red-600'} text-white`}>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-70 mb-2">Incident Report</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black truncate">{site.name || site.url}</h1>
              <p className="text-xs sm:text-sm opacity-80 mt-1 truncate">{site.url}</p>
            </div>
            <div className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm ${isUp ? 'bg-white text-emerald-600' : 'bg-white text-red-600'}`}>
              {isUp ? '● OPERATIONAL' : '● DOWN'}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
            <p className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <ShieldAlert size={14} className={isUp ? 'text-emerald-500' : 'text-red-500'} />
              {isUp ? 'Healthy' : 'Degraded'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Response</p>
            <p className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-lg">
              <Activity size={14} className="text-blue-500" />
              {site.responseTime || 0}ms
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Uptime (24h)</p>
            <p className="font-bold text-slate-800 text-sm sm:text-lg">{uptimePercent}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Last Check</p>
            <p className="font-bold text-slate-800 flex items-center gap-2 text-xs sm:text-sm">
              <Clock size={14} className="text-slate-400" />
              {site.lastCheck ? new Date(site.lastCheck).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base sm:text-lg font-black text-slate-900">Activity Log (24h)</h3>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400">{logs.length} events</span>
        </div>

        {logs.length === 0 ? (
          <p className="text-slate-400 text-center py-8 text-sm">No monitoring logs yet. Waiting for first ping...</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {logs.map((log, index) => (
              <TimelineItem
                key={log.id || index}
                status={log.status}
                time={new Date(log.timestamp).toLocaleString()}
                responseTime={log.responseTime}
                message={log.rootCause
                  ? `${log.rootCause} — ${log.responseTime}ms`
                  : (log.status === 'UP'
                    ? `Check passed — ${log.responseTime}ms response time`
                    : `Service unreachable — check failed`)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Comment Section */}
      <div ref={commentRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle size={18} className="text-emerald-500" />
          <h3 className="text-base sm:text-lg font-black text-slate-900">Incident Comments</h3>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 ml-auto">{comments.length} comments</span>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={14} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment about this incident..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-slate-400"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-slate-100 rounded-full flex items-center justify-center">
                  <User size={14} className="text-slate-500" />
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{comment.userName || 'User'}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineItem = ({ status, time, message }) => {
  const isUp = status === 'UP';
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isUp ? 'bg-emerald-100' : 'bg-red-100'}`}>
          {isUp
            ? <CheckCircle2 size={14} className="text-emerald-600" />
            : <AlertCircle size={14} className="text-red-600" />
          }
        </div>
        <div className="w-0.5 h-full bg-slate-100 mt-1"></div>
      </div>
      <div className="pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {status}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400">{time}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default IncidentDetails;