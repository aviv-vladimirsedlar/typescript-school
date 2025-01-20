import { Box } from "@gemini/core";
import React from "react";
import { Link } from "react-router-dom";

import { AuthLayout } from "../features/auth/AuthLayout/AuthLayout";
import { LoginForm } from "../features/auth/LoginForm/LoginForm";

const LoginPage: React.FC = () => (
  <AuthLayout>
    <LoginForm />

    <Box
      display="flex"
      justifyContent="center"
      gap="spacing.4"
      marginTop="spacing.32"
      marginBottom="spacing.8"
      typography="typography.body.14.regular"
    >
      <Box>Don&apos;t have an account?</Box>
      <Box typography="typography.body.14.bold">
        <Link className="text-sm font-bold" to="/auth/register">
          Go to Register
        </Link>
      </Box>
    </Box>
  </AuthLayout>
);

export default LoginPage;
