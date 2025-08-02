import axios from 'axios';

interface RefreshResponse { accessToken: string; }

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: false
});

// Attach access token automatically
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    if (cfg.headers) {
      cfg.headers = {
        ...cfg.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      cfg.headers = { Authorization: `Bearer ${token}` } as Record<string, string>;
    }
  }
  return cfg;
});

// Attempt silent refresh
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post<RefreshResponse>('http://localhost:5000/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch (e) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
