/**
 * @deprecated This service is deprecated. Use commentService.js instead.
 *
 * The functionality in this file has been consolidated into commentService.js
 * to support multi-level nested comments. Instead of having separate endpoints
 * for comments and replies, we now use a single set of endpoints for comments
 * at any level of nesting.
 *
 * Please use the following functions from commentService.js:
 * - createComment: For creating top-level comments
 * - createNestedComment: For creating nested comments (replies)
 * - getNestedCommentsByBoardId: For retrieving comments in a hierarchical structure
 * - updateComment: For updating any comment
 * - deleteComment: For deleting any comment
 */

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
 * @deprecated Use createNestedComment from commentService.js instead
 * Create a new reply to a comment
 * @param {Object} replyData - The reply data (commentId, writer, content)
 * @returns {Promise<Object>} - The created reply
 */
export const createReply = async (replyData) => {
  console.warn('replyService.js is deprecated. Use commentService.js instead.');
  try {
    const response = await apiClient.post('/replies', replyData);
    return response.data;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

/**
 * @deprecated Use getNestedCommentsByBoardId from commentService.js instead
 * Get all replies for a specific comment
 * @param {number} commentId - The ID of the comment
 * @returns {Promise<Array>} - Array of replies
 */
export const getRepliesByCommentId = async (commentId) => {
  console.warn('replyService.js is deprecated. Use commentService.js instead.');
  try {
    const response = await apiClient.get(`/replies/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching replies for comment ${commentId}:`, error);
    throw error;
  }
};

/**
 * @deprecated Use getCommentById from commentService.js instead
 * Get a specific reply by ID
 * @param {number} replyId - The ID of the reply
 * @returns {Promise<Object>} - The reply
 */
export const getReplyById = async (replyId) => {
  console.warn('replyService.js is deprecated. Use commentService.js instead.');
  try {
    const response = await apiClient.get(`/replies/${replyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reply ${replyId}:`, error);
    throw error;
  }
};

/**
 * @deprecated Use updateComment from commentService.js instead
 * Update a reply
 * @param {number} replyId - The ID of the reply to update
 * @param {Object} replyData - The updated reply data
 * @returns {Promise<Object>} - The updated reply
 */
export const updateReply = async (replyId, replyData) => {
  console.warn('replyService.js is deprecated. Use commentService.js instead.');
  try {
    const response = await apiClient.put(`/replies/${replyId}`, replyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating reply ${replyId}:`, error);
    throw error;
  }
};

/**
 * @deprecated Use deleteComment from commentService.js instead
 * Delete a reply
 * @param {number} replyId - The ID of the reply to delete
 * @returns {Promise<Object>} - Response from the server
 */
export const deleteReply = async (replyId) => {
  console.warn('replyService.js is deprecated. Use commentService.js instead.');
  try {
    const response = await apiClient.delete(`/replies/${replyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reply ${replyId}:`, error);
    throw error;
  }
};
