import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import ErrorTrigger from './error/ErrorTrigger';
import ErrorBoundary from './error/ErrorBoundary';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            React App
          </Title>
          <ErrorTrigger />
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
            {
              key: '5',
              label: <Link to="/board">게시판</Link>,
            },
            {
              key: '6',
              label: <Link to="/database">Database Config</Link>,
            },
            {
              key: '7',
              label: <Link to="/screen-layout">화면 레이아웃</Link>,
            },
          ]}
        />
      </Header>
      <Content style={{ padding: '0', marginTop: '16px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        React App ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};

export default AppLayout;
