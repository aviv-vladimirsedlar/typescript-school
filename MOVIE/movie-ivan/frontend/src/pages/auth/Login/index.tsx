import React from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout } from '../../../layouts/AuthLayout';
import { LoginForm } from '../../../modules/auth/LoginForm';

const Login: React.FC = () => (
  <AuthLayout>
    <LoginForm />
    <div className="mt-10 flex flex-col items-center justify-center text-sm opacity-70">
      <div>Don&apos;t have an account?</div>
      <Link className="text-sm font-semibold" to="/auth/register">
        Go to Register
      </Link>
    </div>
  </AuthLayout>
);

export default Login;
