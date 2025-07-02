export const breakpoints = {
  xs: '320px',
  sm: '475px', 
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const isMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768;
  }
  return false;
};

export const isTablet = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }
  return false;
};

export const isDesktop = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 1024;
  }
  return false;
};

// Touch gesture utilities
export const addTouchGesture = (
  element: HTMLElement,
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void
) => {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        onSwipe(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    }
  };

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', handleTouchEnd);

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};