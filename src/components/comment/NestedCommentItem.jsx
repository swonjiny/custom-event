import React, { useState } from 'react';
import { Card, Typography, Space, Button, Popconfirm, List, Divider } from 'antd';
import { CommentOutlined, EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import CommentForm from './CommentForm';

const { Text, Paragraph } = Typography;

/**
 * NestedCommentItem component for displaying a comment with its nested children
 *
 * @param {Object} props - Component props
 * @param {Object} props.comment - The comment data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is confirmed
 * @param {Function} props.onReply - Function to call when a reply is submitted
 * @param {number} props.level - The nesting level of the comment (for styling)
 * @param {number} props.boardId - ID of the board the comment belongs to
 * @param {boolean} props.loading - Whether the component is in a loading state
 */
const NestedCommentItem = ({
  comment,
  onEdit,
  onDelete,
  onReply,
  level = 0,
  boardId,
  loading = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleReplySubmit = async (replyData) => {
    await onReply(replyData);
    setShowReplyForm(false);
  };

  const handleEditSubmit = async (commentData) => {
    await onEdit(comment.commentId, commentData);
    setEditMode(false);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  // Calculate left margin based on nesting level
  const getIndentStyle = () => {
    return {
      marginLeft: level > 0 ? `${level * 24}px` : 0,
      borderLeft: level > 0 ? '2px solid #f0f0f0' : 'none',
      paddingLeft: level > 0 ? '12px' : 0,
      marginBottom: '16px'
    };
  };

  return (
    <div style={getIndentStyle()}>
      <Card
        size="small"
        title={
          <Space>
            <Text strong>{comment.writer}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {formatDate(comment.createdDate)}
            </Text>
            {level > 0 && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                (Level {level})
              </Text>
            )}
          </Space>
        }
        extra={
          <Space>
            <Button
              type="text"
              icon={<RollbackOutlined />}
              onClick={() => setShowReplyForm(!showReplyForm)}
              size="small"
            >
              답글
            </Button>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
              size="small"
            >
              수정
            </Button>
            <Popconfirm
              title="이 댓글을 삭제하시겠습니까?"
              onConfirm={() => onDelete(comment.commentId)}
              okText="예"
              cancelText="아니오"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                삭제
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        {editMode ? (
          <CommentForm
            onSubmit={handleEditSubmit}
            initialValues={comment}
            isEdit={true}
            boardId={boardId}
            loading={loading}
          />
        ) : (
          <Paragraph>{comment.content}</Paragraph>
        )}

        {/* Reply Form */}
        {showReplyForm && !editMode && (
          <div style={{ marginTop: '16px' }}>
            <Divider orientation="left" plain style={{ margin: '8px 0' }}>
              답글 작성
            </Divider>
            <CommentForm
              onSubmit={handleReplySubmit}
              boardId={boardId}
              parentCommentId={comment.commentId}
              loading={loading}
            />
            <Button onClick={handleCancelReply} style={{ marginTop: '8px' }}>
              취소
            </Button>
          </div>
        )}

        {/* Nested Comments */}
        {comment.children && comment.children.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Divider orientation="left" plain style={{ margin: '8px 0' }}>
              답글 ({comment.children.length})
            </Divider>
            <List
              itemLayout="vertical"
              dataSource={comment.children}
              renderItem={childComment => (
                <NestedCommentItem
                  key={childComment.commentId}
                  comment={childComment}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={onReply}
                  level={level + 1}
                  boardId={boardId}
                  loading={loading}
                />
              )}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default NestedCommentItem;
