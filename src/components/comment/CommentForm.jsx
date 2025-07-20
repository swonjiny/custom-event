import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { CommentOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

/**
 * CommentForm component for adding or editing comments
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Object} props.initialValues - Initial values for the form (for editing)
 * @param {boolean} props.isEdit - Whether the form is for editing a comment
 * @param {number} props.boardId - ID of the board the comment belongs to
 * @param {boolean} props.loading - Whether the form is in a loading state
 */
const CommentForm = ({ onSubmit, initialValues = {}, isEdit = false, boardId, loading = false }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Set initial values when they change (for editing)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue({
        writer: initialValues.writer || '',
        content: initialValues.content || '',
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Create comment data object
      const commentData = {
        ...values,
        boardId: boardId, // Add boardId for new comments
      };

      // Call the onSubmit function passed from parent
      await onSubmit(commentData);

      // Reset form if not editing
      if (!isEdit) {
        form.resetFields();
      }

      message.success(isEdit ? '댓글이 수정되었습니다.' : '댓글이 추가되었습니다.');
    } catch (error) {
      if (error.name !== 'ValidationError') {
        message.error(isEdit ? '댓글 수정에 실패했습니다.' : '댓글 추가에 실패했습니다.');
        console.error('Failed to submit comment:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item
        name="writer"
        label="작성자"
        rules={[{ required: true, message: '작성자를 입력해주세요' }]}
      >
        <Input placeholder="작성자" disabled={isEdit} />
      </Form.Item>

      <Form.Item
        name="content"
        label="내용"
        rules={[{ required: true, message: '내용을 입력해주세요' }]}
      >
        <TextArea
          placeholder="댓글 내용을 입력하세요"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={isEdit ? <EditOutlined /> : <CommentOutlined />}
          loading={submitting || loading}
        >
          {isEdit ? '댓글 수정' : '댓글 작성'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
