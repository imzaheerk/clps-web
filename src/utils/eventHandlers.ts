/**
 * Wraps an event handler to automatically prevent default behavior and stop propagation
 * @param handler - The event handler function to wrap
 * @returns A new event handler that prevents default and stops propagation
 */
export function preventDefaultHandler<T extends React.SyntheticEvent>(
  handler?: (e: T) => void | Promise<void>
): (e: T) => void | Promise<void> {
  return (e: T) => {
    e.preventDefault();
    e.stopPropagation();
    return handler?.(e);
  };
}

/**
 * Prevents default behavior and stops propagation for an event
 * @param e - The event to handle
 */
export function preventDefault(e: React.SyntheticEvent): void {
  e.preventDefault();
  e.stopPropagation();
}


