import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div>
    <h1>Welcome to the Home Page</h1>
    <Link to="/dashboard">Go to Dashboard</Link>
  </div>
);

export default Home;
