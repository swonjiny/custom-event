import React, { useState } from 'react';
import { Typography, Button, Modal, Form, message } from 'antd';
import { PlusOutlined, NotificationOutlined } from '@ant-design/icons';

// Import components
import NoticeList from '../components/notice/NoticeList';
import NoticeForm from '../components/notice/NoticeForm';
import NoticeDetail from '../components/notice/NoticeDetail';

// Import sample data
import { initialNotices } from '../components/notice/noticeData';

const { Title } = Typography;

const Notice = () => {
  const [notices, setNotices] = useState(initialNotices);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');

  const showListModal = () => {
    setIsListModalVisible(true);
  };

  const hideListModal = () => {
    setIsListModalVisible(false);
  };

  const showDetailModal = (notice) => {
    setSelectedNotice(notice);
    setIsDetailModalVisible(true);
  };

  const hideDetailModal = () => {
    setIsDetailModalVisible(false);
  };

  const showFormModal = (notice = null) => {
    setEditingNotice(notice);
    setIsFormModalVisible(true);

    if (notice) {
      form.setFieldsValue({
        title: notice.title,
      });
      setEditorContent(notice.content);
    } else {
      form.resetFields();
      setEditorContent('');
    }
  };

  const handleFormCancel = () => {
    setIsFormModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const now = new Date().toLocaleString();

      if (editingNotice) {
        // Update existing notice
        const updatedNotices = notices.map(notice =>
          notice.id === editingNotice.id
            ? { ...notice, title: values.title, content: editorContent, updatedAt: now }
            : notice
        );
        setNotices(updatedNotices);
        message.success('공지사항이 수정되었습니다.');
      } else {
        // Add new notice
        const newNotice = {
          id: Date.now(), // Simple ID generation
          title: values.title,
          content: editorContent,
          createdAt: now,
        };
        setNotices([...notices, newNotice]);
        message.success('새 공지사항이 추가되었습니다.');
      }

      setIsFormModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '공지사항 삭제',
      content: '이 공지사항을 삭제하시겠습니까?',
      onOk() {
        const updatedNotices = notices.filter(notice => notice.id !== id);
        setNotices(updatedNotices);
        message.success('공지사항이 삭제되었습니다.');
      },
    });
  };



  return (
    <div style={{ padding: '20px', background: '#fff', maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
      <Button
        type="primary"
        icon={<NotificationOutlined />}
        onClick={showListModal}
        size="large"
      >
        공지사항 보기
      </Button>

      {/* Main Notice List Modal */}
      <Modal
        title="공지사항"
        open={isListModalVisible}
        onCancel={hideListModal}
        footer={null}
        width={1000}
        destroyOnClose={false}
      >
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>공지사항 목록</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showFormModal()}
          >
            새 공지사항
          </Button>
        </div>

        <NoticeList
          notices={notices}
          onEdit={showFormModal}
          onDelete={handleDelete}
          onViewDetail={showDetailModal}
        />

        {/* Nested Form Modal for Adding/Editing Notices */}
        <Modal
          title={editingNotice ? "공지사항 수정" : "새 공지사항"}
          open={isFormModalVisible}
          onOk={handleSubmit}
          onCancel={handleFormCancel}
          width={800}
          destroyOnClose={false}
        >
          <NoticeForm
            form={form}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />
        </Modal>
      </Modal>

      {/* Detail View Modal */}
      <NoticeDetail
        notice={selectedNotice}
        open={isDetailModalVisible}
        onClose={hideDetailModal}
      />
    </div>
  );
};

export default Notice;
