import React from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

const BoardForm = ({ form, editorContent, setEditorContent, fileList = [], setFileList }) => {
  // File upload configuration
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // Check file type and size if needed
      const isValidFileType = file.type === 'application/pdf' ||
                             file.type.startsWith('image/') ||
                             file.type === 'application/msword' ||
                             file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      if (!isValidFileType) {
        message.error('지원되지 않는 파일 형식입니다.');
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('파일 크기는 10MB 이하여야 합니다.');
        return Upload.LIST_IGNORE;
      }

      setFileList([...fileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="title"
        label="제목"
        rules={[{ required: true, message: '제목을 입력해주세요' }]}
      >
        <Input placeholder="게시글 제목" />
      </Form.Item>

      <Form.Item
        name="writer"
        label="작성자"
        rules={[{ required: true, message: '작성자를 입력해주세요' }]}
      >
        <Input placeholder="작성자" />
      </Form.Item>

      <Form.Item label="내용">
        <div style={{ height: '300px' }}>
          <FroalaEditor
            model={editorContent}
            onModelChange={setEditorContent}
            config={{
              height: 250,
              toolbarButtons: [
                'bold', 'italic', 'underline', 'strikeThrough',
                'paragraphFormat', 'formatOL', 'formatUL',
                'color', 'backgroundColor',
                'insertLink', 'insertImage',
                'clearFormatting'
              ],
              placeholderText: '내용을 입력해주세요',
            }}
          />
        </div>
      </Form.Item>

      <Form.Item label="첨부 파일">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>파일 선택</Button>
        </Upload>
        <div style={{ marginTop: '8px', color: '#888' }}>
          지원 파일 형식: PDF, 이미지, Word 문서 (최대 10MB)
        </div>
      </Form.Item>
    </Form>
  );
};

export default BoardForm;
