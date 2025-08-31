import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Input, Space, Typography, Divider, Alert, Switch, Slider, Radio } from 'antd';

const { Title, Text } = Typography;

/**
 * PopupWindow
 * - Opened in a separate browser window via window.open
 * - Communicates with the opener window using postMessage
 *   • Sends a 'ready' message on mount to request initial data
 *   • Receives 'init' and 'dataResponse' messages from opener
 *   • Can send 'update' to opener with changed information
 *   • Can send 'requestData' to ask for additional data
 */
const PopupWindow = () => {
  const [menuId, setMenuId] = useState(null);
  const [initData, setInitData] = useState(null);
  const [receivedData, setReceivedData] = useState(null);
  const [myText, setMyText] = useState('');
  const [canvasState, setCanvasState] = useState(null);
  const [canvasSelection, setCanvasSelection] = useState(null);

  // Local controls mirror Canvas settings
  const [showCircles, setShowCircles] = useState(true);
  const [circleCount, setCircleCount] = useState(20);
  const [activeAreaSize, setActiveAreaSize] = useState(50);
  const [tooltipShape, setTooltipShape] = useState('rectangle');

  const openerRef = useRef(null);

  // Parse query params e.g., ?menu=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('menu');
    setMenuId(id);
  }, []);

  // Setup message listener and handshake with opener
  useEffect(() => {
    const handleMessage = (event) => {
      // In dev, we accept messages from any origin. Adjust if needed.
      const { data } = event;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'init': {
          openerRef.current = event.source;
          setInitData(data.payload);
          setReceivedData(null);
          break;
        }
        case 'canvasState': {
          setCanvasState(data.payload);
          // update local mirrored controls
          if (typeof data.payload.showCircles === 'boolean') setShowCircles(data.payload.showCircles);
          if (typeof data.payload.circleCount === 'number') setCircleCount(data.payload.circleCount);
          if (typeof data.payload.activeAreaSize === 'number') setActiveAreaSize(data.payload.activeAreaSize);
          if (typeof data.payload.tooltipShape === 'string') setTooltipShape(data.payload.tooltipShape);
          break;
        }
        case 'canvasSelection': {
          setCanvasSelection(data.payload);
          break;
        }
        case 'dataResponse': {
          setReceivedData(data.payload);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify opener that this popup is ready
    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'ready', payload: { url: window.location.href } }, '*');
      } catch {
        // ignore
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      // inform opener this popup is closing
      try {
        if (window.opener) {
          window.opener.postMessage({ type: 'closed', payload: { url: window.location.href } }, '*');
        }
      } catch {
        // ignore
      }
    };
  }, []);

  const sendUpdate = () => {
    if (window.opener) {
      window.opener.postMessage({ type: 'update', payload: { menuId, text: myText, at: Date.now() } }, '*');
    }
  };

  const requestMoreData = () => {
    if (window.opener) {
      window.opener.postMessage({ type: 'requestData', payload: { menuId, need: 'moreData' } }, '*');
    }
  };

  const sendControlUpdate = (partial) => {
    const payload = { showCircles, circleCount, activeAreaSize, tooltipShape, ...partial };
    if (window.opener) {
      window.opener.postMessage({ type: 'controlUpdate', payload }, '*');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={4}>팝업 창 {menuId ? `(메뉴 ${menuId})` : ''}</Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Canvas Selection (Canvas → Popup)</Text>
          {canvasSelection ? (
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 4 }}>{JSON.stringify(canvasSelection, null, 2)}</pre>
          ) : (
            <Alert type="info" message="Canvas에서 선택 정보를 기다리는 중..." showIcon />
          )}
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Canvas State (Canvas → Popup)</Text>
          {canvasState ? (
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 4 }}>{JSON.stringify(canvasState, null, 2)}</pre>
          ) : (
            <Alert type="info" message="Canvas 상태 동기화를 기다리는 중..." showIcon />
          )}
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Control Panel (Popup → Canvas)</Text>
          <div>
            <Text>Show Circles:</Text>
            <div style={{ marginTop: 5 }}>
              <Switch
                checked={showCircles}
                onChange={(v) => { setShowCircles(v); sendControlUpdate({ showCircles: v }); }}
              />
            </div>
          </div>
          <div>
            <Text>Circle Count: {circleCount}</Text>
            <Slider min={5} max={50} value={circleCount} onChange={(v) => { setCircleCount(v); sendControlUpdate({ circleCount: v }); }} />
          </div>
          <div>
            <Text>Active Area Size: {activeAreaSize}px</Text>
            <Slider min={20} max={100} value={activeAreaSize} onChange={(v) => { setActiveAreaSize(v); sendControlUpdate({ activeAreaSize: v }); }} />
          </div>
          <div>
            <Text>Tooltip Shape:</Text>
            <div style={{ marginTop: 10 }}>
              <Radio.Group
                value={tooltipShape}
                onChange={(e) => { setTooltipShape(e.target.value); sendControlUpdate({ tooltipShape: e.target.value }); }}
                buttonStyle="solid"
              >
                <Radio.Button value="rectangle">Rectangle</Radio.Button>
                <Radio.Button value="rounded">Rounded</Radio.Button>
                <Radio.Button value="circle">Circle</Radio.Button>
                <Radio.Button value="diamond">Diamond</Radio.Button>
                <Radio.Button value="cloud">Cloud</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>초기 데이터 (opener → popup)</Text>
          {initData ? (
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 4 }}>{JSON.stringify(initData, null, 2)}</pre>
          ) : (
            <Alert type="info" message="초기 데이터를 기다리는 중..." showIcon />
          )}
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>변경 정보 보내기 (popup → opener)</Text>
          <Input placeholder="전송할 텍스트" value={myText} onChange={(e) => setMyText(e.target.value)} />
          <Button type="primary" onClick={sendUpdate}>변경 내용 전송</Button>
        </Space>
      </Card>

      <Card size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>추가 데이터 요청 (popup → opener)</Text>
          <Button onClick={requestMoreData}>데이터 요청</Button>
          {receivedData && (
            <>
              <Divider />
              <Text>받은 데이터:</Text>
              <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 4 }}>{JSON.stringify(receivedData, null, 2)}</pre>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default PopupWindow;
