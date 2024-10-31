import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => (
  <div>
    <h1>Welcome to the Login</h1>
    <Link to="/auth/register">Go to Register</Link>
  </div>
);

export default Login;
