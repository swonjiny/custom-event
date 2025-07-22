import React, { useState } from 'react';
import { Card, Space, Button } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  HomeOutlined
} from '@ant-design/icons';

/**
 * IconPanel component for displaying a vertical list of selectable icons
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The panel title
 * @param {string} props.position - The panel position identifier
 * @param {Function} props.onIconSelect - Callback function when an icon is selected
 */
const IconPanel = ({
  title,
  position,
  onIconSelect
}) => {
  // State to track which icon is selected
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Define the icons to display
  const icons = [
    { key: 'home', icon: <HomeOutlined />, title: '홈' },
    { key: 'user', icon: <UserOutlined />, title: '사용자' },
    { key: 'notification', icon: <BellOutlined />, title: '알림' },
    { key: 'apps', icon: <AppstoreOutlined />, title: '앱' },
    { key: 'settings', icon: <SettingOutlined />, title: '설정' }
  ];

  // Handle icon selection
  const handleIconClick = (iconKey) => {
    setSelectedIcon(iconKey);
    if (onIconSelect) {
      onIconSelect(iconKey);
    }
  };

  return (
    <Card
      title={title}
      className={`icon-panel icon-panel-${position.toLowerCase()}`}
      style={{
        margin: '8px',
        height: 'calc(100% - 16px)',
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        flex: 1
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {icons.map((icon) => (
          <Button
            key={icon.key}
            type={selectedIcon === icon.key ? 'primary' : 'default'}
            icon={icon.icon}
            onClick={() => handleIconClick(icon.key)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '40px'
            }}
            title={icon.title}
          />
        ))}
      </Space>
    </Card>
  );
};

export default IconPanel;
