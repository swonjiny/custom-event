import React from 'react';
import { Modal, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

const NoticeDetail = ({ notice, open, onClose }) => {
  if (!notice) return null;

  return (
    <Modal
      title="공지사항 상세보기"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={false}
    >
      <div className="notice-detail">
        <Title level={3}>{notice.title}</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Text type="secondary">작성일: {notice.createdAt}</Text>
          {notice.updatedAt && (
            <Text type="secondary">수정일: {notice.updatedAt}</Text>
          )}
        </div>
        <Divider />
        <div
          className="notice-content"
          dangerouslySetInnerHTML={{ __html: notice.content }}
          style={{
            padding: '20px',
            minHeight: '200px',
            overflow: 'auto',
            maxHeight: '500px',
            overflowX: 'auto',
            wordWrap: 'break-word',
            maxWidth: '100%'
          }}
        />
      </div>
    </Modal>
  );
};

export default NoticeDetail;
