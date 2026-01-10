import React, { memo, useCallback, useMemo, type FC, type ReactNode } from 'react';

/**
 * Props interface for AdvancedComponent
 */
interface AdvancedComponentProps {
  /** The title to display in the component header */
  title?: string;
  /** Callback function triggered on user action */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** Child components to render in the content area */
  children?: ReactNode;
  /** Optional CSS class name for custom styling */
  className?: string;
  /** Loading state indicator */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Test ID for testing purposes */
  testId?: string;
}

/**
 * AdvancedComponent - A production-ready React functional component
 * 
 * Features:
 * - TypeScript support for type safety
 * - Memoization for performance optimization
 * - Comprehensive error handling
 * - Accessibility attributes
 * - Loading and error states
 * - Proper event handling
 * 
 * @example
 * ```tsx
 * <AdvancedComponent
 *   title="My Component"
 *   onAction={handleClick}
 *   isLoading={false}
 * >
 *   <p>Content goes here</p>
 * </AdvancedComponent>
 * ```
 */
const AdvancedComponent: FC<AdvancedComponentProps> = memo(({
  title = 'Default Title',
  onAction,
  children,
  className = '',
  isLoading = false,
  error = null,
  testId = 'advanced-component',
}) => {
  // Memoized event handler to prevent unnecessary re-renders
  const handleAction = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        event.preventDefault();
        
        if (!onAction) {
          console.warn('No onAction handler provided');
          return;
        }

        // Handle both sync and async callbacks
        await onAction(event);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        console.error('Error in handleAction:', error);
        
        // You can integrate with error tracking services here
        // Example: Sentry.captureException(error);
      }
    },
    [onAction]
  );

  // Memoized computed values
  const hasContent = useMemo(() => {
    return Boolean(children || title);
  }, [children, title]);

  const componentClasses = useMemo(() => {
    return [
      'advanced-component',
      className,
      isLoading && 'is-loading',
      error && 'has-error',
    ]
      .filter(Boolean)
      .join(' ');
  }, [className, isLoading, error]);

  // Early return for empty state
  if (!hasContent && !isLoading && !error) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`${componentClasses} error-state`}
        role="alert"
        aria-live="assertive"
        data-testid={`${testId}-error`}
      >
        <div className="error-message">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`${componentClasses} loading-state`}
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-testid={`${testId}-loading`}
      >
        <div className="loading-spinner" aria-label="Loading content">
          <span className="spinner" aria-hidden="true">⏳</span>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div 
      className={componentClasses}
      role="region"
      aria-label={title}
      data-testid={testId}
    >
      {title && (
        <header className="component-header">
          <h2 className="component-title">{title}</h2>
        </header>
      )}
      
      {children && (
        <div className="component-content">
          {children}
        </div>
      )}

      {onAction && (
        <footer className="component-actions">
          <button
            type="button"
            onClick={handleAction}
            className="action-button"
            aria-label="Perform action"
            disabled={isLoading}
          >
            Action
          </button>
        </footer>
      )}
    </div>
  );
});

// Display name for debugging and React DevTools
AdvancedComponent.displayName = 'AdvancedComponent';

export default AdvancedComponent;