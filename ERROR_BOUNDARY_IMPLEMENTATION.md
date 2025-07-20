# Error Boundary Implementation

This document describes the error boundary implementation in the application.

## Overview

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire component tree. They were introduced in React 16 and are implemented using the `componentDidCatch()` lifecycle method or the static `getDerivedStateFromError()` method.

The application now includes:
1. An `ErrorBoundary` component that catches errors and displays a fallback UI
2. An `ErrorTrigger` component with a button that can forcibly trigger an error for testing
3. Integration of these components in the application layout

## Components

### ErrorBoundary

The `ErrorBoundary` component (`src/components/error/ErrorBoundary.jsx`) is a class component that:
- Catches JavaScript errors in its child component tree
- Logs those errors to the console (can be extended to log to an error reporting service)
- Displays a fallback UI with error information when an error occurs
- Provides buttons to reset the error state or reload the page

The fallback UI includes:
- An error alert message
- The error message
- The component stack trace
- Buttons to try again or reload the page

### ErrorTrigger

The `ErrorTrigger` component (`src/components/error/ErrorTrigger.jsx`) is a functional component that:
- Provides a button with a bug icon and "에러 발생" (Error Occurrence) text
- Throws an error when the button is clicked
- Includes a tooltip explaining the button's purpose

This component is useful for testing the error boundary functionality.

## Integration

The error boundary is integrated into the application in the following ways:

1. The `ErrorTrigger` button is added to the Header section of the Layout component, next to the application title:
   ```jsx
   <div style={{ color: 'white', marginRight: '20px', display: 'flex', alignItems: 'center' }}>
     <Title level={4} style={{ color: 'white', margin: 0 }}>
       React App
     </Title>
     <ErrorTrigger />
   </div>
   ```

2. The `ErrorBoundary` component wraps the `Outlet` component in the Layout component, which renders the current route's component:
   ```jsx
   <Content style={{ padding: '0', marginTop: '16px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
     <ErrorBoundary>
       <Outlet />
     </ErrorBoundary>
   </Content>
   ```

This ensures that any errors that occur in the route components (Home, About, Canvas, Notice, Board, DatabaseConfig, ScreenLayoutPage) will be caught by the ErrorBoundary, and the fallback UI will be displayed instead of crashing the entire application.

## Testing

To test the error boundary functionality:

1. Run the application
2. Click the "에러 발생" (Error Occurrence) button in the header
3. Observe that the error boundary catches the error and displays the fallback UI
4. Click the "다시 시도" (Try Again) button to reset the error state
5. Observe that the application returns to its normal state

## Limitations

Error boundaries have some limitations:

1. They only catch errors in the component tree below them
2. They do not catch errors in:
   - Event handlers
   - Asynchronous code (e.g., `setTimeout` or `requestAnimationFrame` callbacks)
   - Server-side rendering
   - Errors thrown in the error boundary itself

For errors in event handlers, you can use regular try-catch statements.

## Best Practices

1. Use error boundaries to gracefully handle unexpected errors in the UI
2. Place error boundaries strategically to isolate parts of the application from each other
3. Consider providing a way for users to report errors when they occur
4. Log errors to an error reporting service for monitoring and debugging

## Conclusion

The error boundary implementation provides a more robust user experience by ensuring that errors in one part of the application do not crash the entire UI. The ability to forcibly trigger errors for testing makes it easier to verify that the error boundary is working correctly.
