import React from 'react';
import { Table, Button, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const NoticeList = ({ notices, onEdit, onDelete, onViewDetail }) => {
  // Function to render notice content in HTML
  const renderContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Expanded row render function
  const expandedRowRender = (record) => {
    return (
      <Card>
        {renderContent(record.content)}
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Button type="link" onClick={() => onViewDetail(record)}>
            상세 보기
          </Button>
        </div>
      </Card>
    );
  };

  const columns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '작성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '액션',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            수정
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            삭제
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={notices}
      rowKey="id"
      expandable={{
        expandedRowRender,
      }}
    />
  );
};

export default NoticeList;
