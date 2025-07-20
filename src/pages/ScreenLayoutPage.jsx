import React, { useState, useEffect } from 'react';
import { Typography, Button, List, Modal, Input, Spin, Popconfirm, message, Divider, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ScreenLayout from '../components/screenLayout/ScreenLayout';
import TabsScreenLayout from '../components/screenLayout/TabsScreenLayout';
import { getScreenLayouts, deleteScreenLayout, getScreenLayoutById } from '../services/screenLayoutService';

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * ScreenLayoutPage component for displaying and managing screen layouts
 */
const ScreenLayoutPage = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [openLayouts, setOpenLayouts] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Fetch layouts when component mounts
  useEffect(() => {
    fetchLayouts();
  }, []);

  // Fetch layouts from API
  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const data = await getScreenLayouts();
      setLayouts(data || []);
    } catch (error) {
      message.error('레이아웃을 불러오는데 실패했습니다.');
      console.error('Failed to fetch layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open a layout in a tab
  const openLayoutTab = async (layout) => {
    try {
      setLoading(true);
      // Fetch the latest layout data from the API
      const latestLayout = await getScreenLayoutById(layout.layoutId);

      // Check if the layout is already open in a tab
      if (!openLayouts.some(l => l.layoutId === latestLayout.layoutId)) {
        setOpenLayouts([...openLayouts, latestLayout]);
      }
    } catch (error) {
      message.error('레이아웃 상세 정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch layout details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Close a layout tab
  const closeLayoutTab = (layoutId) => {
    setOpenLayouts(openLayouts.filter(layout => layout.layoutId !== parseInt(layoutId)));
  };

  // Handle layout deletion
  const handleDeleteLayout = async (layoutId) => {
    try {
      setLoading(true);
      await deleteScreenLayout(layoutId);
      message.success('레이아웃이 삭제되었습니다.');

      // Remove from open tabs if it's open
      setOpenLayouts(openLayouts.filter(layout => layout.layoutId !== layoutId));

      // Refresh the layouts list
      fetchLayouts();
    } catch (error) {
      message.error('레이아웃 삭제에 실패했습니다.');
      console.error('Failed to delete layout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle layout save
  const handleSaveLayout = () => {
    fetchLayouts();
    setIsCreateMode(false);
    setSelectedLayout(null);
    message.success('레이아웃이 저장되었습니다.');
  };

  // Filter layouts based on search text
  const filteredLayouts = layouts.filter(layout =>
    layout.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>화면 레이아웃</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateMode(true)}
        >
          새 레이아웃
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Search
          placeholder="레이아웃 이름으로 검색"
          allowClear
          enterButton="검색"
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => setSearchText(value)}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Spin spinning={loading}>
            {filteredLayouts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={filteredLayouts}
                renderItem={layout => (
                  <List.Item
                    actions={[
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => openLayoutTab(layout)}
                      >
                        보기
                      </Button>,
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedLayout(layout);
                          setIsCreateMode(true);
                        }}
                      >
                        수정
                      </Button>,
                      <Popconfirm
                        title="이 레이아웃을 삭제하시겠습니까?"
                        onConfirm={() => handleDeleteLayout(layout.layoutId)}
                        okText="예"
                        cancelText="아니오"
                      >
                        <Button danger icon={<DeleteOutlined />}>
                          삭제
                        </Button>
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      title={layout.name}
                      description={
                        <div>
                          <Text type="secondary">카드 수: {layout.cards?.length || 0}</Text>
                          <br />
                          <Text type="secondary">ID: {layout.layoutId}</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                {searchText ? '검색 결과가 없습니다.' : '레이아웃이 없습니다. 새 레이아웃을 생성해주세요.'}
              </div>
            )}
          </Spin>
        </Col>
      </Row>

      {openLayouts.length > 0 && (
        <>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <TabsScreenLayout
                openLayouts={openLayouts}
                onCloseLayout={closeLayoutTab}
                onSaveLayout={handleSaveLayout}
                loading={loading}
              />
            </Col>
          </Row>
        </>
      )}

      {/* Create/Edit Layout Modal */}
      <Modal
        title={selectedLayout ? '레이아웃 수정' : '새 레이아웃 생성'}
        open={isCreateMode}
        onCancel={() => {
          setIsCreateMode(false);
          setSelectedLayout(null);
        }}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <ScreenLayout
          initialLayout={selectedLayout}
          layoutId={selectedLayout?.layoutId}
          onSave={handleSaveLayout}
        />
      </Modal>
    </div>
  );
};

export default ScreenLayoutPage;
