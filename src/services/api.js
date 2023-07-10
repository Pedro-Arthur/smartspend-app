import axios from 'axios';
import { API_BASE_URL } from '@env';

const baseURL = API_BASE_URL;

const api = axios.create({
  baseURL,
});

export default api;
