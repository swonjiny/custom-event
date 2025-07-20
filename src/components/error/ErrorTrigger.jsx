import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { BugOutlined } from '@ant-design/icons';

/**
 * ErrorTrigger component that provides a button to forcibly trigger an error.
 * This is useful for testing error boundaries.
 */
const ErrorTrigger = () => {
  const [shouldError, setShouldError] = useState(false);

  // This will cause an error when shouldError is true
  if (shouldError) {
    // Intentionally throw an error for testing purposes
    throw new Error('This is a test error triggered by the ErrorTrigger component');
  }

  return (
    <Tooltip title="에러 발생 테스트">
      <Button
        type="primary"
        danger
        icon={<BugOutlined />}
        onClick={() => setShouldError(true)}
        style={{ marginLeft: '10px' }}
      >
        에러 발생
      </Button>
    </Tooltip>
  );
};

export default ErrorTrigger;
