import { z } from 'zod'

// import { createMovieResponseSchema, createMovieSchema } from '../movie/movie.schema'

// data that we need from user to register
const createUserSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
})
//exporting the type to provide to the request Body
export type CreateUserInput = z.infer<typeof createUserSchema>
// response schema for registering user
const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
})

// same for login route
const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string().min(6),
})
export type LoginUserInput = z.infer<typeof loginSchema>

const loginResponseSchema = z.object({
  accessToken: z.string(),
})

export const schemaUser = {
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
}
