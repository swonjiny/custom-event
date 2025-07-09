import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Space, Typography } from 'antd';
import { increment, decrement, fetchData } from '../redux/actions';

const { Title, Text } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const { count } = useSelector(state => state.counter);
  const { data, loading, error } = useSelector(state => state.data);

  const handleFetchData = () => {
    dispatch(fetchData());
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', background: '#fff', maxWidth: '1200px', width: '100%' }}>
      <Title level={2}>Home Page</Title>

      <Card title="Counter Example" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Space direction="vertical" size="middle" style={{ display: 'flex', alignItems: 'center' }}>
          <Text>Current Count: {count}</Text>
          <Space>
            <Button type="primary" onClick={() => dispatch(increment())}>
              Increment
            </Button>
            <Button onClick={() => dispatch(decrement())}>
              Decrement
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="Data Fetching Example" style={{ textAlign: 'center' }}>
        <Space direction="vertical" size="middle" style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="primary"
            onClick={handleFetchData}
            loading={loading}
          >
            Fetch Data
          </Button>

          {loading && <Text>Loading...</Text>}
          {error && <Text type="danger">Error: {error}</Text>}

          {data.length > 0 && (
            <ul style={{ listStylePosition: 'inside', paddingLeft: 0 }}>
              {data.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Home;
