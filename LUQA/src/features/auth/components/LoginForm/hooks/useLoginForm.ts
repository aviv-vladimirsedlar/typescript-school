import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { useLogin } from "./useLogin"; // Assuming you have a login mutation hook

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

// Infer the form type from the Zod schema
type LoginFormInputs = z.infer<typeof loginSchema>;

// Define the error type based on your backend's error structure
interface LoginError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useLoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Set up react-hook-form with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // Hook for login mutation
  const { mutate: login } = useLogin();

  // Form submission handler
  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data, {
      onError: (error: unknown) => {
        // Explicitly cast error to LoginError
        const typedError = error as LoginError;
        const message =
          typedError?.response?.data?.message || "An error occurred";
        setErrorMessage(message);
      },
    });
  };

  return {
    control, // For use with Controller in the LoginForm component
    handleSubmit, // To wrap the onSubmit handler
    onSubmit, // Custom submit handler
    isLoading: isSubmitting, // To show loading states
    errors, // Validation errors
    errorMessage, // General error message for display
  };
};
