import React, { useState, useEffect } from 'react';
import { Radio, Button, message, Card, Space, Typography } from 'antd';
import { DatabaseOutlined, SyncOutlined } from '@ant-design/icons';
import { switchDatabase, getCurrentDatabaseType } from '../../services/databaseService';

const { Title, Text } = Typography;

const DatabaseSelector = () => {
  const [databaseType, setDatabaseType] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch current database type on component mount
  useEffect(() => {
    fetchCurrentDatabaseType();
  }, []);

  const fetchCurrentDatabaseType = async () => {
    try {
      setLoading(true);
      const response = await getCurrentDatabaseType();
      setCurrentType(response.databaseType);
      setDatabaseType(response.databaseType);
    } catch (error) {
      message.error('Failed to fetch current database type');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseSwitch = async () => {
    if (!databaseType) {
      message.warning('Please select a database type');
      return;
    }

    try {
      setLoading(true);
      await switchDatabase(databaseType);
      message.success(`Successfully switched to ${databaseType} database`);
      setCurrentType(databaseType);
    } catch (error) {
      message.error(`Failed to switch database: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <DatabaseOutlined />
          <span>Database Configuration</span>
        </Space>
      }
      style={{ maxWidth: 500, margin: '20px auto' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Current Database:</Title>
          <Text strong>{currentType || 'Not set'}</Text>
        </div>

        <div>
          <Title level={5}>Select Database Type:</Title>
          <Radio.Group
            value={databaseType}
            onChange={(e) => setDatabaseType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="MARIADB">MariaDB</Radio.Button>
            <Radio.Button value="ORACLE">Oracle</Radio.Button>
          </Radio.Group>
        </div>

        <Button
          type="primary"
          icon={<SyncOutlined />}
          loading={loading}
          onClick={handleDatabaseSwitch}
          disabled={databaseType === currentType}
        >
          Switch Database
        </Button>

        <Button
          icon={<SyncOutlined />}
          onClick={fetchCurrentDatabaseType}
          loading={loading}
        >
          Refresh Status
        </Button>
      </Space>
    </Card>
  );
};

export default DatabaseSelector;
