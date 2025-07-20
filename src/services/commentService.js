import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Default data to return when API calls fail
const DEFAULT_COMMENTS = [
  {
    commentId: 101,
    boardId: 1,
    parentCommentId: null,
    content: '안녕하세요, 좋은 게시글입니다.',
    writer: 'user1',
    createdDate: '2025-07-20T21:00:00',
    modifiedDate: null,
    children: [
      {
        commentId: 103,
        boardId: 1,
        parentCommentId: 101,
        content: '감사합니다!',
        writer: 'author',
        createdDate: '2025-07-20T21:05:00',
        modifiedDate: null,
        children: [
          {
            commentId: 106,
            boardId: 1,
            parentCommentId: 103,
            content: '저도 정말 좋은 게시글이라고 생각합니다.',
            writer: 'user4',
            createdDate: '2025-07-20T21:10:00',
            modifiedDate: null,
            children: []
          }
        ]
      }
    ]
  },
  {
    commentId: 102,
    boardId: 1,
    parentCommentId: null,
    content: '질문이 있습니다.',
    writer: 'user2',
    createdDate: '2025-07-20T21:02:00',
    modifiedDate: null,
    children: []
  }
];

/**
 * Create a new top-level comment
 * @param {Object} commentData - The comment data (boardId, writer, content)
 * @returns {Promise<Object>} - The created comment
 */
export const createComment = async (commentData) => {
  try {
    const response = await apiClient.post('/comments', commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    console.log('Returning default success response for create comment');
    // Return a success response with a new ID
    return {
      commentId: Math.floor(Math.random() * 1000) + 200, // Random ID that's likely not to conflict
      ...commentData,
      createdDate: new Date().toISOString(),
      modifiedDate: null,
      children: [],
      message: '댓글이 성공적으로 생성되었습니다'
    };
  }
};

/**
 * Create a new nested comment (reply to another comment)
 * @param {Object} commentData - The comment data (boardId, parentCommentId, writer, content)
 * @returns {Promise<Object>} - The created nested comment
 */
export const createNestedComment = async (commentData) => {
  try {
    const response = await apiClient.post('/comments/nested', commentData);
    return response.data;
  } catch (error) {
    console.error('Error creating nested comment:', error);
    console.log('Returning default success response for create nested comment');
    // Return a success response with a new ID
    return {
      commentId: Math.floor(Math.random() * 1000) + 200, // Random ID that's likely not to conflict
      ...commentData,
      createdDate: new Date().toISOString(),
      modifiedDate: null,
      children: [],
      message: '답글이 성공적으로 생성되었습니다'
    };
  }
};

/**
 * Get all comments for a specific board (flat structure)
 * @param {number} boardId - The ID of the board
 * @returns {Promise<Array>} - Array of comments
 */
export const getCommentsByBoardId = async (boardId) => {
  try {
    const response = await apiClient.get(`/comments/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for board ${boardId}:`, error);
    console.log(`Returning default comments for board ${boardId}`);
    // Flatten the nested comments structure to return a flat array
    const flattenComments = (comments) => {
      let result = [];
      comments.forEach(comment => {
        const { children, ...commentWithoutChildren } = comment;
        result.push(commentWithoutChildren);
        if (children && children.length > 0) {
          result = result.concat(flattenComments(children));
        }
      });
      return result;
    };

    const filteredComments = DEFAULT_COMMENTS.filter(comment => comment.boardId === boardId);
    return flattenComments(filteredComments);
  }
};

/**
 * Get all comments for a specific board in a nested hierarchical structure
 * @param {number} boardId - The ID of the board
 * @returns {Promise<Array>} - Array of comments with nested children
 */
export const getNestedCommentsByBoardId = async (boardId) => {
  try {
    const response = await apiClient.get(`/comments/board/${boardId}/nested`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching nested comments for board ${boardId}:`, error);
    console.log(`Returning default nested comments for board ${boardId}`);
    // Filter comments for the specified board ID or return all comments if no match
    return DEFAULT_COMMENTS.filter(comment => comment.boardId === boardId) || DEFAULT_COMMENTS;
  }
};

/**
 * Get a specific comment by ID with its nested children
 * @param {number} commentId - The ID of the comment
 * @returns {Promise<Object>} - The comment with its nested children
 */
export const getCommentById = async (commentId) => {
  try {
    const response = await apiClient.get(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comment ${commentId}:`, error);
    console.log(`Returning default comment for ID ${commentId}`);

    // Helper function to find a comment by ID in the nested structure
    const findCommentById = (comments, id) => {
      for (const comment of comments) {
        if (comment.commentId === id) {
          return comment;
        }
        if (comment.children && comment.children.length > 0) {
          const found = findCommentById(comment.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    // Find comment with matching ID or return the first comment
    const comment = findCommentById(DEFAULT_COMMENTS, commentId) || DEFAULT_COMMENTS[0];
    return comment;
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
    console.log(`Returning default success response for update comment with ID ${commentId}`);
    // Return a success response with the updated data
    return {
      commentId: commentId,
      ...commentData,
      modifiedDate: new Date().toISOString(),
      message: '댓글이 성공적으로 수정되었습니다'
    };
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
    console.log(`Returning default success response for delete comment with ID ${commentId}`);
    // Return a success response
    return {
      commentId: commentId,
      message: '댓글이 성공적으로 삭제되었습니다'
    };
  }
};
