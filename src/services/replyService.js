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
 * Create a new reply to a comment
 * @param {Object} replyData - The reply data (commentId, writer, content)
 * @returns {Promise<Object>} - The created reply
 */
export const createReply = async (replyData) => {
  try {
    const response = await apiClient.post('/replies', replyData);
    return response.data;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

/**
 * Get all replies for a specific comment
 * @param {number} commentId - The ID of the comment
 * @returns {Promise<Array>} - Array of replies
 */
export const getRepliesByCommentId = async (commentId) => {
  try {
    const response = await apiClient.get(`/replies/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching replies for comment ${commentId}:`, error);
    throw error;
  }
};

/**
 * Get a specific reply by ID
 * @param {number} replyId - The ID of the reply
 * @returns {Promise<Object>} - The reply
 */
export const getReplyById = async (replyId) => {
  try {
    const response = await apiClient.get(`/replies/${replyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reply ${replyId}:`, error);
    throw error;
  }
};

/**
 * Update a reply
 * @param {number} replyId - The ID of the reply to update
 * @param {Object} replyData - The updated reply data
 * @returns {Promise<Object>} - The updated reply
 */
export const updateReply = async (replyId, replyData) => {
  try {
    const response = await apiClient.put(`/replies/${replyId}`, replyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating reply ${replyId}:`, error);
    throw error;
  }
};

/**
 * Delete a reply
 * @param {number} replyId - The ID of the reply to delete
 * @returns {Promise<Object>} - Response from the server
 */
export const deleteReply = async (replyId) => {
  try {
    const response = await apiClient.delete(`/replies/${replyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reply ${replyId}:`, error);
    throw error;
  }
};
