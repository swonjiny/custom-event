import React, { useState } from 'react';
import { List, Typography, Divider, Empty, Spin, Button } from 'antd';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const { Title } = Typography;

/**
 * CommentList component for displaying a list of comments with a form to add new comments
 *
 * @param {Object} props - Component props
 * @param {Array} props.comments - Array of comments to display
 * @param {number} props.boardId - ID of the board the comments belong to
 * @param {Function} props.onAddComment - Function to call when a new comment is submitted
 * @param {Function} props.onEditComment - Function to call when a comment edit is submitted
 * @param {Function} props.onDeleteComment - Function to call when a comment delete is confirmed
 * @param {Function} props.onAddReply - Function to call when a new reply is submitted
 * @param {Function} props.onEditReply - Function to call when a reply edit is submitted
 * @param {Function} props.onDeleteReply - Function to call when a reply delete is confirmed
 * @param {boolean} props.loading - Whether the component is in a loading state
 */
const CommentList = ({
  comments = [],
  boardId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onAddReply,
  onEditReply,
  onDeleteReply,
  loading = false
}) => {
  const [editingComment, setEditingComment] = useState(null);

  const handleAddComment = async (commentData) => {
    await onAddComment(commentData);
  };

  const handleEditComment = async (commentData) => {
    await onEditComment(editingComment.commentId, commentData);
    setEditingComment(null);
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
  };

  return (
    <div className="comment-section">
      <Divider orientation="left">댓글</Divider>

      {/* Comment Form - Show edit form if editing, otherwise show add form */}
      {editingComment ? (
        <>
          <Title level={5}>댓글 수정</Title>
          <CommentForm
            onSubmit={handleEditComment}
            initialValues={editingComment}
            isEdit={true}
            boardId={boardId}
            loading={loading}
          />
          <Button
            onClick={() => setEditingComment(null)}
            style={{ marginTop: -16, marginBottom: 16 }}
          >
            취소
          </Button>
        </>
      ) : (
        <>
          <Title level={5}>새 댓글 작성</Title>
          <CommentForm
            onSubmit={handleAddComment}
            boardId={boardId}
            loading={loading}
          />
        </>
      )}

      <Divider />

      {/* Comments List */}
      <Spin spinning={loading}>
        {comments.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={comments}
            renderItem={comment => (
              <CommentItem
                comment={comment}
                onEdit={handleEditClick}
                onDelete={onDeleteComment}
                onReply={onAddReply}
                onEditReply={onEditReply}
                onDeleteReply={onDeleteReply}
                loading={loading}
              />
            )}
          />
        ) : (
          <Empty description="아직 댓글이 없습니다." />
        )}
      </Spin>
    </div>
  );
};

export default CommentList;
