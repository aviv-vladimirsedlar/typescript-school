import { Box } from "@gemini/core";
import { Button, TextField } from "@gemini/ui";
import React from "react";
import { Controller } from "react-hook-form";

import { useLoginForm } from "./hooks/useLoginForm";

export const LoginForm: React.FC = () => {
  const { control, handleSubmit, onSubmit, isLoading, errors, errorMessage } =
    useLoginForm();

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Display network error message */}

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

      {/* Email input field */}
      <Box width="100%" marginBottom="spacing.12">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Your email"
              placeholder="Please enter your email"
              isOptional={false}
              error={errors.email?.message}
            />
          )}
        />
      </Box>

      {/* Password input field */}
      <Box width="100%" marginBottom="spacing.20">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Your password"
              placeholder="Please enter your password"
              type="password"
              isOptional={false}
              error={errors.password?.message}
            />
          )}
        />
      </Box>

      {/* Submit button */}
      <Button testId="btn-login" isLoading={isLoading} type="submit" size="48">
        Submit
      </Button>
    </Box>
  );
};
