import React, { useState, useRef, useEffect } from 'react';

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('0px');
  const contentRef = useRef(null);
  const innerRef = useRef(null);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }

    if (isOpen && innerRef.current) {
      setTimeout(() => {
        innerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 350);
    }
  }, [isOpen]);

  return (
    <div style={{marginTop: '10px', marginBottom: '10px' }}>
      <div
        onClick={toggle}
        style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          color: 'red',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
          backgroundColor: '#fff',
        }}
      >
        <div ref={innerRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;
