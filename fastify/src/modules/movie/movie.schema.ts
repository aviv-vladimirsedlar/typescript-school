import { z } from 'zod';

const createMovieSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.number(),
  duration: z.number(),
});
export type CreateMovieInput = z.infer<typeof createMovieSchema>;
const createMovieResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  year: z.number(),
  duration: z.number(),
  owner: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const updateMovieSchema = z.object({
  description: z.string().optional(),
  year: z.number().optional(),
  duration: z.number().optional(),
});
export type UpdateMovieInput = z.infer<typeof createMovieSchema>;
const updateMovieResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  year: z.number(),
  duration: z.number(),
  owner: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const getMovieResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  year: z.number(),
  duration: z.number(),
  owner: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const deleteMovieResponseSchema = z.object({
  success: z.boolean(),
});

export const schemaMovie = {
  createMovieSchema,
  createMovieResponseSchema,
  deleteMovieResponseSchema,
  getMovieResponseSchema,
  updateMovieSchema,
  updateMovieResponseSchema,
};
