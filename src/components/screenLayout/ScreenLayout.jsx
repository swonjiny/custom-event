import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, message } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import LayoutCard from './LayoutCard';
import CentralMenu from './CentralMenu';
import { createScreenLayout, updateScreenLayout, getScreenLayoutById } from '../../services/screenLayoutService';

const { Title } = Typography;

/**
 * ScreenLayout component for managing the overall screen layout
 *
 * @param {Object} props - Component props
 * @param {Object} props.initialLayout - Initial layout data (optional)
 * @param {number} props.layoutId - ID of an existing layout to load (optional)
 * @param {Function} props.onSave - Callback function when layout is saved
 */
const ScreenLayout = ({ initialLayout, layoutId, onSave }) => {
  // State for the layout
  const [layout, setLayout] = useState({
    name: '기본 레이아웃',
    cards: [
      {
        position: 'LEFT_1',
        title: '왼쪽 상단 카드',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false
      },
      {
        position: 'LEFT_2',
        title: '왼쪽 하단 카드',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false
      },
      {
        position: 'RIGHT_1',
        title: '오른쪽 상단 카드',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false
      },
      {
        position: 'RIGHT_2',
        title: '오른쪽 하단 카드',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false
      }
    ],
    centralMenu: {
      priority: false,
      expanded: false,
      menuVisible: true
    }
  });

  const [loading, setLoading] = useState(false);

  // Load initial layout or fetch from API if layoutId is provided
  useEffect(() => {
    if (initialLayout) {
      setLayout(initialLayout);
    } else if (layoutId) {
      fetchLayout(layoutId);
    }
  }, [initialLayout, layoutId]);

  // Fetch layout from API
  const fetchLayout = async (id) => {
    try {
      setLoading(true);
      const data = await getScreenLayoutById(id);
      setLayout(data);
    } catch (error) {
      message.error('레이아웃을 불러오는데 실패했습니다.');
      console.error('Failed to fetch layout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save layout to API
  const saveLayout = async () => {
    try {
      setLoading(true);
      let response;

      if (layoutId) {
        response = await updateScreenLayout(layoutId, layout);
        message.success('레이아웃이 업데이트되었습니다.');
      } else {
        response = await createScreenLayout(layout);
        message.success('새 레이아웃이 생성되었습니다.');
      }

      if (onSave) {
        onSave(response);
      }
    } catch (error) {
      message.error('레이아웃 저장에 실패했습니다.');
      console.error('Failed to save layout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update a card's state
  const updateCard = (position, field, value) => {
    const newCards = layout.cards.map(card => {
      if (card.position === position) {
        // If expanding this card, collapse all others
        if (field === 'expanded' && value === true) {
          return { ...card, [field]: value, horizontalCollapse: false, verticalCollapse: false, titleOnly: false };
        }
        return { ...card, [field]: value };
      } else if (field === 'expanded' && value === true) {
        // If expanding one card, collapse all others
        return { ...card, expanded: false };
      }
      return card;
    });

    setLayout({ ...layout, cards: newCards });
  };

  // Toggle a card's state
  const toggleCardState = (position, field) => {
    const card = layout.cards.find(c => c.position === position);
    if (card) {
      updateCard(position, field, !card[field]);
    }
  };

  // Update central menu state
  const updateCentralMenu = (field, value) => {
    // If expanding central menu and it has priority, collapse all cards
    if (field === 'expanded' && value === true && layout.centralMenu?.priority) {
      const newCards = layout.cards.map(card => ({
        ...card,
        horizontalCollapse: true,
        expanded: false
      }));

      setLayout({
        ...layout,
        cards: newCards,
        centralMenu: { ...layout.centralMenu, [field]: value }
      });
    } else {
      setLayout({
        ...layout,
        centralMenu: { ...layout.centralMenu, [field]: value }
      });
    }
  };

  // Toggle central menu state
  const toggleCentralMenuState = (field) => {
    updateCentralMenu(field, !layout.centralMenu?.[field]);
  };

  // Get a card by position
  const getCard = (position) => {
    return layout.cards?.find(card => card.position === position);
  };

  // Render a card
  const renderCard = (position) => {
    const card = getCard(position);
    if (!card) return null;

    return (
      <LayoutCard
        title={card.title}
        position={position}
        horizontalCollapse={card.horizontalCollapse}
        verticalCollapse={card.verticalCollapse}
        titleOnly={card.titleOnly}
        expanded={card.expanded}
        onToggleHorizontalCollapse={() => toggleCardState(position, 'horizontalCollapse')}
        onToggleVerticalCollapse={() => toggleCardState(position, 'verticalCollapse')}
        onToggleTitleOnly={() => toggleCardState(position, 'titleOnly')}
        onToggleExpanded={() => toggleCardState(position, 'expanded')}
      >
        <div style={{ padding: '16px' }}>
          <p>카드 내용 - {position}</p>
          <p>이 영역에 실제 컨텐츠가 들어갑니다.</p>
        </div>
      </LayoutCard>
    );
  };

  return (
    <div className="screen-layout" style={{ position: 'relative', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>{layout.name}</Title>
        <div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={saveLayout}
            loading={loading}
            style={{ marginRight: '8px' }}
          >
            저장
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => layoutId && fetchLayout(layoutId)}
            disabled={!layoutId || loading}
          >
            새로고침
          </Button>
        </div>
      </div>

      <Row gutter={16} style={{ height: '100%' }}>
        {/* Left Column */}
        <Col span={12} style={{ height: '100%' }}>
          <div style={{ height: '50%' }}>
            {renderCard('LEFT_1')}
          </div>
          <div style={{ height: '50%' }}>
            {renderCard('LEFT_2')}
          </div>
        </Col>

        {/* Right Column */}
        <Col span={12} style={{ height: '100%' }}>
          <div style={{ height: '50%' }}>
            {renderCard('RIGHT_1')}
          </div>
          <div style={{ height: '50%' }}>
            {renderCard('RIGHT_2')}
          </div>
        </Col>
      </Row>

      {/* Central Menu */}
      <CentralMenu
        priority={layout.centralMenu?.priority}
        expanded={layout.centralMenu?.expanded}
        menuVisible={layout.centralMenu?.menuVisible}
        onTogglePriority={() => toggleCentralMenuState('priority')}
        onToggleExpanded={() => toggleCentralMenuState('expanded')}
        onToggleMenuVisible={() => toggleCentralMenuState('menuVisible')}
      >
        <div style={{ padding: '16px' }}>
          <p>중앙 메뉴 내용</p>
          <p>이 영역에 중앙 메뉴의 실제 컨텐츠가 들어갑니다.</p>
        </div>
      </CentralMenu>
    </div>
  );
};

export default ScreenLayout;
