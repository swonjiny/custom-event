import React from 'react';
import { useRouteError } from 'react-router-dom';
import ErrorBoundary from '../components/error/ErrorBoundary';

/**
 * ErrorPage component that displays when a route encounters an error.
 * It uses the ErrorBoundary component to display a user-friendly error message.
 */
const ErrorPage = () => {
  // Get the error from the route
  const error = useRouteError();

  // Create an error info object similar to what componentDidCatch receives
  const errorInfo = {
    componentStack: error?.stack || 'No stack trace available'
  };

  // Render the ErrorBoundary with the error manually set
  return (
    <div className="error-page">
      <ErrorBoundaryWrapper error={error} errorInfo={errorInfo} />
    </div>
  );
};

/**
 * A wrapper component that simulates an error boundary with pre-set error state.
 * This allows us to use the ErrorBoundary component with the useRouteError hook.
 */
class ErrorBoundaryWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: true,
      error: props.error || new Error('Unknown error'),
      errorInfo: props.errorInfo || { componentStack: 'No stack trace available' }
    };
  }

  handleReset = () => {
    // Navigate back to the home page or previous page
    window.history.back();
  };

  render() {
    // Create a new instance of ErrorBoundary with our state
    return (
      <div style={{ width: '100%', padding: '20px' }}>
        <ErrorBoundary
          hasError={this.state.hasError}
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        >
          {/* Children are not rendered when hasError is true */}
          <div>This content will not be shown when there's an error</div>
        </ErrorBoundary>
      </div>
    );
  }
}

export default ErrorPage;
