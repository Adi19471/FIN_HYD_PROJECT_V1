import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * ImprovedComponent - A well-structured React functional component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onAction - Callback function for user actions
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Rendered component
 */
const ImprovedComponent = memo(({ title = 'Default Title', onAction, children }) => {
  // State management would go here if needed
  // const [state, setState] = useState(initialValue);

  // Event handlers
  const handleAction = (event) => {
    try {
      // Prevent default behavior if needed
      event?.preventDefault();
      
      // Call the callback if provided
      if (onAction && typeof onAction === 'function') {
        onAction(event);
      }
    } catch (error) {
      console.error('Error in handleAction:', error);
      // You could also integrate with your error tracking service here
    }
  };

  // Early return for loading or error states
  if (!title && !children) {
    return null;
  }

  return (
    <div className="improved-component" role="region" aria-label={title}>
      <div className="component-header">
        <h2 className="component-title">{title}</h2>
      </div>
      
      <div className="component-content">
        {children}
      </div>

      {onAction && (
        <div className="component-actions">
          <button
            type="button"
            onClick={handleAction}
            className="action-button"
            aria-label="Perform action"
          >
            Action
          </button>
        </div>
      )}
    </div>
  );
});

// Display name for debugging
ImprovedComponent.displayName = 'ImprovedComponent';

// PropTypes for runtime type checking
ImprovedComponent.propTypes = {
  title: PropTypes.string,
  onAction: PropTypes.func,
  children: PropTypes.node,
};

// Default props (optional with default parameters)
ImprovedComponent.defaultProps = {
  title: 'Default Title',
  onAction: null,
  children: null,
};

export default ImprovedComponent;