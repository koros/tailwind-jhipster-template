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

    // If 401 and not already retrying and not the refresh endpoint itself
    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
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

      if (!refreshToken) {
        isRefreshing = false;
        onUnauthenticated();
        return Promise.reject(err);
      }

      try {
        const response = await axios.post('/api/refresh-token', { refresh_token: refreshToken });
        const { id_token } = response.data;

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
