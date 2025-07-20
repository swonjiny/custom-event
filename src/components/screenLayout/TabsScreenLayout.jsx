import React from 'react';
import { Tabs, Typography, Divider, Spin, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import ScreenLayout from './ScreenLayout';

const { Title } = Typography;
const { TabPane } = Tabs;

/**
 * TabsScreenLayout component for displaying multiple screen layouts in tabs
 *
 * @param {Object} props - Component props
 * @param {Array} props.openLayouts - Array of open layouts to display in tabs
 * @param {Function} props.onCloseLayout - Function to call when a layout tab is closed
 * @param {Function} props.onSaveLayout - Function to call when a layout is saved
 * @param {boolean} props.loading - Whether the component is in a loading state
 */
const TabsScreenLayout = ({ openLayouts = [], onCloseLayout, onSaveLayout, loading = false }) => {
  if (!openLayouts || openLayouts.length === 0) return null;

  // Custom close button for each tab
  const renderTabBar = (props, DefaultTabBar) => {
    return (
      <DefaultTabBar {...props}>
        {(node) => {
          // Add close button to each tab
          const layoutId = node.key;
          return (
            <div style={{ marginRight: 16 }}>
              {node}
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseLayout(layoutId);
                }}
                style={{ marginLeft: 8 }}
              />
            </div>
          );
        }}
      </DefaultTabBar>
    );
  };

  return (
    <Tabs
      type="card"
      renderTabBar={renderTabBar}
      className="layout-tabs"
    >
      {openLayouts.map(layout => (
        <TabPane
          tab={layout.name}
          key={layout.layoutId}
        >
          <Spin spinning={loading} tip="로딩 중...">
            <div className="layout-detail">
              <ScreenLayout
                initialLayout={layout}
                layoutId={layout.layoutId}
                onSave={onSaveLayout}
              />
            </div>
          </Spin>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default TabsScreenLayout;
