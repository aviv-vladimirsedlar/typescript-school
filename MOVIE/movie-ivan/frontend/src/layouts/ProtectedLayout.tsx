import React from 'react';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="protected-layout">{children}</div>;
};

export default ProtectedLayout;
