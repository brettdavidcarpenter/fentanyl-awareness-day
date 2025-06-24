
import React from 'react';

const HandDrawnArrow = () => {
  return (
    <div className="absolute left-1/3 transform -translate-x-1/2 hidden md:block pointer-events-none z-10">
      <svg
        width="250"
        height="100"
        viewBox="0 0 250 100"
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
        
        {/* Main L-shaped arrow path with hand-drawn imperfections */}
        <path
          d="M 50 15 
             L 48 35
             L 51 55
             L 49 75
             L 75 77
             L 120 75
             L 165 78
             L 200 76"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#arrowhead)"
          className="animate-pulse"
          style={{
            strokeDasharray: '4,2',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
        
        {/* Additional offset stroke for hand-drawn depth effect */}
        <path
          d="M 52 17 
             L 50 37
             L 53 57
             L 51 77
             L 77 79
             L 122 77
             L 167 80
             L 202 78"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        
        {/* Small imperfection lines for more hand-drawn feel */}
        <path
          d="M 47 25 L 50 27
             M 50 45 L 52 47
             M 85 76 L 87 78
             M 140 76 L 142 78"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default HandDrawnArrow;
