import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, message, Table, Image, Statistic, Card as AntCard, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined,
  UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import LayoutCard from './LayoutCard';
import IconPanel from './IconPanel';
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
        title: '왼쪽 상단 패널',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false,
        horizontalExpand: false
      },
      {
        position: 'LEFT_2',
        title: '왼쪽 하단 패널',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false,
        horizontalExpand: false
      },
      {
        position: 'RIGHT_HALF',
        title: '오른쪽 중간 패널',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false,
        horizontalExpand: false
      },
      {
        position: 'RIGHT_FULL',
        title: '오른쪽 전체 패널',
        horizontalCollapse: false,
        verticalCollapse: false,
        titleOnly: false,
        expanded: false,
        horizontalExpand: false
      }
    ],
    icons: [
      {
        position: 'RIGHT_TOP',
        title: '상단 아이콘'
      },
      {
        position: 'RIGHT_BOTTOM',
        title: '하단 아이콘'
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
          return {
            ...card,
            [field]: value,
            horizontalCollapse: false,
            verticalCollapse: false,
            titleOnly: false,
            horizontalExpand: false
          };
        }
        // If horizontally expanding, ensure it's not horizontally collapsed
        else if (field === 'horizontalExpand' && value === true) {
          return { ...card, [field]: value, horizontalCollapse: false };
        }
        // If horizontally collapsing, ensure it's not horizontally expanded
        else if (field === 'horizontalCollapse' && value === true) {
          return { ...card, [field]: value, horizontalExpand: false };
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

  // Remove a card from the layout
  const removeCard = (position) => {
    const newCards = layout.cards.filter(card => card.position !== position);
    setLayout({ ...layout, cards: newCards });
    message.success(`패널이 제거되었습니다.`);
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

  // Get an icon panel by position
  const getIconPanel = (position) => {
    return layout.icons?.find(icon => icon.position === position);
  };

  // Sample data for tables
  const tableData = [
    { key: '1', name: '홍길동', age: 32, address: '서울시 강남구', status: '활성' },
    { key: '2', name: '김철수', age: 42, address: '서울시 서초구', status: '비활성' },
    { key: '3', name: '이영희', age: 28, address: '서울시 송파구', status: '활성' },
    { key: '4', name: '박민수', age: 35, address: '서울시 마포구', status: '활성' },
  ];

  const tableColumns = [
    { title: '이름', dataIndex: 'name', key: 'name' },
    { title: '나이', dataIndex: 'age', key: 'age' },
    { title: '주소', dataIndex: 'address', key: 'address' },
    { title: '상태', dataIndex: 'status', key: 'status' },
  ];

  // Render a card
  const renderCard = (position) => {
    const card = getCard(position);
    if (!card) return null;

    // Different content based on position
    let content;

    if (position === 'LEFT_1') {
      content = (
        <div style={{ padding: '16px' }}>
          <h3>사용자 목록</h3>
          <Table dataSource={tableData} columns={tableColumns} size="small" pagination={false} />
        </div>
      );
    } else if (position === 'LEFT_2') {
      content = (
        <div style={{ padding: '16px' }}>
          <h3>통계 대시보드</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <AntCard>
                <Statistic
                  title="활성 사용자"
                  value={1128}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </AntCard>
            </Col>
            <Col span={12}>
              <AntCard>
                <Statistic
                  title="매출"
                  value={9280}
                  prefix={<DollarOutlined />}
                  suffix="만원"
                  valueStyle={{ color: '#cf1322' }}
                />
              </AntCard>
            </Col>
          </Row>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
              <p>매출 차트</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <LineChartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
              <p>트래픽 차트</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PieChartOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />
              <p>사용자 분포</p>
            </div>
          </div>
        </div>
      );
    } else if (position === 'RIGHT_HALF') {
      content = (
        <div style={{ padding: '16px' }}>
          <h3>이미지 갤러리</h3>
          <div style={{ textAlign: 'center' }}>
            <Image
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              placeholder={
                <div style={{
                  width: 200,
                  height: 150,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: '#f5f5f5'
                }}>
                  이미지 로딩 중...
                </div>
              }
              preview={{
                mask: '이미지 보기'
              }}
            />
            <p style={{ marginTop: '8px' }}>샘플 이미지</p>
          </div>
        </div>
      );
    } else if (position === 'RIGHT_FULL') {
      // Sample data for product table
      const productData = [
        { key: '1', name: '노트북', price: 1200000, stock: 15, category: '전자기기' },
        { key: '2', name: '스마트폰', price: 980000, stock: 23, category: '전자기기' },
        { key: '3', name: '무선이어폰', price: 220000, stock: 8, category: '액세서리' },
      ];

      const productColumns = [
        { title: '제품명', dataIndex: 'name', key: 'name' },
        { title: '가격', dataIndex: 'price', key: 'price', render: price => `${price.toLocaleString()}원` },
        { title: '재고', dataIndex: 'stock', key: 'stock' },
        { title: '카테고리', dataIndex: 'category', key: 'category' },
      ];

      content = (
        <div style={{ padding: '16px' }}>
          <h3>종합 대시보드</h3>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <h4>인기 제품</h4>
                <Table dataSource={productData} columns={productColumns} size="small" pagination={false} />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h4>월간 판매량</h4>
                <BarChartOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                <p>차트 이미지</p>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <AntCard>
                <Statistic
                  title="총 주문"
                  value={152}
                  valueStyle={{ color: '#3f8600' }}
                />
              </AntCard>
            </Col>
            <Col span={8}>
              <AntCard>
                <Statistic
                  title="신규 고객"
                  value={28}
                  valueStyle={{ color: '#1890ff' }}
                />
              </AntCard>
            </Col>
            <Col span={8}>
              <AntCard>
                <Statistic
                  title="매출 달성률"
                  value={78.5}
                  suffix="%"
                  valueStyle={{ color: '#cf1322' }}
                />
              </AntCard>
            </Col>
          </Row>
        </div>
      );
    } else {
      content = (
        <div style={{ padding: '16px' }}>
          <p>패널 내용 - {position}</p>
          <p>이 영역에 실제 컨텐츠가 들어갑니다.</p>
        </div>
      );
    }

    return (
      <LayoutCard
        title={card.title}
        position={position}
        horizontalCollapse={card.horizontalCollapse}
        verticalCollapse={card.verticalCollapse}
        titleOnly={card.titleOnly}
        expanded={card.expanded}
        horizontalExpand={card.horizontalExpand}
        onToggleHorizontalCollapse={() => toggleCardState(position, 'horizontalCollapse')}
        onToggleVerticalCollapse={() => toggleCardState(position, 'verticalCollapse')}
        onToggleTitleOnly={() => toggleCardState(position, 'titleOnly')}
        onToggleExpanded={() => toggleCardState(position, 'expanded')}
        onToggleHorizontalExpand={() => toggleCardState(position, 'horizontalExpand')}
        onRemove={() => removeCard(position)}
      >
        {content}
      </LayoutCard>
    );
  };

  // Render an icon panel
  const renderIconPanel = (position) => {
    const iconPanel = getIconPanel(position);
    if (!iconPanel) return null;

    return (
      <IconPanel
        title={iconPanel.title}
        position={position}
        onIconSelect={(iconKey) => console.log(`Icon ${iconKey} selected from ${position}`)}
      />
    );
  };

  return (
    <div className="screen-layout" style={{
      position: 'relative',
      height: 'calc(100vh - 200px)',
      minHeight: '600px',
      background: '#f0f2f5',
      padding: '16px',
      borderRadius: '8px'
    }}>
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
        {/* Left Column - 2 panel components */}
        <Col span={8} style={{ height: '100%' }}>
          <div style={{ height: '50%' }}>
            {renderCard('LEFT_1')}
          </div>
          <div style={{ height: '50%' }}>
            {renderCard('LEFT_2')}
          </div>
        </Col>

        {/* Right Column - Icon components and panels */}
        <Col span={16} style={{ height: '100%', display: 'flex' }}>
          {/* Right side panels */}
          <div style={{ flex: 1, height: '100%', display: 'flex' }}>
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Half-height panel */}
              <div style={{ height: '50%' }}>
                {renderCard('RIGHT_HALF')}
              </div>
              <div style={{ height: '50%' }}></div> {/* Empty space below half-height panel */}
            </div>

            {/* Full-height panel */}
            <div style={{ width: '50%', height: '100%' }}>
              {renderCard('RIGHT_FULL')}
            </div>
          </div>

          {/* Icon panels on the right edge */}
          <div style={{ width: '80px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '50%' }}>
              {renderIconPanel('RIGHT_TOP')}
            </div>
            <div style={{ height: '50%' }}>
              {renderIconPanel('RIGHT_BOTTOM')}
            </div>
          </div>
        </Col>
      </Row>

      {/* Central Menu - Expandable bottom panel */}
      <CentralMenu
        priority={layout.centralMenu?.priority}
        expanded={layout.centralMenu?.expanded}
        menuVisible={layout.centralMenu?.menuVisible}
        onTogglePriority={() => toggleCentralMenuState('priority')}
        onToggleExpanded={() => toggleCentralMenuState('expanded')}
        onToggleMenuVisible={() => toggleCentralMenuState('menuVisible')}
      >
        <div style={{ padding: '16px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>종합 정보 대시보드</h2>

          <Row gutter={[24, 24]}>
            {/* 왼쪽 섹션 - 이미지 갤러리 */}
            <Col span={8}>
              <AntCard title="최근 이미지">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  <Image
                    width={100}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    preview={{ mask: '보기' }}
                  />
                  <Image
                    width={100}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    preview={{ mask: '보기' }}
                  />
                  <Image
                    width={100}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    preview={{ mask: '보기' }}
                  />
                  <Image
                    width={100}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    preview={{ mask: '보기' }}
                  />
                </div>
              </AntCard>
            </Col>

            {/* 중앙 섹션 - 통계 */}
            <Col span={8}>
              <AntCard title="주요 통계">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="총 방문자"
                      value={4203}
                      prefix={<UserOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="총 주문"
                      value={253}
                      prefix={<ShoppingCartOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="매출"
                      value={1250}
                      suffix="만원"
                      prefix={<DollarOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="성장률"
                      value={15.2}
                      suffix="%"
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                </Row>
              </AntCard>
            </Col>

            {/* 오른쪽 섹션 - 테이블 */}
            <Col span={8}>
              <AntCard title="최근 거래">
                <Table
                  dataSource={[
                    { key: '1', date: '2025-07-22', customer: '김철수', amount: 125000, status: '완료' },
                    { key: '2', date: '2025-07-21', customer: '이영희', amount: 85000, status: '완료' },
                    { key: '3', date: '2025-07-20', customer: '박민수', amount: 210000, status: '진행중' }
                  ]}
                  columns={[
                    { title: '날짜', dataIndex: 'date', key: 'date' },
                    { title: '고객', dataIndex: 'customer', key: 'customer' },
                    { title: '금액', dataIndex: 'amount', key: 'amount', render: amount => `${amount.toLocaleString()}원` },
                    { title: '상태', dataIndex: 'status', key: 'status' }
                  ]}
                  size="small"
                  pagination={false}
                />
              </AntCard>
            </Col>
          </Row>

          <Divider />

          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            이 패널은 선택하면 화면 전체를 꽉 채우고 다시 버튼을 선택하면 원상태로 돌아갑니다.
            <br />
            확장 버튼을 클릭하여 전체 화면으로 전환하세요.
          </p>
        </div>
      </CentralMenu>
    </div>
  );
};

export default ScreenLayout;
