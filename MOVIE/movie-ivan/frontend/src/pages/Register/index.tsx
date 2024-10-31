import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => (
  <div>
    <h1>Welcome to the Register</h1>
    <Link to="/auth/login">Go to Login</Link>
  </div>
);

export default Register;
