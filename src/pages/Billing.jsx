import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard, Check, Sparkles, Shield, Zap, AlertTriangle,
  ArrowRight, CheckCircle2, XCircle, Clock, FileText,
  RefreshCw, ChevronRight, Activity, ExternalLink
} from 'lucide-react';
import {
  getSubscription,
  createCheckoutSession,
  confirmCheckout,
  getPaymentHistory,
  cancelSubscription,
  simulatePlanUpgrade
} from '../services/paymentService';

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    desc: 'Perfect for personal projects and small apps.',
    monthlyPrice: 0,
    annualPrice: 0,
    monitors: 3,
    interval: '5-minute',
    features: [
      'Up to 3 monitors',
      '5-minute check interval',
      'Email alerts',
      'Basic dashboard',
      'Community support'
    ]
  },
  {
    id: 'PRO',
    name: 'Professional',
    desc: 'For growing teams that need deeper insights and high frequency.',
    monthlyPrice: 19,
    annualPrice: 190,
    monitors: 25,
    interval: '10-second',
    popular: true,
    features: [
      'Up to 25 monitors',
      '10-second check interval',
      'Email + Slack alerts',
      'Full dashboard & analytics',
      'Business intelligence',
      'Monthly reports'
    ]
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    desc: 'For mission-critical infrastructure with zero compromise.',
    monthlyPrice: 79,
    annualPrice: 790,
    monitors: 1000,
    interval: '5-second',
    features: [
      'Unlimited monitors (1,000)',
      '5-second check interval',
      'All alert channels',
      'Advanced BI dashboard',
      'Custom integrations',
      'White-label reports',
      'Dedicated 24/7 support'
    ]
  }
];

const Billing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [annual, setAnnual] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sandboxOpen, setSandboxOpen] = useState(false);

  // Load subscription details and history
  const loadData = async () => {
    try {
      setLoading(true);
      const [subData, historyData] = await Promise.all([
        getSubscription().catch(err => {
          console.error("Subscription fetch error:", err);
          return null;
        }),
        getPaymentHistory().catch(err => {
          console.error("History fetch error:", err);
          return [];
        })
      ]);

      if (subData) {
        setSubscription(subData);
        setAnnual(subData.billingCycle === 'ANNUAL');
      }
      setHistory(historyData || []);
    } catch (err) {
      console.error("Failed to load billing details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle URL callback parameters (from Stripe or Sandbox redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const canceled = params.get('canceled');
    const tier = params.get('tier');
    const cycle = params.get('cycle');
    const sessionId = params.get('session_id');

    if (success && tier) {
      confirmCheckout({
        tier,
        billingCycle: cycle || 'MONTHLY',
        sessionId: sessionId || 'sim_checkout'
      })
        .then(() => {
          setNotification({
            type: 'success',
            message: `🎉 Success! Your subscription has been upgraded to the ${tier === 'PRO' ? 'Professional' : tier} plan.`
          });
          // Clean URL params
          navigate('/billing', { replace: true });
          loadData();
        })
        .catch(err => {
          console.error("Failed to confirm checkout:", err);
          setNotification({
            type: 'error',
            message: `Failed to confirm subscription upgrade: ${err.message}`
          });
        });
    } else if (canceled) {
      setNotification({
        type: 'info',
        message: 'Checkout was cancelled. No charges were made.'
      });
      navigate('/billing', { replace: true });
    } else {
      loadData();
    }
  }, [location.search]);

  // Handle initiating checkout
  const handleUpgrade = async (targetTier) => {
    if (targetTier === subscription?.tier) return;

    if (targetTier === 'STARTER') {
      setShowCancelModal(true);
      return;
    }

    try {
      setActionLoading(true);
      const cycle = annual ? 'ANNUAL' : 'MONTHLY';
      const result = await createCheckoutSession({
        tier: targetTier,
        billingCycle: cycle,
        successUrl: `${window.location.origin}/billing?success=true&tier=${targetTier}&cycle=${cycle}`,
        cancelUrl: `${window.location.origin}/billing?canceled=true`
      });

      if (result.checkoutUrl) {
        // If Stripe or simulated redirect
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      console.error("Checkout initiation error:", err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to initiate checkout session.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    try {
      setActionLoading(true);
      await cancelSubscription();
      setShowCancelModal(false);
      setNotification({
        type: 'info',
        message: 'Your subscription has been cancelled and downgraded to the Starter plan.'
      });
      await loadData();
    } catch (err) {
      console.error("Cancellation error:", err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to cancel subscription.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Dev Simulation
  const handleSimulate = async (tier) => {
    try {
      setActionLoading(true);
      const cycle = annual ? 'ANNUAL' : 'MONTHLY';
      await simulatePlanUpgrade(tier, cycle);
      setNotification({
        type: 'success',
        message: `[Sandbox] Instantly applied ${tier} (${cycle}) upgrade!`
      });
      await loadData();
    } catch (err) {
      console.error("Simulation error:", err);
      setNotification({
        type: 'error',
        message: err.message || 'Simulation failed.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate usage percentage
  const monitorUsageCount = subscription?.activeMonitorsCount || 0;
  const maxMonitors = subscription?.maxMonitors || 3;
  const usagePercentage = Math.min(100, Math.round((monitorUsageCount / maxMonitors) * 100));
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = monitorUsageCount >= maxMonitors;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1 text-sm tracking-wider uppercase">
            <CreditCard size={16} /> Plan & Invoicing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Billing & Subscriptions
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Manage your Sentinel subscription, monitor allowances, and view payment history.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Status
        </button>
      </div>

      {/* Notifications Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border text-sm font-medium transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : notification.type === 'error' ? (
            <XCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={20} className="text-blue-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{notification.message}</div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Cards: Active Subscription + Quota Meter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Plan Overview Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Current Subscription
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                {subscription?.tierDisplayName || 'Starter'} Plan
              </h2>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                  subscription?.status === 'ACTIVE'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {subscription?.status || 'ACTIVE'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {subscription?.billingCycle === 'ANNUAL' ? 'Billed Annually' : 'Billed Monthly'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-700/60 pt-6 mb-6">
            <div>
              <p className="text-xs text-slate-400 font-medium">Check Interval</p>
              <p className="text-lg font-bold text-white mt-0.5">
                {subscription?.minIntervalSeconds >= 60
                  ? `${subscription.minIntervalSeconds / 60}-minute`
                  : `${subscription?.minIntervalSeconds || 300}s`}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Included Monitors</p>
              <p className="text-lg font-bold text-white mt-0.5">
                {subscription?.maxMonitors >= 1000 ? 'Unlimited' : `${subscription?.maxMonitors || 3} nodes`}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Billing Period Ends</p>
              <p className="text-lg font-bold text-white mt-0.5">
                {subscription?.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                  : 'Always Active'}
              </p>
            </div>
          </div>

          {subscription?.isPaidPlan && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors font-medium underline underline-offset-4"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        {/* Quota & Usage Meter Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Monitor Quota
              </h3>
              <Activity size={18} className="text-emerald-500" />
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-slate-900">
                {monitorUsageCount}
              </span>
              <span className="text-slate-400 font-bold text-base">
                / {maxMonitors >= 1000 ? '∞' : maxMonitors} Active
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3 mb-2">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isAtLimit
                    ? 'bg-rose-500'
                    : isNearLimit
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${maxMonitors >= 1000 ? 5 : usagePercentage}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {isAtLimit ? (
                <span className="text-rose-600 font-bold">
                  ⚠️ Limit reached. Upgrade to add more endpoints.
                </span>
              ) : isNearLimit ? (
                <span className="text-amber-600 font-bold">
                  Almost at full capacity ({usagePercentage}% used).
                </span>
              ) : (
                <span>{usagePercentage}% of plan allowance used.</span>
              )}
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('plans-selection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full mt-6 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Explore Plans <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Plan Selection Section */}
      <div id="plans-selection" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Available Plans</h2>
            <p className="text-slate-500 text-sm">
              Upgrade instantly with automated billing via Stripe.
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm self-start sm:self-auto">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !annual
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                annual
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = subscription?.tier === plan.id;
            const price = annual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 transition-all flex flex-col justify-between ${
                  plan.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shadow-2xl border-2 border-emerald-500/40 md:-translate-y-2'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    ⭐ Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 px-2.5 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mb-6 ${
                      plan.popular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {plan.desc}
                  </p>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-black tracking-tight">${price}</span>
                    <span
                      className={`text-xs font-bold ml-1.5 ${
                        plan.popular ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {annual ? '/year' : '/month'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs font-medium">
                        <Check
                          size={14}
                          className={plan.popular ? 'text-emerald-400' : 'text-emerald-600'}
                        />
                        <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || actionLoading}
                    className={`w-full py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                      isCurrent
                        ? 'bg-slate-200 text-slate-500 cursor-default'
                        : plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 hover:scale-[1.02]'
                        : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.02]'
                    }`}
                  >
                    {isCurrent
                      ? 'Current Plan'
                      : plan.id === 'STARTER'
                      ? 'Downgrade to Starter'
                      : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment & Invoice History Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Payment & Invoice History</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review all past payments, billing cycles, and invoice receipts.
            </p>
          </div>
          <FileText size={20} className="text-slate-400" />
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No payment records yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              When you upgrade to a paid tier or complete a billing cycle, invoices and receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {tx.description || `${tx.planTier} Plan`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      {tx.billingCycle}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ${tx.amount?.toFixed(2)} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check size={12} /> {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.receiptUrl ? (
                        <a
                          href={tx.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-xs"
                        >
                          View Receipt <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">Generated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Developer Sandbox Simulation Controls */}
      <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => setSandboxOpen(!sandboxOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-700 hover:bg-slate-50 text-sm transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            <span>Developer Sandbox & Test Controls</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-md">
              Dev & QA
            </span>
          </div>
          <span className="text-xs text-slate-400">{sandboxOpen ? 'Hide' : 'Show'}</span>
        </button>

        {sandboxOpen && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/60 space-y-4 text-xs">
            <p className="text-slate-500">
              These controls let you test instant upgrades, downgrades, and limit adjustments in the sandbox without entering credit card details.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSimulate('PRO')}
                disabled={actionLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
              >
                Simulate Upgrade to Pro ($19)
              </button>
              <button
                onClick={() => handleSimulate('ENTERPRISE')}
                disabled={actionLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm"
              >
                Simulate Upgrade to Enterprise ($79)
              </button>
              <button
                onClick={() => handleSimulate('STARTER')}
                disabled={actionLoading}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl shadow-sm"
              >
                Reset to Free Starter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Downgrade to Starter Plan?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Are you sure you want to cancel your paid subscription? Your account will immediately revert to the free Starter tier with a 3-monitor quota and 5-minute check intervals.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
              >
                Keep My Plan
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={actionLoading}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-600/20"
              >
                {actionLoading ? 'Cancelling...' : 'Confirm Downgrade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
