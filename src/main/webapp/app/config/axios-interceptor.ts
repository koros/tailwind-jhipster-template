import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { Storage } from 'react-jhipster';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const setupAxiosInterceptors = onUnauthenticated => {
  const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = response => response;

  const onResponseError = async (err: AxiosError) => {
    const status = err.status || (err.response ? err.response.status : 0);
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Debug logging
    if ((status === 401 || status === 403) && process.env.NODE_ENV === 'development') {
      console.warn(`[Auth Interceptor] ${status} detected:`, {
        url: originalRequest?.url,
        isRetry: originalRequest?._retry,
        isRefreshEndpoint: originalRequest?.url?.includes('/refresh-token'),
        errorMessage: (err.response?.data as any)?.message,
      });
    }

    // Check if error is due to invalid/expired token (401 or 403 with token error message)
    const isTokenError = status === 401 || (status === 403 && (err.response?.data as any)?.message?.toLowerCase().includes('token'));

    // If token error and not already retrying and not the refresh endpoint itself
    if (isTokenError && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axios(originalRequest);
          })
          .catch(queueError => {
            return Promise.reject(new Error(queueError?.message || 'Queue processing failed'));
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Storage.local.get('jhi-refreshToken') || Storage.session.get('jhi-refreshToken');

      if (process.env.NODE_ENV === 'development') {
        console.warn('[Auth Interceptor] Attempting token refresh:', {
          hasRefreshToken: !!refreshToken,
          isRefreshing,
        });
      }

      if (!refreshToken) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Auth Interceptor] No refresh token found, redirecting to login');
        }
        isRefreshing = false;
        onUnauthenticated();
        return Promise.reject(err);
      }

      try {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Auth Interceptor] Calling /api/refresh-token');
        }
        const response = await axios.post('/api/refresh-token', { refresh_token: refreshToken });
        const { id_token } = response.data;

        if (process.env.NODE_ENV === 'development') {
          console.warn('[Auth Interceptor] Token refresh successful');
        }

        // Store new access token
        const storage = Storage.local.get('jhi-refreshToken') ? Storage.local : Storage.session;
        storage.set('jhi-authenticationToken', id_token);

        // Update axios default header
        axios.defaults.headers.common.Authorization = `Bearer ${id_token}`;

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${id_token}`;
        }

        processQueue();
        isRefreshing = false;

        // Retry original request
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('[Auth Interceptor] Token refresh failed:', refreshError);
        processQueue(refreshError);
        isRefreshing = false;

        // Clear tokens and redirect to login
        Storage.local.remove('jhi-authenticationToken');
        Storage.local.remove('jhi-refreshToken');
        Storage.session.remove('jhi-authenticationToken');
        Storage.session.remove('jhi-refreshToken');

        onUnauthenticated();
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'));
      }
    } // For other errors or if refresh fails
    if (status === 401) {
      onUnauthenticated();
    }

    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
