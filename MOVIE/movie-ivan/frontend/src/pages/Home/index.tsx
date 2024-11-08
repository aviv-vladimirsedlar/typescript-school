import React from 'react';

import { MainLayout } from '../../layouts/MainLayout';

const Home: React.FC = () => (
  <MainLayout>
    <div className="container py-20">
      <h1 data-testid="home-message" className="text-2xl font-bold">
        Welcome!
      </h1>
    </div>
  </MainLayout>
);

export default Home;
