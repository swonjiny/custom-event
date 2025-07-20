import React from 'react';
import { Typography } from 'antd';
import DatabaseSelector from '../components/database/DatabaseSelector';

const { Title } = Typography;

const DatabaseConfig = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        Database Configuration
      </Title>
      <DatabaseSelector />
    </div>
  );
};

export default DatabaseConfig;
