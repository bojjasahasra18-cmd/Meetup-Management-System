import axios from 'axios';

const API = axios.create({
  baseURL: 'https://meetup-management-system-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const getMeetups = async () => {
  const response = await API.get('/meetups');
  return response.data;
};

export const getMeetupById = async (id) => {
  const response = await API.get(`/meetups/${id}`);
  return response.data;
};

export const createMeetup = async (meetupData) => {
  const response = await API.post('/meetups', meetupData);
  return response.data;
};

export const updateMeetup = async (id, meetupData) => {
  const response = await API.put(`/meetups/${id}`, meetupData);
  return response.data;
};

export const deleteMeetup = async (id) => {
  const response = await API.delete(`/meetups/${id}`);
  return response.data;
};

export const registerForMeetup = async (id, registrationData) => {
  const response = await API.post(`/meetups/${id}/register`, registrationData);
  return response.data;
};

export const checkInAttendee = async (id) => {
  const response = await API.post(`/meetups/${id}/checkin`);
  return response.data;
};

export const getMeetupAttendees = async (id) => {
  const response = await API.get(`/meetups/${id}/attendees`);
  return response.data;
};

export const getMeetupAnalytics = async (id) => {
  const response = await API.get(`/meetups/${id}/analytics`);
  return response.data;
};

export const getMeetupHistory = async () => {
  const response = await API.get('/history');
  return response.data;
};

export const getHistory = async () => {
  const response = await API.get('/history');
  return response.data;
};

export const exportMeetupCSV = async (id) => {
  const response = await API.get(`/meetups/${id}/export`, {
    responseType: "blob",
  });
  return response.data;
};

export default API;
