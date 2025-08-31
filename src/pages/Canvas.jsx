import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Card, Button, Switch, Slider, Input, List, Divider, Tooltip, Radio } from 'antd';
import { saveCanvasSettings, loadCanvasSettings, fetchCanvasSettings } from '../redux/actions';

const { Title, Text } = Typography;

const Canvas = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector(state => state.canvas);

  const canvasRef = useRef(null);
  const [showCircles, setShowCircles] = useState(true);
  const [circleCount, setCircleCount] = useState(20);
  const [settingName, setSettingName] = useState('');
  const [settingDescription, setSettingDescription] = useState('');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showSettingsList, setShowSettingsList] = useState(true);

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState({});
  const tooltipTimeoutRef = useRef(null);
  const [tooltipShape, setTooltipShape] = useState('rectangle'); // rectangle, rounded, circle, diamond, cloud

  // Active area state
  const [activeArea, setActiveArea] = useState(null);
  const [activeAreaSize, setActiveAreaSize] = useState(50); // Size of the active area in pixels

  // Fetch canvas settings when component mounts
  useEffect(() => {
    dispatch(fetchCanvasSettings());
  }, [dispatch]);

  // Listen for custom tooltip events
  useEffect(() => {
    const canvas = canvasRef.current;

    const handleTooltipEvent = (e) => {
      console.log('Tooltip event:', e.detail);
      // Other components could listen for this event and react accordingly
    };

    // Add event listener for custom tooltip event
    canvas.addEventListener('tooltip', handleTooltipEvent);

    // Clean up event listener on component unmount
    return () => {
      canvas.removeEventListener('tooltip', handleTooltipEvent);
    };
  }, []);

  // Custom tooltip event class
  class TooltipEvent extends Event {
    constructor(detail) {
      super('tooltip', { bubbles: true });
      this.detail = detail;
    }
  }

  // Handle mouse events for tooltip
  const handleMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }

    // Hide tooltip if it's showing
    if (showTooltip) {
      setShowTooltip(false);
    }

    // Create an active area at the click position
    setActiveArea({
      x: x - activeAreaSize / 2,
      y: y - activeAreaSize / 2,
      width: activeAreaSize,
      height: activeAreaSize
    });

    // Create tooltip content
    const content = {
      position: { x: Math.round(x), y: Math.round(y) },
      canvasSize: { width: rect.width, height: rect.height },
      settings: {
        circles: showCircles ? circleCount : 'Hidden',
        panels: {
          left: showLeftPanel ? 'Visible' : 'Hidden',
          right: showRightPanel ? 'Visible' : 'Hidden'
        },
        tooltipShape
      }
    };

    // Set tooltip position and content
    setTooltipPosition({ x, y });
    setTooltipContent(content);

    // Dispatch custom tooltip event for the active area
    const tooltipEvent = new TooltipEvent({
      type: 'activeArea',
      position: { x, y },
      content
    });
    canvasRef.current.dispatchEvent(tooltipEvent);

    // Dispatch global event so Layout can forward to popups
    try {
      window.dispatchEvent(new CustomEvent('canvasSelection', { detail: { ...content, activeArea: {
        x: x - activeAreaSize / 2,
        y: y - activeAreaSize / 2,
        width: activeAreaSize,
        height: activeAreaSize,
      } } }));
    } catch { /* ignore */ 0; }
  }, [showCircles, circleCount, showLeftPanel, showRightPanel, activeAreaSize, showTooltip, tooltipShape]);

  const handleMouseMove = useCallback((e) => {
    // Clear timeout when mouse moves
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }

    // If there's an active area, check if the mouse is over it
    if (activeArea) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if mouse is inside the active area
      const isInside =
        x >= activeArea.x &&
        x <= activeArea.x + activeArea.width &&
        y >= activeArea.y &&
        y <= activeArea.y + activeArea.height;

      // Show tooltip if mouse is inside the active area, hide it otherwise
      if (isInside && !showTooltip) {
        setShowTooltip(true);

        // Dispatch custom tooltip event
        const tooltipEvent = new TooltipEvent({
          type: 'show',
          position: { x, y },
          content: tooltipContent
        });
        canvasRef.current.dispatchEvent(tooltipEvent);
      } else if (!isInside && showTooltip) {
        setShowTooltip(false);

        // Dispatch custom tooltip event
        const tooltipEvent = new TooltipEvent({
          type: 'hide'
        });
        canvasRef.current.dispatchEvent(tooltipEvent);
      }
    }
  }, [activeArea, showTooltip, tooltipContent]);

  const handleMouseUp = useCallback(() => {
    // Optional: you can add specific behavior on mouse up if needed
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas to full container size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    // Call resize initially and add event listener
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw a sample image (can be replaced with actual image or 3D rendering)
    const drawSampleContent = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1677ff');
      gradient.addColorStop(1, '#69b1ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circles if enabled
      if (showCircles) {
        for (let i = 0; i < circleCount; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 50 + 10,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
          ctx.fill();
        }
      }

      // Add text
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Canvas Rendering Demo', canvas.width / 2, 50);
    };

    drawSampleContent();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showCircles, circleCount]);

  // Toggle panel visibility
  const toggleLeftPanel = () => setShowLeftPanel(!showLeftPanel);
  const toggleRightPanel = () => setShowRightPanel(!showRightPanel);
  const toggleSettingsList = () => setShowSettingsList(!showSettingsList);

  // Broadcast canvas settings to popup via Layout bridge
  useEffect(() => {
    const payload = { showCircles, circleCount, activeAreaSize, tooltipShape };
    try {
      window.dispatchEvent(new CustomEvent('canvasState', { detail: payload }));
    } catch { /* ignore */ 0; }
  }, [showCircles, circleCount, activeAreaSize, tooltipShape]);

  // Apply updates from popup control panel
  useEffect(() => {
    const handler = (e) => {
      const p = e?.detail || {};
      if (typeof p.showCircles === 'boolean') setShowCircles(p.showCircles);
      if (typeof p.circleCount === 'number') setCircleCount(p.circleCount);
      if (typeof p.activeAreaSize === 'number') setActiveAreaSize(p.activeAreaSize);
      if (typeof p.tooltipShape === 'string') setTooltipShape(p.tooltipShape);
    };
    window.addEventListener('applyCanvasControl', handler);
    return () => window.removeEventListener('applyCanvasControl', handler);
  }, []);

  // Reset canvas settings
  const resetCanvas = () => {
    setShowCircles(true);
    setCircleCount(20);
    setSettingName('');
    setSettingDescription('');
  };

  // Handle tooltip close button click
  const handleCloseTooltip = () => {
    setShowTooltip(false);

    // Dispatch custom tooltip event
    const tooltipEvent = new TooltipEvent({
      type: 'hide'
    });
    canvasRef.current.dispatchEvent(tooltipEvent);

    // Note: We don't clear the active area here
    // This allows the user to hover over it again to show the tooltip
  };

  // Clear active area
  const clearActiveArea = () => {
    setActiveArea(null);
    setShowTooltip(false);
  };

  // Save current settings to Redux
  const handleSaveSettings = () => {
    if (!settingName.trim()) {
      alert('Please enter a name for your settings');
      return;
    }

    const settings = {
      name: settingName,
      description: settingDescription,
      showCircles,
      circleCount
    };

    dispatch(saveCanvasSettings(settings));
    setSettingName('');
    setSettingDescription('');
  };

  // Load saved settings
  const handleLoadSettings = (id) => {
    dispatch(loadCanvasSettings(id));

    // Find the selected settings
    const selectedSettings = settings.find(setting => setting.id === id);
    if (selectedSettings) {
      setShowCircles(selectedSettings.showCircles);
      setCircleCount(selectedSettings.circleCount);
    }
  };

  return (
    <div style={{
      padding: 0,
      margin: 0,
      overflow: 'hidden',
      position: 'absolute',
      top: 64, // Header height
      left: 0,
      right: 0,
      bottom: 70, // Footer height
      zIndex: 1
    }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          display: 'block',
          backgroundColor: '#f0f0f0',
          width: '100%',
          height: '100%'
        }}
      />

      {/* Active Area */}
      {activeArea && (
        <>
          <div
            style={{
              position: 'absolute',
              left: activeArea.x,
              top: activeArea.y,
              width: activeArea.width,
              height: activeArea.height,
              border: '2px dashed rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              pointerEvents: 'none', // Make sure it doesn't interfere with mouse events
              zIndex: 9
            }}
          />
          <Button
            size="small"
            type="primary"
            danger
            onClick={clearActiveArea}
            style={{
              position: 'absolute',
              left: activeArea.x + activeArea.width + 5,
              top: activeArea.y - 25,
              zIndex: 9
            }}
          >
            Clear Area
          </Button>
        </>
      )}

      {/* Custom Tooltip */}
      {showTooltip && (
        <>
          {/* Tooltip pointer */}
          <div
            style={{
              position: 'absolute',
              left: tooltipPosition.x - 5,
              top: tooltipPosition.y - 5,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '2px solid rgba(0, 0, 0, 0.8)',
              zIndex: 11
            }}
          />

          {/* Tooltip content with different shapes */}
          <div
            style={{
              position: 'absolute',
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y + 15,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '10px',
              zIndex: 10,
              maxWidth: '250px',
              fontSize: '12px',
              ...(tooltipShape === 'rectangle' && {
                borderRadius: '0px',
              }),
              ...(tooltipShape === 'rounded' && {
                borderRadius: '12px',
              }),
              ...(tooltipShape === 'circle' && {
                borderRadius: '50%',
                width: '220px',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '20px',
              }),
              ...(tooltipShape === 'diamond' && {
                transform: 'rotate(45deg)',
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0',
                overflow: 'hidden',
              }),
              ...(tooltipShape === 'cloud' && {
                borderRadius: '30px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative',
              }),
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Cloud shape bubbles */}
            {tooltipShape === 'cloud' && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '30px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '-35px',
                  left: '60px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }} />
              </>
            )}

            {/* Inner content container for diamond shape */}
            <div style={{
              ...(tooltipShape === 'diamond' && {
                transform: 'rotate(-45deg)',
                padding: '20px',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              })
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: '5px'
              }}>
                <div style={{ fontWeight: 'bold' }}>Canvas Information</div>
                <Button
                  type="text"
                  size="small"
                  onClick={handleCloseTooltip}
                  style={{
                    color: 'white',
                    padding: '0 5px',
                    minWidth: 'auto',
                    marginLeft: '10px'
                  }}
                >
                  X
                </Button>
              </div>
              <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                Position: ({tooltipContent.position?.x}, {tooltipContent.position?.y})
              </div>
              <div style={{ marginBottom: '5px' }}>
                Canvas Size: {tooltipContent.canvasSize?.width} x {tooltipContent.canvasSize?.height}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '3px', marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.3)', paddingTop: '5px' }}>Current Settings:</div>
                <div>Circles: {tooltipContent.settings?.circles}</div>
                <div>Left Panel: {tooltipContent.settings?.panels?.left}</div>
                <div>Right Panel: {tooltipContent.settings?.panels?.right}</div>
                <div>Tooltip Shape: {tooltipShape.charAt(0).toUpperCase() + tooltipShape.slice(1)}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Panel toggle buttons */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
        <Button
          type="primary"
          onClick={toggleLeftPanel}
          style={{ marginRight: '10px' }}
        >
          {showLeftPanel ? 'Hide' : 'Show'} Left Panel
        </Button>
        <Button
          type="primary"
          onClick={toggleRightPanel}
          style={{ marginRight: '10px' }}
        >
          {showRightPanel ? 'Hide' : 'Show'} Right Panel
        </Button>
        <Button
          type="primary"
          onClick={toggleSettingsList}
        >
          {showSettingsList ? 'Hide' : 'Show'} Saved Settings
        </Button>
      </div>

      {/* Saved Settings List */}
      {showSettingsList && (
        <Card
          title="Saved Settings"
          extra={<Button type="text" onClick={toggleSettingsList} size="small">X</Button>}
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: '800px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            zIndex: 2
          }}
        >
          {settings.length === 0 ? (
            <Text>No saved settings yet. Use the left panel to save your current settings.</Text>
          ) : (
            <List
              dataSource={settings}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => handleLoadSettings(item.id)}
                    >
                      Load
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={item.description || 'No description'}
                  />
                  <div>
                    <Text type="secondary">Circles: {item.showCircles ? 'Shown' : 'Hidden'}, Count: {item.circleCount}</Text>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      )}

      {/* Left floating panel */}
      {showLeftPanel && (
        <Card
          title="Control Panel"
          extra={<Button type="text" onClick={toggleLeftPanel} size="small">X</Button>}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            zIndex: 2
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <Text>Show Circles:</Text>
            <div style={{ marginTop: '5px' }}>
              <Switch
                checked={showCircles}
                onChange={setShowCircles}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Text>Circle Count: {circleCount}</Text>
            <Slider
              min={5}
              max={50}
              value={circleCount}
              onChange={setCircleCount}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Text>Active Area Size: {activeAreaSize}px</Text>
            <Slider
              min={20}
              max={100}
              value={activeAreaSize}
              onChange={setActiveAreaSize}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Text>Tooltip Shape:</Text>
            <div style={{ marginTop: '10px' }}>
              <Radio.Group
                value={tooltipShape}
                onChange={(e) => setTooltipShape(e.target.value)}
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

          <Divider style={{ margin: '15px 0' }} />

          <div style={{ marginBottom: '15px' }}>
            <Text strong>Save Current Settings</Text>
            <div style={{ marginTop: '10px' }}>
              <Input
                placeholder="Settings Name"
                value={settingName}
                onChange={(e) => setSettingName(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Input.TextArea
                placeholder="Description (optional)"
                value={settingDescription}
                onChange={(e) => setSettingDescription(e.target.value)}
                rows={2}
                style={{ marginBottom: '10px' }}
              />
              <Button
                type="primary"
                block
                onClick={handleSaveSettings}
                loading={loading}
              >
                Save Settings
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <Button block onClick={resetCanvas}>Reset Settings</Button>
          </div>
        </Card>
      )}

      {/* Right floating panel */}
      {showRightPanel && (
        <Card
          title="Information"
          extra={<Button type="text" onClick={toggleRightPanel} size="small">X</Button>}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '250px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            zIndex: 2
          }}
        >
          <Text>Canvas Statistics:</Text>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li>Circles: {showCircles ? circleCount : 'Hidden'}</li>
            <li>Resolution: Dynamic</li>
            <li>Rendering: 2D Context</li>
          </ul>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '10px', display: 'block' }}>
            Use the control panel to adjust canvas settings.
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Canvas;
