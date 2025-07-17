import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get boards with pagination
export const getBoards = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get(`/boards?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};

// Get a single board by ID
export const getBoardById = async (id) => {
  try {
    const response = await apiClient.get(`/boards/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching board with ID ${id}:`, error);
    throw error;
  }
};

// Create a new board
export const createBoard = async (boardData, files) => {
  try {
    // If no files are provided, use the standard JSON request
    if (!files || files.length === 0) {
      const response = await apiClient.post('/boards', boardData);
      return response.data;
    }

    // Create a FormData object for multipart/form-data
    const formData = new FormData();

    // Add the board data as a JSON string wrapped in a Blob
    formData.append('board', new Blob([JSON.stringify(boardData)], {
      type: 'application/json'
    }));

    // Add files if provided
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // Send the request with FormData
    // Use a custom axios instance for this request to avoid Content-Type issues
    const response = await axios.post(`${API_URL}/boards`, formData, {
      headers: {
        // Don't set Content-Type explicitly, let the browser set it with the boundary
        // This is important for multipart/form-data requests
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

// Update an existing board
export const updateBoard = async (id, boardData, files) => {
  try {
    // Create a FormData object for multipart/form-data
    const formData = new FormData();

    // Add the board data as a JSON string
    formData.append('board', new Blob([JSON.stringify(boardData)], {
      type: 'application/json'
    }));

    // Add files if provided
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    // Send the request with FormData
    // Use a custom axios instance for this request to avoid Content-Type issues
    const response = await axios.put(`${API_URL}/boards/${id}`, formData, {
      headers: {
        // Don't set Content-Type explicitly, let the browser set it with the boundary
        // This is important for multipart/form-data requests
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating board with ID ${id}:`, error);
    throw error;
  }
};

// Delete a board
export const deleteBoard = async (id) => {
  try {
    const response = await apiClient.delete(`/boards/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting board with ID ${id}:`, error);
    throw error;
  }
};
