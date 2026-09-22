// API Base URL matches monitorService
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/monitoring';

// Helper: get the token from local storage
const getToken = () => localStorage.getItem('jwt_token');

// Helper to append Auth headers
const authHeaders = () => {
  const token = getToken();
  return token
    ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      };
};

/**
 * Fetch current user's subscription details, quota, and monitor usage
 */
export const getSubscription = async () => {
  const response = await fetch(`${API_BASE_URL}/payment/subscription`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch subscription details');
  }
  return response.json();
};

/**
 * Create a Stripe or Sandbox Checkout Session
 */
export const createCheckoutSession = async ({ tier, billingCycle, successUrl, cancelUrl }) => {
  const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      tier,
      billingCycle: billingCycle || 'MONTHLY',
      successUrl,
      cancelUrl,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to initiate checkout session');
  }
  return response.json();
};

/**
 * Confirm checkout session callback / upgrade
 */
export const confirmCheckout = async ({ tier, billingCycle, sessionId }) => {
  const response = await fetch(`${API_BASE_URL}/payment/confirm`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      tier,
      billingCycle,
      sessionId,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to confirm subscription');
  }
  return response.json();
};

/**
 * Fetch transaction / invoice history
 */
export const getPaymentHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/payment/history`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch payment history');
  }
  return response.json();
};

/**
 * Cancel the current subscription
 */
export const cancelSubscription = async () => {
  const response = await fetch(`${API_BASE_URL}/payment/cancel`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to cancel subscription');
  }
  return response.json();
};

/**
 * Sandbox Simulation: Instantly simulate plan upgrade/downgrade for testing
 */
export const simulatePlanUpgrade = async (tier, billingCycle = 'MONTHLY') => {
  const response = await fetch(`${API_BASE_URL}/payment/simulate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      tier,
      billingCycle,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to simulate plan upgrade');
  }
  return response.json();
};
