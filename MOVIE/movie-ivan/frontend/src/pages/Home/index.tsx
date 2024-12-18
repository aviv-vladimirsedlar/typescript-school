import { Box } from '@gemini/core';
import React from 'react';

import { MainLayout } from '../../layouts/MainLayout';

const Home: React.FC = () => (
  <MainLayout>
    <Box margin="spacing.20">
      <Box as="h1" testId="home-message" typography="typography.headline.20.bold">
        Welcome!
      </Box>
    </Box>
  </MainLayout>
);

export default Home;
