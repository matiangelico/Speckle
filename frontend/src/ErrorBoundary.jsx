import { Component } from "react";
import ErrorPage from "./components/common/ErrorPage";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.log(error);
    // Actualiza el estado para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
