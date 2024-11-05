import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

/***********************************************************************************************************************
 MARK: - register user
 **********************************************************************************************************************/
const registerUserSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
const registerUserResponseSchema = z.object({
  accessToken: z.string().optional(),
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

/***********************************************************************************************************************
 MARK: - login user
 **********************************************************************************************************************/
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
  accessToken: z.string().optional(),
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

/***********************************************************************************************************************
 MARK: - assign user roles
 **********************************************************************************************************************/
const userAssingRolesSchema = z.object({
  roles: z.array(z.string()),
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
  loginSchema: { ...zodToJsonSchema(loginSchema), $id: 'LoginSchema' },
  loginResponseSchema: { ...zodToJsonSchema(loginResponseSchema), $id: 'LoginResponseSchema' },
  registerUserSchema: { ...zodToJsonSchema(registerUserSchema), $id: 'RegisterUserSchema' },
  registerUserResponseSchema: { ...zodToJsonSchema(registerUserResponseSchema), $id: 'RegisterUserResponseSchema' },
  userAssingRolesSchema: { ...zodToJsonSchema(userAssingRolesSchema), $id: 'UserAssingRolesSchema' },
  userAssingRolesResonseSchema: {
    ...zodToJsonSchema(userAssingRolesResonseSchema),
    $id: 'UserAssingRolesResonseSchema',
  },
};
