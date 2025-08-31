import React, { useEffect, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, Typography, message } from 'antd';
import ErrorTrigger from './error/ErrorTrigger';
import ErrorBoundary from './error/ErrorBoundary';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  const childWindowsRef = useRef([]);
  const latestCanvasStateRef = useRef(null);

  const openPopup = (menuId) => {
    const features = 'width=900,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
    const url = `/popup?menu=${menuId}`;
    const name = `popup-${menuId}-${Date.now()}`;
    const win = window.open(url, name, features);
    if (win) {
      childWindowsRef.current.push({ win, menuId });
      try {
        win.focus();
      } catch {
        // ignore focus errors
      }
    }
  };

  // Bridge between Canvas (custom events) and popups (postMessage)
  useEffect(() => {
    const forwardToChildren = (type, payload) => {
      childWindowsRef.current.forEach(({ win }) => {
        try {
          win.postMessage({ type, payload }, '*');
        } catch {
          /* ignore */
        }
      });
    };

    const handleCanvasSelection = (e) => {
      const payload = e?.detail;
      forwardToChildren('canvasSelection', payload);
    };

    const handleCanvasState = (e) => {
      const payload = e?.detail;
      latestCanvasStateRef.current = payload;
      forwardToChildren('canvasState', payload);
    };

    const handleControlUpdateFromPopup = (event) => {
      const { data } = event;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'controlUpdate') {
        const payload = data.payload;
        // broadcast to Canvas via custom event
        window.dispatchEvent(new CustomEvent('applyCanvasControl', { detail: payload }));
        // also update stored state and forward to other popups to keep them in sync
        latestCanvasStateRef.current = { ...(latestCanvasStateRef.current || {}), ...payload };
        forwardToChildren('canvasState', latestCanvasStateRef.current);
      }
    };

    window.addEventListener('canvasSelection', handleCanvasSelection);
    window.addEventListener('canvasState', handleCanvasState);
    window.addEventListener('message', handleControlUpdateFromPopup);

    return () => {
      window.removeEventListener('canvasSelection', handleCanvasSelection);
      window.removeEventListener('canvasState', handleCanvasState);
      window.removeEventListener('message', handleControlUpdateFromPopup);
    };
  }, []);

  // Listen for postMessage from popups and handle handshake/data exchange
  useEffect(() => {
    const handleMessage = (event) => {
      const { data, source } = event;
      if (!data || typeof data !== 'object') return;

      const entry = childWindowsRef.current.find((e) => e.win === source);
      const menuId = data?.payload?.menuId || entry?.menuId;

      switch (data.type) {
        case 'ready': {
          // Send initial data to the popup
          source?.postMessage(
            {
              type: 'init',
              payload: {
                menuId,
                message: `오프너에서 보낸 초기 데이터 (메뉴 ${menuId ?? '?'})`,
                sentAt: Date.now(),
              },
            },
            '*'
          );
          // Also send the latest canvas state, if any
          if (latestCanvasStateRef.current) {
            source?.postMessage(
              {
                type: 'canvasState',
                payload: latestCanvasStateRef.current,
              },
              '*'
            );
          }
          break;
        }
        case 'update': {
          message.success(`팝업(메뉴 ${menuId})에서 변경 정보 수신: ${data.payload?.text ?? ''}`);
          break;
        }
        case 'requestData': {
          source?.postMessage(
            {
              type: 'dataResponse',
              payload: {
                menuId,
                providedAt: Date.now(),
                items: [
                  { id: 1, value: '추가 데이터 1' },
                  { id: 2, value: '추가 데이터 2' },
                ],
              },
            },
            '*'
          );
          break;
        }
        case 'closed': {
          // Cleanup on popup close notification
          childWindowsRef.current = childWindowsRef.current.filter((e) => e.win !== source);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup/close children on unload
    const handleBeforeUnload = () => {
      childWindowsRef.current.forEach(({ win }) => {
        try { win.close(); } catch { /* ignore */ }
      });
      childWindowsRef.current = [];
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
            {
              key: 'popup1',
              label: <a href="#" onClick={(e) => { e.preventDefault(); openPopup(1); }}>새창뛰우기1</a>,
            },
            {
              key: 'popup2',
              label: <a href="#" onClick={(e) => { e.preventDefault(); openPopup(2); }}>새창뛰우기2</a>,
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
