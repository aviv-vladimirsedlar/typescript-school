import { Box } from "@gemini/core";
import { Button, TextField } from "@gemini/ui";
import React from "react";
import { Controller } from "react-hook-form";

import { useRegisterForm } from "./hooks/useRegisterForm";

export const RegisterForm: React.FC = () => {
  const { control, handleSubmit, onSubmit, isLoading, errors, errorMessage } =
    useRegisterForm();

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      paddingVertical="spacing.20"
      paddingHorizontal="spacing.20"
    >
      <Box width="100%" marginBottom="spacing.12">
        <Box
          display="grid"
          marginVertical="spacing.24"
          gap="spacing.16"
          width="100%"
          gridTemplateColumns={{
            "breakpoint.sm": "repeat(1, 1fr)",
            "breakpoint.lg": "repeat(2, minmax(0, 1fr))",
          }}
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                testId="first-name-input"
                label="First name"
                placeholder="Enter your first name"
                error={
                  typeof errors.firstName?.message === "string"
                    ? errors.firstName.message
                    : undefined
                }
                isOptional={false}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                testId="last-name-input"
                label="Last name"
                placeholder="Enter your last name"
                error={
                  typeof errors.lastName?.message === "string"
                    ? errors.lastName.message
                    : undefined
                }
                isOptional={false}
              />
            )}
          />
        </Box>
      </Box>
      <Box width="100%" marginBottom="spacing.12">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              testId="email-input"
              label="Your email"
              placeholder="Enter your email"
              error={
                typeof errors.email?.message === "string"
                  ? errors.email.message
                  : undefined
              }
              isOptional={false}
            />
          )}
        />
      </Box>
      <Box width="100%" marginBottom="spacing.12">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              testId="password-input"
              label="Password"
              placeholder="Enter your password"
              type="password"
              error={
                typeof errors.password?.message === "string"
                  ? errors.password.message
                  : undefined
              }
              isOptional={false}
            />
          )}
        />
      </Box>
      <Box width="100%" marginBottom="spacing.12">
        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              testId="confirm-password-input"
              label="Confirm password"
              placeholder="Re-enter your password"
              type="password"
              error={
                typeof errors.passwordConfirm?.message === "string"
                  ? errors.passwordConfirm.message
                  : undefined
              }
              isOptional={false}
            />
          )}
        />
      </Box>

      <Button
        testId="btn-register"
        isLoading={isLoading}
        type="submit"
        size="48"
      >
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
    </Box>
  );
};
