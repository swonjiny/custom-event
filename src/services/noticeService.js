import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all notices
export const getNotices = async () => {
  try {
    const response = await apiClient.get('/notices');
    return response.data;
  } catch (error) {
    console.error('Error fetching notices:', error);
    throw error;
  }
};

// Get a single notice by ID
export const getNoticeById = async (id) => {
  try {
    const response = await apiClient.get(`/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notice with ID ${id}:`, error);
    throw error;
  }
};

// Create a new notice
export const createNotice = async (noticeData) => {
  try {
    const response = await apiClient.post('/notices', noticeData);
    return response.data;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
};

// Update an existing notice
export const updateNotice = async (id, noticeData) => {
  try {
    const response = await apiClient.put(`/notices/${id}`, noticeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating notice with ID ${id}:`, error);
    throw error;
  }
};

// Delete a notice
export const deleteNotice = async (id) => {
  try {
    const response = await apiClient.delete(`/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting notice with ID ${id}:`, error);
    throw error;
  }
};
