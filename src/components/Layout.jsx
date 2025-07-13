import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', marginRight: '20px' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            React App
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              label: <Link to="/">Home</Link>,
            },
            {
              key: '2',
              label: <Link to="/about">About</Link>,
            },
            {
              key: '3',
              label: <Link to="/canvas">Canvas</Link>,
            },
            {
              key: '4',
              label: <Link to="/notice">공지사항</Link>,
            },
          ]}
        />
      </Header>
      <Content style={{ padding: '0', marginTop: '16px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        React App ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};

export default AppLayout;
