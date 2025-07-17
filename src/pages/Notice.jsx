import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Form, message, Spin } from 'antd';
import { PlusOutlined, NotificationOutlined } from '@ant-design/icons';

// Import components
import NoticeList from '../components/notice/NoticeList';
import NoticeForm from '../components/notice/NoticeForm';
import NoticeDetail from '../components/notice/NoticeDetail';

// Import API services
import { getNotices, createNotice, updateNotice, deleteNotice, getNoticeById } from '../services/noticeService';

const { Title } = Typography;

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch notices when component mounts or list modal is opened
  useEffect(() => {
    if (isListModalVisible) {
      fetchNotices();
    }
  }, [isListModalVisible]);

  // Fetch all notices from API
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      message.error('공지사항을 불러오는데 실패했습니다.');
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const showListModal = () => {
    setIsListModalVisible(true);
  };

  const hideListModal = () => {
    setIsListModalVisible(false);
  };

  const showDetailModal = async (notice) => {
    try {
      setLoading(true);
      // Fetch the latest notice data from the API
      const latestNotice = await getNoticeById(notice.id);
      setSelectedNotice(latestNotice);
      setIsDetailModalVisible(true);
    } catch (error) {
      message.error('공지사항 상세 정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch notice details:', error);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const noticeData = {
        title: values.title,
        content: editorContent,
      };

      if (editingNotice) {
        // Update existing notice
        await updateNotice(editingNotice.id, noticeData);
        message.success('공지사항이 수정되었습니다.');
      } else {
        // Add new notice
        await createNotice(noticeData);
        message.success('새 공지사항이 추가되었습니다.');
      }

      // Refresh the notices list
      fetchNotices();
      setIsFormModalVisible(false);
      form.resetFields();
      setEditorContent('');
    } catch (error) {
      if (error.name !== 'ValidationError') {
        message.error(editingNotice ? '공지사항 수정에 실패했습니다.' : '공지사항 추가에 실패했습니다.');
        console.error('Failed to submit notice:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '공지사항 삭제',
      content: '이 공지사항을 삭제하시겠습니까?',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteNotice(id);
          message.success('공지사항이 삭제되었습니다.');
          // Refresh the notices list
          fetchNotices();
        } catch (error) {
          message.error('공지사항 삭제에 실패했습니다.');
          console.error('Failed to delete notice:', error);
        } finally {
          setLoading(false);
        }
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

        <Spin spinning={loading} tip="로딩 중...">
          <NoticeList
            notices={notices}
            onEdit={showFormModal}
            onDelete={handleDelete}
            onViewDetail={showDetailModal}
          />
        </Spin>

        {/* Nested Form Modal for Adding/Editing Notices */}
        <Modal
          title={editingNotice ? "공지사항 수정" : "새 공지사항"}
          open={isFormModalVisible}
          onOk={handleSubmit}
          onCancel={handleFormCancel}
          width={800}
          destroyOnClose={false}
          confirmLoading={loading}
        >
          <Spin spinning={loading} tip="처리 중...">
            <NoticeForm
              form={form}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </Spin>
        </Modal>
      </Modal>

      {/* Detail View Modal */}
      <NoticeDetail
        notice={selectedNotice}
        open={isDetailModalVisible}
        onClose={hideDetailModal}
        loading={loading}
      />
    </div>
  );
};

export default Notice;
