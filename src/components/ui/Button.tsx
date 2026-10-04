import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const variants = {
    primary: "bg-brand-DEFAULT text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] border border-brand-DEFAULT hover:shadow-[0_0_30px_rgba(220,38,38,0.55)]",
    secondary: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
    glass: "bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 hover:border-white/30"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide",
    md: "px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold tracking-wide",
    lg: "px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-bold tracking-wide"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-full transition-all duration-300 flex items-center justify-center font-sans",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;