import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', background: '#fff', maxWidth: '1200px', width: '100%' }}>
      <Title level={2}>About Page</Title>

      <Card style={{ textAlign: 'center' }}>
        <Typography>
          <Title level={4}>React Application with:</Title>
          <Paragraph>
            <ul style={{ listStylePosition: 'inside', paddingLeft: 0 }}>
              <li><strong>React Router:</strong> For navigation between pages</li>
              <li><strong>Redux:</strong> For state management</li>
              <li><strong>Redux-Saga:</strong> For handling side effects</li>
              <li><strong>Ant Design:</strong> For UI components</li>
            </ul>
          </Paragraph>
          <Paragraph>
            This is a simple example application demonstrating how to integrate these technologies together.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default About;
