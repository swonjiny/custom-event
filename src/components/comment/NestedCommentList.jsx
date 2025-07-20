import React from 'react';
import { Typography, Divider, Empty, Spin, Button } from 'antd';
import NestedCommentItem from './NestedCommentItem';
import CommentForm from './CommentForm';

const { Title } = Typography;

/**
 * NestedCommentList component for displaying a hierarchical list of comments
 *
 * @param {Object} props - Component props
 * @param {Array} props.comments - Array of comments with nested children
 * @param {number} props.boardId - ID of the board the comments belong to
 * @param {Function} props.onAddComment - Function to call when a new comment is submitted
 * @param {Function} props.onEditComment - Function to call when a comment edit is submitted
 * @param {Function} props.onDeleteComment - Function to call when a comment delete is confirmed
 * @param {Function} props.onAddNestedComment - Function to call when a nested comment is submitted
 * @param {boolean} props.loading - Whether the component is in a loading state
 */
const NestedCommentList = ({
  comments = [],
  boardId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onAddNestedComment,
  loading = false
}) => {
  const handleAddComment = async (commentData) => {
    await onAddComment(commentData);
  };

  const handleEditComment = async (commentId, commentData) => {
    await onEditComment(commentId, commentData);
  };

  const handleAddNestedComment = async (commentData) => {
    await onAddNestedComment(commentData);
  };

  return (
    <div className="nested-comment-section">
      <Divider orientation="left">댓글</Divider>

      {/* Comment Form for adding top-level comments */}
      <div className="comment-form-container">
        <Title level={5}>새 댓글 작성</Title>
        <CommentForm
          onSubmit={handleAddComment}
          boardId={boardId}
          loading={loading}
        />
      </div>

      <Divider />

      {/* Nested Comments List */}
      <Spin spinning={loading}>
        {comments.length > 0 ? (
          <div className="nested-comments">
            {comments.map(comment => (
              <NestedCommentItem
                key={comment.commentId}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={onDeleteComment}
                onReply={handleAddNestedComment}
                level={0}
                boardId={boardId}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          <Empty description="아직 댓글이 없습니다." />
        )}
      </Spin>
    </div>
  );
};

export default NestedCommentList;
