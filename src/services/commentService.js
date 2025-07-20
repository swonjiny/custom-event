import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new comment
 * @param {Object} commentData - The comment data (boardId, writer, content)
 * @returns {Promise<Object>} - The created comment
 */
export const createComment = async (commentData) => {
  try {
    const response = await apiClient.post('/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

/**
 * Get all comments for a specific board
 * @param {number} boardId - The ID of the board
 * @returns {Promise<Array>} - Array of comments
 */
export const getCommentsByBoardId = async (boardId) => {
  try {
    const response = await apiClient.get(`/comments/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for board ${boardId}:`, error);
    throw error;
  }
};

/**
 * Get a specific comment by ID
 * @param {number} commentId - The ID of the comment
 * @returns {Promise<Object>} - The comment
 */
export const getCommentById = async (commentId) => {
  try {
    const response = await apiClient.get(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comment ${commentId}:`, error);
    throw error;
  }
};

/**
 * Update a comment
 * @param {number} commentId - The ID of the comment to update
 * @param {Object} commentData - The updated comment data
 * @returns {Promise<Object>} - The updated comment
 */
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await apiClient.put(`/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    throw error;
  }
};

/**
 * Delete a comment
 * @param {number} commentId - The ID of the comment to delete
 * @returns {Promise<Object>} - Response from the server
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};
