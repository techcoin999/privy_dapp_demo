import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="max-w-xl w-full bg-white rounded-xl shadow p-6 text-center">
            <h1 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-600 break-all">
              {String(this.state.error)}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

