import React from 'react';
import { Modal, Typography, Divider, Spin, Descriptions, List, Card, Tag, Space, Table, Button, Tooltip } from 'antd';
import { FileOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const BoardDetail = ({ board, open, onClose, loading = false }) => {
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
      <Spin spinning={loading} tip="로딩 중...">
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
          {board.comments && board.comments.length > 0 && (
            <>
              <Divider orientation="left">댓글 ({board.comments.length})</Divider>
              <List
                itemLayout="vertical"
                dataSource={board.comments}
                renderItem={comment => (
                  <List.Item>
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
                    >
                      <Paragraph>{comment.content}</Paragraph>

                      {/* Replies Section */}
                      {comment.replies && comment.replies.length > 0 && (
                        <List
                          itemLayout="horizontal"
                          dataSource={comment.replies}
                          renderItem={reply => (
                            <List.Item style={{ paddingLeft: 24, borderLeft: '2px solid #f0f0f0' }}>
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
                            </List.Item>
                          )}
                        />
                      )}
                    </Card>
                  </List.Item>
                )}
              />
            </>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export default BoardDetail;
