import { useState, useEffect } from 'react';

/**
 * Hook to detect page reloads and track loading state
 * @returns Object containing isReloading state
 */
export const usePageReload = () => {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    // Function to handle beforeunload event
    const handleBeforeUnload = () => {
      // Set reloading state to true when page is about to unload
      setIsReloading(true);
      // Store reloading state in sessionStorage to persist across page reload
      sessionStorage.setItem('isReloading', 'true');
    };

    // Function to handle page load
    const handlePageLoad = () => {
      // Check if page was reloaded
      const wasReloading = sessionStorage.getItem('isReloading') === 'true';
      
      if (wasReloading) {
        // Set reloading state to true initially
        setIsReloading(true);
        
        // Clear the reloading flag
        sessionStorage.removeItem('isReloading');
        
        // After a short delay, set reloading to false
        // This gives components time to render with the loading state
        setTimeout(() => {
          setIsReloading(false);
        }, 1000); // Adjust timeout as needed
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check for reload on mount
    handlePageLoad();

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { isReloading };
};