import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-10 w-64 px-3 py-2 text-sm text-white bg-navy-800 rounded-md shadow-lg -top-2 left-full ml-2 transform -translate-y-full">
          {content}
          <div className="absolute w-2 h-2 bg-navy-800 transform rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;