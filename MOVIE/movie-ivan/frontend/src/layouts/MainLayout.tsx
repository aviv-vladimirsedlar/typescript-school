import React, { ReactNode } from 'react';

import { Header } from './Header';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container mx-auto">{children}</div>
    </>
  );
};
