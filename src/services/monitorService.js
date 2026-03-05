// Use the URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/monitoring';

// Helper: get the token from local storage
const getToken = () => localStorage.getItem('jwt_token');

// Helper: get the user's email from local storage
const getUserEmail = () => localStorage.getItem('user_email') || '';

// Helper to append Auth headers
const authHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getMonitors = async () => {
  const response = await fetch(`${API_BASE_URL}/all`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch monitors');
  return response.json();
};

export const getMonitorById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch monitor');
  return response.json();
};

export const getMonitorLogs = async (id, hours = 24) => {
  const response = await fetch(`${API_BASE_URL}/${id}/logs?hours=${hours}`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch logs');
  return response.json();
};

export const getBusinessStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

export const createMonitor = async (monitorData) => {
  const dataWithEmail = {
    ...monitorData,
    ownerEmail: getUserEmail()
  };

  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(dataWithEmail)
  });
  if (!response.ok) throw new Error('Failed to create monitor');
  return response.json();
};

export const deleteMonitor = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete monitor');
  return response.text();
};

export const addMonitor = createMonitor;

// ─── Send welcome email on first login ───
export const sendWelcomeEmail = async ({ email, name }) => {
  const response = await fetch(`${API_BASE_URL}/welcome`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ email, name })
  });
  if (!response.ok) throw new Error('Failed to send welcome email');
  return response.text();
};

// ─── Incident comments ───
export const getComments = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}/comments`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
};

export const addComment = async (id, message) => {
  const response = await fetch(`${API_BASE_URL}/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ message })
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};