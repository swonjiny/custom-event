import React from 'react';
import { Tabs, Typography, Divider, Spin, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * TabsNoticeDetail component for displaying multiple notice details in tabs
 *
 * @param {Object} props - Component props
 * @param {Array} props.openNotices - Array of open notices to display in tabs
 * @param {Function} props.onCloseNotice - Function to call when a notice tab is closed
 * @param {boolean} props.loading - Whether the component is in a loading state
 */
const TabsNoticeDetail = ({ openNotices = [], onCloseNotice, loading = false }) => {
  if (!openNotices || openNotices.length === 0) return null;

  // Custom close button for each tab
  const renderTabBar = (props, DefaultTabBar) => {
    return (
      <DefaultTabBar {...props}>
        {(node) => {
          // Add close button to each tab
          const noticeId = node.key;
          return (
            <div style={{ marginRight: 16 }}>
              {node}
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseNotice(noticeId);
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
      className="notice-tabs"
    >
      {openNotices.map(notice => (
        <TabPane
          tab={notice.title}
          key={notice.id}
        >
          <Spin spinning={loading} tip="로딩 중...">
            <div className="notice-detail">
              <Title level={3}>{notice.title}</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Text type="secondary">작성일: {notice.createdAt}</Text>
                {notice.updatedAt && (
                  <Text type="secondary">수정일: {notice.updatedAt}</Text>
                )}
              </div>
              <Divider />
              <div
                className="notice-content"
                dangerouslySetInnerHTML={{ __html: notice.content }}
                style={{
                  padding: '20px',
                  minHeight: '200px',
                  overflow: 'auto',
                  maxHeight: '500px',
                  overflowX: 'auto',
                  wordWrap: 'break-word',
                  maxWidth: '100%'
                }}
              />
            </div>
          </Spin>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default TabsNoticeDetail;
