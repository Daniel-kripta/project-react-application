import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "50px", marginTop: "50px" }}>
          <h2>Oops! Something went wrong in the NutriCalc page. </h2>
          <p>Please refresh the page or go back to home.</p>
          <button onClick={() => window.location.href = '/'}>Go Home</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;