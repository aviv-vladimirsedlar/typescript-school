import axios from 'axios';

import { logoutSuccess } from './slices/auth.slice';
import store from './store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:19200/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response, // Forward successful responses directly
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch the logout action
      store.dispatch(logoutSuccess());
    }
    return Promise.reject(error); // Forward the error to handle in your components
  },
);

export default axiosInstance;
