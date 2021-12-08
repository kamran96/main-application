import React from 'react';

interface IProps {
  children: React.ReactElement<any>;
}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>Error Occured</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
