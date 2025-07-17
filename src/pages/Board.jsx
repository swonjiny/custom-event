import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Form, message, Spin } from 'antd';
import { PlusOutlined, ReadOutlined } from '@ant-design/icons';

// Import components
import BoardList from '../components/board/BoardList';
import BoardForm from '../components/board/BoardForm';
import BoardDetail from '../components/board/BoardDetail';

// Import API services
import { getBoards, createBoard, updateBoard, deleteBoard, getBoardById } from '../services/boardService';

const { Title } = Typography;

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 1
  });
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileList, setFileList] = useState([]);

  // Fetch boards when component mounts or list modal is opened or page changes
  useEffect(() => {
    if (isListModalVisible) {
      fetchBoards(currentPage);
    }
  }, [isListModalVisible, currentPage]);

  // Fetch boards from API with pagination
  const fetchBoards = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const data = await getBoards(page, size);
      setBoards(data.boards || []);
      setPagination({
        currentPage: data.currentPage || 1,
        totalItems: data.totalItems || 0,
        totalPages: data.totalPages || 1
      });
    } catch (error) {
      message.error('게시글을 불러오는데 실패했습니다.');
      console.error('Failed to fetch boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const showListModal = () => {
    setIsListModalVisible(true);
  };

  const hideListModal = () => {
    setIsListModalVisible(false);
  };

  const showDetailModal = async (board) => {
    try {
      setLoading(true);
      // Fetch the latest board data from the API
      const latestBoard = await getBoardById(board.boardId);
      setSelectedBoard(latestBoard);
      setIsDetailModalVisible(true);
    } catch (error) {
      message.error('게시글 상세 정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch board details:', error);
    } finally {
      setLoading(false);
    }
  };

  const hideDetailModal = () => {
    setIsDetailModalVisible(false);
  };

  const showFormModal = (board = null) => {
    setEditingBoard(board);
    setIsFormModalVisible(true);

    if (board) {
      form.setFieldsValue({
        title: board.title,
        writer: board.writer,
      });
      setEditorContent(board.content);
      // Reset file list when editing - files will need to be re-uploaded
      setFileList([]);
    } else {
      form.resetFields();
      setEditorContent('');
      setFileList([]);
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

      const boardData = {
        title: values.title,
        writer: values.writer,
        content: editorContent,
      };

      if (editingBoard) {
        // Update existing board with files
        await updateBoard(editingBoard.boardId, boardData, fileList);
        message.success('게시글이 수정되었습니다.');
      } else {
        // Add new board with files
        await createBoard(boardData, fileList);
        message.success('새 게시글이 추가되었습니다.');
      }

      // Refresh the boards list
      fetchBoards(currentPage);
      setIsFormModalVisible(false);
      form.resetFields();
      setEditorContent('');
      setFileList([]); // Clear file list after submission
    } catch (error) {
      if (error.name !== 'ValidationError') {
        message.error(editingBoard ? '게시글 수정에 실패했습니다.' : '게시글 추가에 실패했습니다.');
        console.error('Failed to submit board:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '게시글 삭제',
      content: '이 게시글을 삭제하시겠습니까?',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteBoard(id);
          message.success('게시글이 삭제되었습니다.');
          // Refresh the boards list
          fetchBoards(currentPage);
        } catch (error) {
          message.error('게시글 삭제에 실패했습니다.');
          console.error('Failed to delete board:', error);
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
        icon={<ReadOutlined />}
        onClick={showListModal}
        size="large"
      >
        게시판 보기
      </Button>

      {/* Main Board List Modal */}
      <Modal
        title="게시판"
        open={isListModalVisible}
        onCancel={hideListModal}
        footer={null}
        width={1000}
        destroyOnClose={false}
      >
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>게시글 목록</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showFormModal()}
          >
            새 게시글
          </Button>
        </div>

        <Spin spinning={loading} tip="로딩 중...">
          <BoardList
            boards={boards}
            onEdit={showFormModal}
            onDelete={handleDelete}
            onViewDetail={showDetailModal}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </Spin>

        {/* Nested Form Modal for Adding/Editing Boards */}
        <Modal
          title={editingBoard ? "게시글 수정" : "새 게시글"}
          open={isFormModalVisible}
          onOk={handleSubmit}
          onCancel={handleFormCancel}
          width={800}
          destroyOnClose={false}
          confirmLoading={loading}
        >
          <Spin spinning={loading} tip="처리 중...">
            <BoardForm
              form={form}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              fileList={fileList}
              setFileList={setFileList}
            />
          </Spin>
        </Modal>
      </Modal>

      {/* Detail View Modal */}
      <BoardDetail
        board={selectedBoard}
        open={isDetailModalVisible}
        onClose={hideDetailModal}
        loading={loading}
      />
    </div>
  );
};

export default Board;
