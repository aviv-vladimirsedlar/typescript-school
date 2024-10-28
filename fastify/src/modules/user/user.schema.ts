import { z } from 'zod';

const registerUserSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
const registerUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(
    z.object({
      id: z.string(),
      role: z.object({ name: z.string() }),
    }),
  ),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string().min(6),
});
export type LoginUserInput = z.infer<typeof loginSchema>;
const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    roles: z.array(
      z.object({
        id: z.string(),
        role: z.object({ name: z.string() }),
      }),
    ),
  }),
});

const userAssingRolesSchema = z.object({
  roleId: z.array(z.string()),
});
export type UserAssignRolesInput = z.infer<typeof userAssingRolesSchema>;
const userAssingRolesResonseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(
    z.object({
      id: z.string(),
      role: z.object({ name: z.string() }),
    }),
  ),
});

export const schemaUser = {
  loginSchema,
  loginResponseSchema,
  registerUserSchema,
  registerUserResponseSchema,
  userAssingRolesSchema,
  userAssingRolesResonseSchema,
};
