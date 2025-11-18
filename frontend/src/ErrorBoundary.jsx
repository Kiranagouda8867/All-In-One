import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error to the console so it appears in the devtools/terminal
    // and is visible to the developer.
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-xl font-bold text-red-600 mb-2">An error occurred</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{String(this.state.error)}</pre>
            <p className="text-sm text-gray-500 mt-4">Check the DevTools console for a full stack trace.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
