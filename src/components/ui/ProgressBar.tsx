import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: 'purple' | 'teal' | 'orange';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  color = 'purple' 
}) => {
  const colors = {
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    teal: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    orange: 'bg-gradient-to-r from-orange-500 to-red-500'
  };
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};