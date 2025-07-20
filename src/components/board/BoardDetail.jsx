import React, { useState, useEffect } from 'react';
import { Modal, Typography, Divider, Spin, Descriptions, List, Card, Tag, Space, Table, Button, Tooltip, message } from 'antd';
import { FileOutlined, DownloadOutlined } from '@ant-design/icons';
import CommentList from '../comment/CommentList';
import { getCommentsByBoardId, createComment, updateComment, deleteComment } from '../../services/commentService';
import { createReply, updateReply, deleteReply } from '../../services/replyService';

const { Title, Text, Paragraph } = Typography;

const BoardDetail = ({ board, open, onClose, loading: boardLoading = false }) => {
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);

  // Fetch comments when board changes or refresh is triggered
  useEffect(() => {
    if (board && board.boardId) {
      fetchComments(board.boardId);
    }
  }, [board, refreshComments]);

  // Fetch comments for the current board
  const fetchComments = async (boardId) => {
    try {
      setCommentLoading(true);
      const data = await getCommentsByBoardId(boardId);
      setComments(data || []);
    } catch (error) {
      message.error('댓글을 불러오는데 실패했습니다.');
      console.error('Failed to fetch comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Add a new comment
  const handleAddComment = async (commentData) => {
    try {
      setCommentLoading(true);
      await createComment(commentData);
      message.success('댓글이 추가되었습니다.');
      setRefreshComments(!refreshComments); // Trigger refresh
    } catch (error) {
      message.error('댓글 추가에 실패했습니다.');
      console.error('Failed to add comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Edit an existing comment
  const handleEditComment = async (commentId, commentData) => {
    try {
      setCommentLoading(true);
      await updateComment(commentId, commentData);
      message.success('댓글이 수정되었습니다.');
      setRefreshComments(!refreshComments); // Trigger refresh
    } catch (error) {
      message.error('댓글 수정에 실패했습니다.');
      console.error('Failed to edit comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      setCommentLoading(true);
      await deleteComment(commentId);
      message.success('댓글이 삭제되었습니다.');
      setRefreshComments(!refreshComments); // Trigger refresh
    } catch (error) {
      message.error('댓글 삭제에 실패했습니다.');
      console.error('Failed to delete comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Add a new reply to a comment
  const handleAddReply = async (replyData) => {
    try {
      setCommentLoading(true);
      await createReply(replyData);
      message.success('답글이 추가되었습니다.');
      setRefreshComments(!refreshComments); // Trigger refresh
    } catch (error) {
      message.error('답글 추가에 실패했습니다.');
      console.error('Failed to add reply:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Edit an existing reply
  const handleEditReply = async (replyId, replyData) => {
    try {
      setCommentLoading(true);
      await updateReply(replyId, replyData);
      message.success('답글이 수정되었습니다.');
      setRefreshComments(!refreshComments); // Trigger refresh
    } catch (error) {
      message.error('답글 수정에 실패했습니다.');
      console.error('Failed to edit reply:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete a reply
  const handleDeleteReply = async (replyId) => {
    try {
      setCommentLoading(true);
      await deleteReply(replyId);
      message.success('답글이 삭제되었습니다.');
      setRefreshComments(!refreshComments); // Trigger refresh
    } catch (error) {
      message.error('답글 삭제에 실패했습니다.');
      console.error('Failed to delete reply:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (!board) return null;

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      title="게시글 상세보기"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={false}
    >
      <Spin spinning={boardLoading} tip="로딩 중...">
        <div className="board-detail">
          <Title level={3}>{board.title}</Title>

          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="작성자">{board.writer}</Descriptions.Item>
            <Descriptions.Item label="조회수">{board.viewCount}</Descriptions.Item>
            <Descriptions.Item label="작성일">{formatDate(board.createdDate)}</Descriptions.Item>
            <Descriptions.Item label="수정일">{formatDate(board.modifiedDate)}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <div
            className="board-content"
            dangerouslySetInnerHTML={{ __html: board.content }}
            style={{
              padding: '20px',
              minHeight: '200px',
              overflow: 'auto',
              maxHeight: '500px',
              overflowX: 'auto',
              wordWrap: 'break-word',
              maxWidth: '100%',
              border: '1px solid #f0f0f0',
              borderRadius: '4px',
              backgroundColor: '#fafafa'
            }}
          />

          {/* Files Section */}
          {board.files && board.files.length > 0 && (
            <>
              <Divider orientation="left">첨부 파일</Divider>
              <List
                itemLayout="horizontal"
                dataSource={board.files}
                renderItem={file => (
                  <List.Item
                    actions={[
                      <Tooltip title="다운로드">
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={() => window.open(`http://localhost:8080/api/files/${file.fileId}`, '_blank')}
                        />
                      </Tooltip>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileOutlined style={{ fontSize: '24px' }} />}
                      title={file.originalFilename}
                      description={
                        <Space>
                          <Text type="secondary">크기: {formatFileSize(file.fileSize)}</Text>
                          <Text type="secondary">타입: {file.fileType}</Text>
                          <Text type="secondary">업로드일: {formatDate(file.createdDate)}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}

          {/* Comments Section */}
          <CommentList
            comments={comments}
            boardId={board.boardId}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleAddReply}
            onEditReply={handleEditReply}
            onDeleteReply={handleDeleteReply}
            loading={commentLoading}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default BoardDetail;
