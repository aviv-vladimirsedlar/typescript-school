import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:19200/api',
});

export default apiClient;
