import React from 'react';
import { Card, Button, Space } from 'antd';
import {
  ExpandAltOutlined,
  ShrinkOutlined,
  StarOutlined,
  StarFilled,
  MenuOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

/**
 * CentralMenu component for the bottom center of the screen layout
 *
 * @param {Object} props - Component props
 * @param {boolean} props.priority - Whether the menu has priority over other cards
 * @param {boolean} props.expanded - Whether the menu is expanded
 * @param {boolean} props.menuVisible - Whether the menu content is visible
 * @param {Function} props.onTogglePriority - Function to toggle priority
 * @param {Function} props.onToggleExpanded - Function to toggle expanded state
 * @param {Function} props.onToggleMenuVisible - Function to toggle menu visibility
 * @param {React.ReactNode} props.children - The menu content
 */
const CentralMenu = ({
  priority = false,
  expanded = false,
  menuVisible = true,
  onTogglePriority,
  onToggleExpanded,
  onToggleMenuVisible,
  children
}) => {
  // Calculate menu dimensions and position based on state
  const getMenuStyle = () => {
    // Base style
    const style = {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: expanded ? '100%' : '300px',
      transition: 'all 0.3s ease',
      zIndex: priority ? 20 : 5,
      marginBottom: expanded ? 0 : '16px',
    };

    // Apply expanded state
    if (expanded) {
      style.height = 'calc(100% - 64px)'; // Subtract header height
      style.top = '64px'; // Position below header
      style.bottom = 0;
      style.left = 0;
      style.transform = 'none';
    }

    return style;
  };

  // Extra content for the card header (control buttons)
  const extra = (
    <Space>
      <Button
        type="text"
        icon={priority ? <StarFilled /> : <StarOutlined />}
        onClick={onTogglePriority}
        size="small"
        title={priority ? "Remove priority" : "Set as priority"}
      />
      <Button
        type="text"
        icon={expanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
        onClick={onToggleExpanded}
        size="small"
        title={expanded ? "Collapse" : "Expand"}
      />
      {expanded && (
        <Button
          type="text"
          icon={menuVisible ? <MenuFoldOutlined /> : <MenuOutlined />}
          onClick={onToggleMenuVisible}
          size="small"
          title={menuVisible ? "Hide menu" : "Show menu"}
        />
      )}
    </Space>
  );

  // Render restore button when menu is hidden
  const renderRestoreButton = () => {
    if (!menuVisible && expanded) {
      return (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={onToggleMenuVisible}
          size="small"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 30
          }}
        >
          메뉴 복귀
        </Button>
      );
    }
    return null;
  };

  // Get additional style for when header is hidden
  const getContentStyle = () => {
    if (!menuVisible && expanded) {
      return {
        padding: 0,
        height: '100%',
        overflow: 'auto'
      };
    }
    return {};
  };

  return (
    <>
      <Card
        title={menuVisible ? "하단 패널" : null}
        extra={menuVisible ? extra : null}
        style={getMenuStyle()}
        bodyStyle={getContentStyle()}
        className={`central-menu ${expanded ? 'expanded' : ''} ${priority ? 'priority' : ''} ${menuVisible ? '' : 'menu-hidden'}`}
      >
        {expanded && !menuVisible ? children : (menuVisible && children)}
      </Card>
      {renderRestoreButton()}
    </>
  );
};

export default CentralMenu;
