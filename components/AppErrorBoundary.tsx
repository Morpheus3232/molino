"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    const errorReport = {
      level: "error",
      name: error.name || "Error",
      message: error.message || "Unknown error",
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      route: typeof window !== "undefined" ? window.location.pathname : undefined,
      timestamp: new Date().toISOString(),
      version: "0.1.0",
    };
    console.error("[Molino Error Boundary]", JSON.stringify(errorReport));
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.assign("/");
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center py-12">
            <svg width="48" height="48" viewBox="0 0 64 64" className="mx-auto mb-4" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="var(--color-foreground)" />
              <text x="32" y="44" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" fill="var(--color-accent-light)" textAnchor="middle">M</text>
            </svg>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Algo salió mal</h2>
            <p className="text-sm text-muted mb-6">
              Ocurrió un error inesperado al cargar el mapa. Podés volver a intentarlo o regresar al inicio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Intentar nuevamente
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm bg-transparent text-secondary border border-border hover:border-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
