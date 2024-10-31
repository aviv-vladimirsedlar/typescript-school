import React from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout } from '../../../layouts/AuthLayout';
import { RegisterForm } from '../../../modules/auth/RegisterForm';

const Register: React.FC = () => (
  <AuthLayout>
    <RegisterForm />

    <div className="mt-10 flex flex-col items-center justify-center text-sm opacity-70">
      <div>Already have an account?</div>
      <Link className="text-sm font-semibold" to="/auth/login">
        Go to Login
      </Link>
    </div>
  </AuthLayout>
);

export default Register;
