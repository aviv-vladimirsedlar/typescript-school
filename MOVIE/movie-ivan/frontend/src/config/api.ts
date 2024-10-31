import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:19200/api',
  withCredentials: true,
});

export default axiosInstance;
