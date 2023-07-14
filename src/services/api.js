import { useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { AuthContext } from '../contexts/AuthContext';

const baseURL = API_BASE_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
      const { removeAuthIsLoggedIn } = useContext(AuthContext);
      await Promise.all([removeAuthIsLoggedIn()]);
    }

    throw error;
  }
);

export default api;
