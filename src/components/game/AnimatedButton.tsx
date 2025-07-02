'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUISounds } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'gor' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  soundEffect?: boolean;
  haptic?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  value?: string | ReadonlyArray<string> | number;
  autoFocus?: boolean;
  tabIndex?: number;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  id?: string;
  title?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      soundEffect = true,
      haptic = true,
      children,
      className,
      disabled,
      onClick,
      onMouseEnter,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const { buttonClick, buttonHover } = useUISounds();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      if (soundEffect) {
        buttonClick();
      }

      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);

      onClick?.(event);
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      if (soundEffect) {
        buttonHover();
      }

      onMouseEnter?.(event);
    };

    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white border-primary-500',
      secondary: 'bg-surface-secondary hover:bg-surface-tertiary text-white border-surface-tertiary',
      gor: 'bg-gor-600 hover:bg-gor-700 text-white border-gor-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-500',
      success: 'bg-green-600 hover:bg-green-700 text-white border-green-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg border font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {/* Button content */}
        <span className={cn('relative z-10', loading && 'opacity-0')}>
          {children}
        </span>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full opacity-30"
          animate={!disabled && !loading ? {
            opacity: [0, 0.5, 0],
            x: ['-100%', '100%'],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />

        {/* Ripple effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// Specialized button variants
export function PrimaryButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton variant="primary" {...props} />;
}

export function SecondaryButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton variant="secondary" {...props} />;
}

export function GorButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton variant="gor" {...props} />;
}

export function DangerButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton variant="danger" {...props} />;
}

export function SuccessButton(props: Omit<AnimatedButtonProps, 'variant'>) {
  return <AnimatedButton variant="success" {...props} />;
}