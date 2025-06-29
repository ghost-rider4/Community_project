import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'bronze' | 'silver' | 'gold' | 'diamond' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    bronze: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
    silver: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
    gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
    diamond: 'bg-gradient-to-r from-blue-400 to-purple-600 text-white',
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };
  
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};