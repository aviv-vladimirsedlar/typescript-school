import { Box } from "@gemini/core";
import React from "react";
import { Link } from "react-router-dom";

import { AuthLayout } from "../features/auth/AuthLayout/AuthLayout";
import { RegisterForm } from "../features/auth/RegisterForm/RegisterForm";

const RegisterPage: React.FC = () => (
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

export default RegisterPage;
