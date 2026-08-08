import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cybershield_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 status and auto-logout invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cybershield_jwt_token');
      localStorage.removeItem('cybershield_user');
    }
    return Promise.reject(error);
  }
);

// Auth API Calls
export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  const response = await api.post('/auth/login', formData);
  if (response.data.access_token) {
    localStorage.setItem('cybershield_jwt_token', response.data.access_token);
    localStorage.setItem('cybershield_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const registerUser = async (email, password, fullName) => {
  const response = await api.post('/auth/register', { email, password, full_name: fullName });
  if (response.data.access_token) {
    localStorage.setItem('cybershield_jwt_token', response.data.access_token);
    localStorage.setItem('cybershield_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('cybershield_jwt_token');
  localStorage.removeItem('cybershield_user');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// URL Scanning Calls
export const scanURL = async (url) => {
  const response = await api.post('/scan', { url });
  return response.data;
};

export const scanBatchURLs = async (urls) => {
  const response = await api.post('/scan/batch', { urls });
  return response.data;
};

// SOC Dashboard & Stats Calls
export const getDashboardStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getModelBenchmarks = async () => {
  const response = await api.get('/stats/models');
  return response.data;
};

export const getScanHistory = async (statusFilter = null, limit = 50, offset = 0) => {
  let url = `/history?limit=${limit}&offset=${offset}`;
  if (statusFilter) {
    url += `&status_filter=${statusFilter}`;
  }
  const response = await api.get(url);
  return response.data;
};

// Report Generation Calls
export const getPDFReportURL = (scanId) => {
  return `${API_BASE_URL}/report/pdf/${scanId}`;
};

export const downloadDirectPDFReport = async (url) => {
  const response = await api.post('/report/pdf/direct', { url }, { responseType: 'blob' });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `CyberShield_Security_Audit_Report.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getCSVExportURL = () => {
  return `${API_BASE_URL}/report/csv`;
};

// Threat Intel & Admin Console Calls
export const getThreatIntelFeed = async () => {
  const response = await api.get('/threat-intel');
  return response.data;
};

export const addThreatIntelDomain = async (domain, threatType = "Phishing") => {
  const response = await api.post('/threat-intel/add', { domain, threat_type: threatType });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (userId, newRole) => {
  const response = await api.put(`/admin/users/${userId}/role?new_role=${newRole}`);
  return response.data;
};

export const clearAllLogs = async () => {
  const response = await api.delete('/admin/clear-logs');
  return response.data;
};

// Protection Ecosystem API Calls (v4.0)
export const getProtectionDevices = async () => {
  const response = await api.get('/protection/devices');
  return response.data;
};

export const revokeDevice = async (deviceId) => {
  const response = await api.delete(`/protection/device/${deviceId}`);
  return response.data;
};
