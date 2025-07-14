import React, {useEffect} from 'react';
import { Form, Input } from 'antd';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

const NoticeForm = ({ form, editorContent, setEditorContent }) => {
    useEffect(() => {
        console.log(editorContent)
    }, [editorContent]);
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="title"
        label="제목"
        rules={[{ required: true, message: '제목을 입력해주세요' }]}
      >
        <Input placeholder="공지사항 제목" />
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
    </Form>
  );
};

export default NoticeForm;
