import React, { Component } from 'react';
import { Alert, Button, Card, Typography, Space, Divider, Tag } from 'antd';
import { BugOutlined, ReloadOutlined, UndoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * Can be used in two ways:
 * 1. As a wrapper around components to catch errors (normal error boundary usage)
 * 2. With props to directly display an error (for use with React Router's errorElement)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: props.hasError || false,
      error: props.error || null,
      errorInfo: props.errorInfo || null
    };
  }

  /**
   * Update state so the next render will show the fallback UI.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Log the error to an error reporting service.
   */
  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  // Update state if props change
  componentDidUpdate(prevProps) {
    if (this.props.hasError !== prevProps.hasError ||
        this.props.error !== prevProps.error ||
        this.props.errorInfo !== prevProps.errorInfo) {
      this.setState({
        hasError: this.props.hasError || false,
        error: this.props.error || null,
        errorInfo: this.props.errorInfo || null
      });
    }
  }

  /**
   * Reset the error state to allow the component to try rendering again.
   */
  handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Card
          style={{
            margin: '30px auto',
            maxWidth: '800px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            borderTop: '5px solid #f5222d',
            overflow: 'hidden'
          }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', color: '#f5222d' }}>
              <BugOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>오류가 발생했습니다</span>
            </div>
          }
        >
          <Alert
            message={
              <Text strong style={{ fontSize: '16px' }}>
                <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
                컴포넌트 렌더링 중 오류가 발생했습니다
              </Text>
            }
            description="아래 정보를 확인하여 문제를 해결하세요."
            type="error"
            showIcon
            style={{
              marginBottom: '24px',
              border: '1px solid #ffccc7',
              backgroundColor: '#fff2f0'
            }}
          />

          <Divider orientation="left">
            <Space>
              <ExclamationCircleOutlined />
              <span>오류 정보</span>
            </Space>
          </Divider>

          <div style={{
            padding: '16px',
            backgroundColor: '#fff2f0',
            borderRadius: '8px',
            border: '1px solid #ffccc7',
            marginBottom: '20px'
          }}>
            <Paragraph>
              <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '8px' }}>오류 메시지:</Text>
              <Tag color="error" style={{
                padding: '8px 12px',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'normal',
                height: 'auto'
              }}>
                {this.state.error?.toString()}
              </Tag>
            </Paragraph>
          </div>

          {this.state.errorInfo && (
            <div>
              <Divider orientation="left">
                <Space>
                  <BugOutlined />
                  <span>컴포넌트 스택</span>
                </Space>
              </Divider>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9',
                  overflow: 'auto',
                  maxHeight: '300px'
                }}
              >
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontSize: '13px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            </div>
          )}

          <Divider />

          <Space style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              type="primary"
              size="large"
              icon={<UndoOutlined />}
              onClick={this.handleReset}
              style={{ minWidth: '120px' }}
            >
              다시 시도
            </Button>
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              style={{ minWidth: '120px' }}
            >
              페이지 새로고침
            </Button>
          </Space>
        </Card>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
