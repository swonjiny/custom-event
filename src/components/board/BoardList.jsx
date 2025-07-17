import React from 'react';
import { Table, Button, Space, Card, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const BoardList = ({ boards, onEdit, onDelete, onViewDetail, loading, pagination, onPageChange }) => {
  // Function to render board content in HTML
  const renderContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
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
      title: '번호',
      dataIndex: 'boardId',
      key: 'boardId',
      width: '10%',
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
    },
    {
      title: '작성자',
      dataIndex: 'writer',
      key: 'writer',
      width: '15%',
    },
    {
      title: '조회수',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: '10%',
    },
    {
      title: '작성일',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: '15%',
      render: (text) => formatDate(text),
    },
    {
      title: '액션',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onViewDetail(record)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onDelete(record.boardId)}
          />
        </Space>
      ),
    },
  ];

  // Configure pagination
  const paginationConfig = {
    current: pagination?.currentPage || 1,
    pageSize: 10,
    total: pagination?.totalItems || 0,
    onChange: onPageChange,
    showSizeChanger: false,
  };

  return (
    <Table
      columns={columns}
      dataSource={boards}
      rowKey="boardId"
      expandable={{
        expandedRowRender,
      }}
      pagination={paginationConfig}
      loading={loading}
    />
  );
};

export default BoardList;
