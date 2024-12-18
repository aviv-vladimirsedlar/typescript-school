import { Box } from '@gemini/core';
import React from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout } from '../../../layouts/AuthLayout';
import { RegisterForm } from '../../../modules/auth/RegisterForm';

const Register: React.FC = () => (
  <AuthLayout>
    <RegisterForm />

    <Box
      display="flex"
      justifyContent="center"
      gap="spacing.4"
      marginTop="spacing.32"
      marginBottom="spacing.8"
      typography="typography.body.14.regular"
    >
      <Box>Already have an account?</Box>
      <Box typography="typography.body.14.bold">
        <Link to="/auth/login">Go to Login</Link>
      </Box>
    </Box>
  </AuthLayout>
);

export default Register;
