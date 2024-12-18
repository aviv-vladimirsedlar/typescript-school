import { Box } from '@gemini/core';
import { Button, TextField } from '@gemini/ui';
import React from 'react';

import { useHook } from './hook';

export const LoginForm: React.FC = () => {
  const { errorMessage, formik, isLoading, onChange } = useHook();

  return (
    <form className="mx-auto w-full max-w-2xl">
      <Box width="100%" marginBottom="spacing.12">
        <TextField
          testId="email-input"
          label="Your email"
          isOptional={false}
          onChange={onChange('email')}
          error={formik.errors.email}
          value={formik.values.email}
        />
      </Box>

      <Box width="100%" marginBottom="spacing.20">
        <TextField
          testId="password-input"
          inputMode="none"
          name="password"
          label="Your password"
          isOptional={false}
          onChange={onChange('password')}
          error={formik.errors.password}
          value={formik.values.password}
        />
      </Box>

      <Button testId="btn-login" isLoading={isLoading} onPress={() => formik.handleSubmit()} type="button" size="48">
        Submit
      </Button>

      {!!errorMessage && (
        <Box
          testId="login-error-message"
          display="flex"
          gap="spacing.20"
          backgroundColor="color.border.status.error.default"
          marginTop="spacing.16"
          typography="typography.body.14.bold"
          color="color.content.constant.white"
          textAlign="left"
          padding="spacing.12"
          paddingLeft="spacing.16"
          zIndex="zIndex.4"
        >
          {errorMessage}
        </Box>
      )}
    </form>
  );
};
