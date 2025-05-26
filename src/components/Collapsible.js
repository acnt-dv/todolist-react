import React, { useState } from 'react';

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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

      {isOpen && (
        <div style={{  backgroundColor: '#fff' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
