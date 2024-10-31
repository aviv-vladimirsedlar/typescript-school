import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div>
    <h1>Welcome to the Dashboard</h1>
    <Link to="/auth/login">Go to Login</Link>
  </div>
);

export default Home;
