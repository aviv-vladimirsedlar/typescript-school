import { Box } from '@gemini/core';
import React, { ReactNode } from 'react';

import { Header } from './Header';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <Box
        marginHorizontal="auto"
        maxWidth={{
          'breakpoint.base': '100%',
          'breakpoint.lg': '1340px',
          'breakpoint.xl': '1640px',
        }}
        paddingHorizontal="spacing.20"
      >
        {children}
      </Box>
    </>
  );
};
