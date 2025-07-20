import React from 'react';
import { Card, Button, Space } from 'antd';
import {
  ExpandAltOutlined,
  ShrinkOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

/**
 * LayoutCard component for displaying content in the screen layout
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The card title
 * @param {string} props.position - The card position (LEFT_1, LEFT_2, RIGHT_1, RIGHT_2)
 * @param {boolean} props.horizontalCollapse - Whether the card is collapsed horizontally
 * @param {boolean} props.verticalCollapse - Whether the card is collapsed vertically
 * @param {boolean} props.titleOnly - Whether only the title is shown
 * @param {boolean} props.expanded - Whether the card is expanded
 * @param {Function} props.onToggleHorizontalCollapse - Function to toggle horizontal collapse
 * @param {Function} props.onToggleVerticalCollapse - Function to toggle vertical collapse
 * @param {Function} props.onToggleTitleOnly - Function to toggle title-only mode
 * @param {Function} props.onToggleExpanded - Function to toggle expanded mode
 * @param {React.ReactNode} props.children - The card content
 */
const LayoutCard = ({
  title,
  position,
  horizontalCollapse = false,
  verticalCollapse = false,
  titleOnly = false,
  expanded = false,
  onToggleHorizontalCollapse,
  onToggleVerticalCollapse,
  onToggleTitleOnly,
  onToggleExpanded,
  children
}) => {
  // Calculate card dimensions based on state
  const getCardStyle = () => {
    // Base style
    const style = {
      margin: '8px',
      transition: 'all 0.3s ease',
    };

    // Apply horizontal collapse
    if (horizontalCollapse) {
      style.width = '120px';
      style.overflow = 'hidden';
    } else if (expanded) {
      style.width = '100%';
      style.height = '100%';
      style.position = 'absolute';
      style.zIndex = 10;
      style.top = 0;
      style.left = 0;
    } else {
      style.width = '100%';
    }

    // Apply vertical collapse
    if (verticalCollapse) {
      style.height = '80px';
      style.overflow = 'hidden';
    } else if (!expanded) {
      style.height = titleOnly ? 'auto' : '100%';
    }

    return style;
  };

  // Extra content for the card header (control buttons)
  const extra = (
    <Space>
      <Button
        type="text"
        icon={horizontalCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleHorizontalCollapse}
        size="small"
        title={horizontalCollapse ? "Expand horizontally" : "Collapse horizontally"}
      />
      <Button
        type="text"
        icon={verticalCollapse ? <ColumnHeightOutlined /> : <ColumnWidthOutlined />}
        onClick={onToggleVerticalCollapse}
        size="small"
        title={verticalCollapse ? "Expand vertically" : "Collapse vertically"}
      />
      <Button
        type="text"
        icon={titleOnly ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleTitleOnly}
        size="small"
        title={titleOnly ? "Show content" : "Show title only"}
      />
      <Button
        type="text"
        icon={expanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
        onClick={onToggleExpanded}
        size="small"
        title={expanded ? "Shrink" : "Expand"}
      />
    </Space>
  );

  return (
    <Card
      title={title}
      extra={extra}
      style={getCardStyle()}
      className={`layout-card layout-card-${position.toLowerCase()}`}
    >
      {!titleOnly && children}
    </Card>
  );
};

export default LayoutCard;
