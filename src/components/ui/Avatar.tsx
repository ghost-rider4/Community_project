import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <div className={`
      ${sizes[size]} 
      rounded-full flex items-center justify-center
      ${src ? '' : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium'}
      ${className}
    `}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};