import { Box } from '@gemini/core';
import { Button, TextField } from '@gemini/ui';
import React from 'react';

import { useHook } from './hook';

export const RegisterForm: React.FC = () => {
  const { errorMessage, formik, isLoading, onChange } = useHook();

  return (
    <form className="mx-auto w-full max-w-2xl">
      <Box width="100%" marginBottom="spacing.12">
        <Box
          display="grid"
          marginVertical="spacing.24"
          gap="spacing.16"
          width="100%"
          gridTemplateColumns={{
            'breakpoint.sm': 'repeat(1, 1fr)',
            'breakpoint.lg': 'repeat(2, minmax(0, 1fr))',
          }}
        >
          <TextField
            testId="first-name-input"
            label="First name"
            error={formik.errors.firstName}
            value={formik.values.firstName}
            isOptional={false}
            onChange={onChange('firstName')}
          />
          <TextField
            testId="last-name-input"
            label="Last name"
            error={formik.errors.lastName}
            value={formik.values.lastName}
            isOptional={false}
            onChange={onChange('lastName')}
          />
        </Box>
      </Box>
      <Box width="100%" marginBottom="spacing.12">
        <TextField
          testId="email-input"
          label="Your email"
          error={formik.errors.email}
          value={formik.values.email}
          isOptional={false}
          onChange={onChange('email')}
        />
      </Box>
      <Box width="100%" marginBottom="spacing.12">
        <TextField
          testId="password-input"
          label="Password"
          error={formik.errors.password}
          value={formik.values.password}
          isOptional={false}
          onChange={onChange('password')}
        />
      </Box>
      <Box width="100%" marginBottom="spacing.12">
        <TextField
          testId="confirm-password-input"
          label="Confirm password"
          error={formik.errors.passwordConfirm}
          value={formik.values.passwordConfirm}
          isOptional={false}
          onChange={onChange('passwordConfirm')}
        />
      </Box>

      <Button testId="btn-register" isLoading={isLoading} onPress={() => formik.handleSubmit()} type="button" size="48">
        Submit
      </Button>

      {!!errorMessage && (
        <Box
          testId="register-error-message"
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
