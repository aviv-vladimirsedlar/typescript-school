import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

/***********************************************************************************************************************
 MARK: - create movie
 **********************************************************************************************************************/
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

/***********************************************************************************************************************
 MARK: - update movie
 **********************************************************************************************************************/
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

/***********************************************************************************************************************
 MARK: - get movie response
 **********************************************************************************************************************/
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

/***********************************************************************************************************************
 MARK: - delete movie response
 **********************************************************************************************************************/
const deleteMovieResponseSchema = z.object({
  success: z.boolean(),
});

export const schemaMovie = {
  createMovieSchema: { ...zodToJsonSchema(createMovieSchema), $id: 'CreateMovieSchema' },
  createMovieResponseSchema: { ...zodToJsonSchema(createMovieResponseSchema), $id: 'CreateMovieResponseSchema' },
  deleteMovieResponseSchema: { ...zodToJsonSchema(deleteMovieResponseSchema), $id: 'DeleteMovieResponseSchema' },
  getMovieResponseSchema: { ...zodToJsonSchema(getMovieResponseSchema), $id: 'GetMovieResponseSchema' },
  updateMovieSchema: { ...zodToJsonSchema(updateMovieSchema), $id: 'UpdateMovieSchema' },
  updateMovieResponseSchema: { ...zodToJsonSchema(updateMovieResponseSchema), $id: 'UpdateMovieResponseSchema' },
};
