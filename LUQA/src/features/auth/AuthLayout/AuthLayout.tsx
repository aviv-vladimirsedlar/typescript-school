import { Box } from '@gemini/core';
import { AVIVLogo } from '@gemini/logos';
import { Card } from '@gemini/ui';
import React, { ReactNode } from 'react';

export const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      as="section"
      width={{
        'breakpoint.base': '95%',
        'breakpoint.md': '740px',
        'breakpoint.lg': '800px',
      }}
      maxWidth="95%"
      paddingVertical={{
        'breakpoint.base': 'spacing.40',
        'breakpoint.md': 'spacing.56',
        'breakpoint.lg': 'spacing.80',
      }}
      textAlign="center"
      typography="typography.headline.32.bold"
      borderStyle="solid"
      borderWidth="borderWidth.1"
      borderColor="color.content.onPrimary.default"
      borderRadius="radius.8"
      margin="15px auto"
    >
      <Card borderRadius="16" hasPadding>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="auto">
          <Box borderRadius="radius.8" display="flex" flexWrap="wrap" gap="spacing.24" padding="spacing.24">
            <AVIVLogo size="sizing.32" variant="colored" />
          </Box>
        </Box>
        <Box>{children}</Box>
      </Card>
    </Box>
  );
};
