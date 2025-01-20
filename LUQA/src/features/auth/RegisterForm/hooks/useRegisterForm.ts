import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { useRegister } from "../../hooks/useRegister"; // Assuming a registration mutation hook

// Define Zod schema
const registerSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    passwordConfirm: z.string().nonempty("Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom", // Specify the issue code
        path: ["passwordConfirm"],
        message: "Passwords must match",
      });
    }
  });

// Infer form inputs type
type RegisterFormInputs = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: register } = useRegister();

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    register(data, {
      onError: (error: unknown) => {
        const typedError = error as {
          response?: { data?: { message?: string } };
        };
        setErrorMessage(
          typedError.response?.data?.message || "An error occurred"
        );
      },
    });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isLoading: isSubmitting,
    errors,
    errorMessage,
  };
};
