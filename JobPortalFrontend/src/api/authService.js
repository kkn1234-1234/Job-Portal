import api from './api';

const authService = {
  login: async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    persistAuth(response.data);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    persistAuth(response.data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/account/me');
    persistUser(response.data);
    return response.data;
  },

  updateApplicantProfile: async (profileData) => {
    const response = await api.put('/account/applicant', profileData);
    persistUser(response.data);
    return response.data;
  },

  updateEmployerProfile: async (profileData) => {
    const response = await api.put('/account/employer', profileData);
    persistUser(response.data);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/account/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  validateToken: async () => {
    const response = await api.get('/account/validate');
    if (response.data?.user) {
      persistUser(response.data.user);
    }
    return response.data;
  },

  forgotPassword: async (email, role) => {
    const response = await api.post('/account/forgot-password', { email, role });
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await api.post('/account/reset-password', payload);
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isLoggedIn: () => Boolean(localStorage.getItem('token')),
};

function persistAuth(data) {
  if (!data?.token) return;
  localStorage.setItem('token', data.token);
  persistUser(data.user);
}

function persistUser(user) {
  if (!user) return;
  localStorage.setItem('user', JSON.stringify(user));
}

export default authService;
