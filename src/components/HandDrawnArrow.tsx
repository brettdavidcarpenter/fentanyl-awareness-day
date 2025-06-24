
import React from 'react';

const HandDrawnArrow = () => {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block pointer-events-none z-10">
      <svg
        width="200"
        height="80"
        viewBox="0 0 200 80"
        className="text-blue-400"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            />
          </marker>
        </defs>
        
        {/* Main curved arrow path with slight imperfections for hand-drawn look */}
        <path
          d="M 100 10 
             Q 85 25, 90 40
             Q 95 55, 80 65
             L 75 62"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#arrowhead)"
          className="animate-pulse"
          style={{
            strokeDasharray: '3,2',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
        
        {/* Additional small stroke for hand-drawn effect */}
        <path
          d="M 98 12 
             Q 83 27, 88 42
             Q 93 57, 78 67"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

export default HandDrawnArrow;
