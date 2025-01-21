import { Box } from "@gemini/core";
import { AVIVLogo } from "@gemini/logos";
import { TextField, Button, Link, Badge } from "@gemini/ui";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const LoginForm: React.FC = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {};

  return (
    <Box
      as="main"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundImage="url('/path-to-background.jpg')" // Placeholder background
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Badge label="beta">test</Badge>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        width="360px"
        padding="spacing.12"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* Logos Component */}

        <AVIVLogo
          variant="colored"
          size="sizing.40"
          marginVertical="spacing.8"
        />

        {/* Title */}
        <Box as="h2" textAlign="center" marginBottom="spacing.8">
          Log in to your account
        </Box>

        {/* Email Field */}
        <Box marginBottom="spacing.6">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email or ID"
                placeholder="Enter your email or ID"
                isOptional={false}
              />
            )}
          />
        </Box>

        {/* Password Field */}
        <Box marginBottom="spacing.6" width={"100%"}>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                placeholder="Enter your password"
                type="password"
                isOptional={false}
                isFullWidth
              />
            )}
          />
        </Box>

        {/* Submit Button */}
        <Box textAlign="center" marginBottom="spacing.8" width="100%">
          <Button type="submit" isFullWidth>
            Log In
          </Button>
        </Box>

        {/* Forgot Password */}
        <Box textAlign="center" marginBottom="spacing.8">
          <Link href="/forgot-password">Forgot password?</Link>
        </Box>

        {/* Footer */}
        <Box textAlign="center" as="p">
          © Aviv group GmbH 2023 – Our{" "}
          <Link href="/terms">Terms and conditions</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link> will apply
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
