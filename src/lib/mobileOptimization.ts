// Fixed mobile optimizations with proper TypeScript
export const mobileOptimizations = {
  // Prevent zoom on input focus
  preventZoomOnInputs: (): void => {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const element = input as HTMLElement;
      element.style.fontSize = '16px';
    });
  },

  // Add touch feedback
  addTouchFeedback: (): void => {
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button) => {
      const element = button as HTMLElement;
      
      const handleTouchStart = () => {
        element.style.transform = 'scale(0.95)';
      };
      
      const handleTouchEnd = () => {
        element.style.transform = 'scale(1)';
      };
      
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      
      // Store cleanup function for potential removal
      const cleanup = () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
      
      // Store cleanup function on element for later use if needed
      (element as any).__touchCleanup = cleanup;
    });
  },

  // Remove touch feedback (cleanup)
  removeTouchFeedback: (): void => {
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button) => {
      const element = button as any;
      if (element.__touchCleanup) {
        element.__touchCleanup();
        delete element.__touchCleanup;
      }
    });
  },

  // Set viewport meta tag for mobile optimization
  setViewportMeta: (): void => {
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
  },

  // Detect mobile device
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Detect iOS
  isIOS: (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Handle iOS safe areas
  handleIOSSafeAreas: (): void => {
    if (mobileOptimizations.isIOS()) {
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
    }
  },

  // Initialize all mobile optimizations
  init: (): void => {
    if (typeof window === 'undefined') return; // SSR check
    
    mobileOptimizations.setViewportMeta();
    mobileOptimizations.preventZoomOnInputs();
    mobileOptimizations.addTouchFeedback();
    mobileOptimizations.handleIOSSafeAreas();
  },

  // Cleanup mobile optimizations
  cleanup: (): void => {
    if (typeof window === 'undefined') return; // SSR check
    
    mobileOptimizations.removeTouchFeedback();
  }
};