import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { RollbackOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;

/**
 * ReplyForm component for adding or editing replies to comments
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Object} props.initialValues - Initial values for the form (for editing)
 * @param {boolean} props.isEdit - Whether the form is for editing a reply
 * @param {number} props.commentId - ID of the comment the reply belongs to
 * @param {boolean} props.loading - Whether the form is in a loading state
 * @param {Function} props.onCancel - Function to call when cancel button is clicked
 */
const ReplyForm = ({
  onSubmit,
  initialValues = {},
  isEdit = false,
  commentId,
  loading = false,
  onCancel
}) => {
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

      // Create reply data object
      const replyData = {
        ...values,
        commentId: commentId, // Add commentId for new replies
      };

      // Call the onSubmit function passed from parent
      await onSubmit(replyData);

      // Reset form if not editing
      if (!isEdit) {
        form.resetFields();
      }

      message.success(isEdit ? '답글이 수정되었습니다.' : '답글이 추가되었습니다.');

      // Call onCancel to hide the form after submission if provided
      if (onCancel && !isEdit) {
        onCancel();
      }
    } catch (error) {
      if (error.name !== 'ValidationError') {
        message.error(isEdit ? '답글 수정에 실패했습니다.' : '답글 추가에 실패했습니다.');
        console.error('Failed to submit reply:', error);
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
      style={{ marginLeft: 24, borderLeft: '2px solid #f0f0f0', paddingLeft: 12 }}
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
        label="답글 내용"
        rules={[{ required: true, message: '내용을 입력해주세요' }]}
      >
        <TextArea
          placeholder="답글 내용을 입력하세요"
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={isEdit ? <EditOutlined /> : <RollbackOutlined />}
          loading={submitting || loading}
          style={{ marginRight: 8 }}
        >
          {isEdit ? '답글 수정' : '답글 작성'}
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>
            취소
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default ReplyForm;
