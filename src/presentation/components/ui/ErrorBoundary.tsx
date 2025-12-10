// src/presentation/components/ui/ErrorBoundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 3rem 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  text-align: left;
  max-width: 600px;
  width: 100%;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  pre {
    font-size: 0.875rem;
    color: #ef4444;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </ErrorMessage>
          
          <ButtonGroup>
            <Button onClick={this.handleReset} variant="primary">
              Try Again
            </Button>
            <Button onClick={this.handleReload} variant="secondary">
              Reload Page
            </Button>
          </ButtonGroup>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Development Only)</summary>
              <pre>{this.state.error.stack}</pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}