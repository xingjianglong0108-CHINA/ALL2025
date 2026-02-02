
import React from 'react';

interface IOSCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const IOSCard: React.FC<IOSCardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`mb-5 ${className}`}>
      {title && (
        <div className="flex items-center px-1 mb-2">
          <div className="w-1 h-3 bg-blue-500 rounded-full mr-2" />
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</h2>
        </div>
      )}
      <div className="bg-white/70 backdrop-blur-md rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white overflow-hidden transition-all duration-300">
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default IOSCard;
