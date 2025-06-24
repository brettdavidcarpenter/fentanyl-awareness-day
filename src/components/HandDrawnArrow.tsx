
import React from 'react';

const HandDrawnArrow = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
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
        
        {/* Arrow 1: From "What you can do" to "Plan to take action" (left card) */}
        <path
          d="M 200 120 
             L 198 140
             L 201 160
             L 199 180
             L 225 182
             L 270 180
             L 315 183
             L 350 181"
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
        
        {/* Arrow 2: From "Plan to take action" to "Spread the word" (horizontal) */}
        <path
          d="M 420 200
             L 442 198
             L 464 201
             L 486 199
             L 508 202
             L 530 200
             L 552 203
             L 574 201"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#arrowhead)"
          className="animate-pulse"
          style={{
            strokeDasharray: '4,2',
            animation: 'pulse 3.5s ease-in-out infinite'
          }}
        />
        
        {/* Arrow 3: From "Spread the word" back to "What you can do" (curved up and left) */}
        <path
          d="M 580 160
             L 578 142
             L 575 124
             L 572 106
             L 550 104
             L 528 102
             L 506 105
             L 484 103
             L 462 106
             L 440 104
             L 418 107
             L 396 105
             L 374 108
             L 352 106
             L 330 109
             L 308 107
             L 286 110
             L 264 108
             L 242 111
             L 220 109"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#arrowhead)"
          className="animate-pulse"
          style={{
            strokeDasharray: '4,2',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        
        {/* Secondary offset strokes for hand-drawn depth effect */}
        <path
          d="M 202 122 
             L 200 142
             L 203 162
             L 201 182
             L 227 184
             L 272 182
             L 317 185
             L 352 183"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        
        <path
          d="M 422 202
             L 444 200
             L 466 203
             L 488 201
             L 510 204
             L 532 202
             L 554 205
             L 576 203"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        
        <path
          d="M 582 162
             L 580 144
             L 577 126
             L 574 108
             L 552 106
             L 530 104
             L 508 107
             L 486 105
             L 464 108
             L 442 106
             L 420 109
             L 398 107
             L 376 110
             L 354 108
             L 332 111
             L 310 109
             L 288 112
             L 266 110
             L 244 113
             L 222 111"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        
        {/* Small imperfection lines for more hand-drawn feel */}
        <path
          d="M 197 130 L 200 132
             M 200 150 L 202 152
             M 235 181 L 237 183
             M 290 181 L 292 183
             M 440 199 L 442 201
             M 480 200 L 482 202
             M 520 201 L 522 203
             M 560 202 L 562 204
             M 575 150 L 577 152
             M 570 130 L 572 132
             M 500 104 L 502 106
             M 400 106 L 402 108
             M 300 108 L 302 110"
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
