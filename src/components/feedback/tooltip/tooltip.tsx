import React, { useRef, useState } from 'react';

interface CustomTooltipProps {
  targetId: string;
  content: string;
}

function CustomTooltip({ targetId, content }: CustomTooltipProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

  const handleFocusTarget = () => {
    if (targetRef.current) {
      targetRef.current.focus();
    }
  };

  return (
    <>
      <span
        ref={targetRef}
        id={targetId}
        onFocus={handleFocusTarget}
        onBlur={hideTooltip}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {content}
      </span>
      {isTooltipVisible && (
        <div
          style={{
            position: 'absolute',
            top: targetRef.current?.offsetTop || 0,
            left: targetRef.current?.offsetLeft || 0,
            backgroundColor: '#f0f0f0',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}

export default CustomTooltip;
