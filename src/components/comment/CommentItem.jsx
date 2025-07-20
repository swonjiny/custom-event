import React, { useState } from 'react';
import { Card, Typography, Space, Button, Popconfirm, List, Divider } from 'antd';
import { CommentOutlined, EditOutlined, DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import ReplyForm from './ReplyForm';

const { Text, Paragraph } = Typography;

/**
 * CommentItem component for displaying a single comment with its replies
 *
 * @param {Object} props - Component props
 * @param {Object} props.comment - The comment data to display
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is confirmed
 * @param {Function} props.onReply - Function to call when a reply is submitted
 * @param {Function} props.onEditReply - Function to call when a reply edit is submitted
 * @param {Function} props.onDeleteReply - Function to call when a reply delete is confirmed
 * @param {boolean} props.loading - Whether the component is in a loading state
 */
const CommentItem = ({
  comment,
  onEdit,
  onDelete,
  onReply,
  onEditReply,
  onDeleteReply,
  loading = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editingReply, setEditingReply] = useState(null);

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

  const handleEditReply = async (replyData) => {
    await onEditReply(editingReply.replyId, replyData);
    setEditingReply(null);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const handleCancelEditReply = () => {
    setEditingReply(null);
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <Text strong>{comment.writer}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formatDate(comment.createdDate)}
          </Text>
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
            onClick={() => onEdit(comment)}
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
      style={{ marginBottom: 16 }}
    >
      <Paragraph>{comment.content}</Paragraph>

      {/* Reply Form */}
      {showReplyForm && (
        <ReplyForm
          onSubmit={handleReplySubmit}
          commentId={comment.commentId}
          loading={loading}
          onCancel={handleCancelReply}
        />
      )}

      {/* Replies Section */}
      {comment.replies && comment.replies.length > 0 && (
        <>
          <Divider orientation="left" plain style={{ margin: '12px 0' }}>
            답글 ({comment.replies.length})
          </Divider>
          <List
            itemLayout="horizontal"
            dataSource={comment.replies}
            renderItem={reply => (
              <List.Item
                style={{
                  paddingLeft: 24,
                  borderLeft: '2px solid #f0f0f0',
                  marginBottom: 8
                }}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setEditingReply(reply)}
                    size="small"
                  >
                    수정
                  </Button>,
                  <Popconfirm
                    title="이 답글을 삭제하시겠습니까?"
                    onConfirm={() => onDeleteReply(reply.replyId)}
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
                ]}
              >
                {editingReply && editingReply.replyId === reply.replyId ? (
                  <ReplyForm
                    onSubmit={handleEditReply}
                    initialValues={reply}
                    isEdit={true}
                    commentId={comment.commentId}
                    loading={loading}
                    onCancel={handleCancelEditReply}
                  />
                ) : (
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{reply.writer}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatDate(reply.createdDate)}
                        </Text>
                      </Space>
                    }
                    description={reply.content}
                  />
                )}
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );
};

export default CommentItem;
