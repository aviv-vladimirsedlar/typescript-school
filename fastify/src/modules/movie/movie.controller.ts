import { FastifyReply, FastifyRequest } from 'fastify';

import { cleanString } from '../../common/util/string.util';
import prisma from '../../config/prisma.db';
import { isUserAdmin } from '../../middlewares/auth.strategy';

import { CreateMovieInput, UpdateMovieInput } from './movie.schema';

/***********************************************************************************************************************
 * CREATE MOVIE
 **********************************************************************************************************************/
export async function createMovie(req: FastifyRequest<{ Body: CreateMovieInput }>, reply: FastifyReply) {
  const { description, duration, year } = req.body;

  // TODO: fix type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = req.user;
  if (!user?.id) {
    return reply.code(404).send({ message: 'User not found' });
  }

  const title = cleanString(req.body.title);
  const movie = await prisma.movie.findUnique({
    where: { title },
  });
  if (movie) {
    return reply.code(401).send({ message: 'Movie with this title already exists' });
  }
  try {
    const movie = await prisma.movie.create({
      data: { description, duration, title, year, owner: { connect: { id: user.id } } },
      select: {
        id: true,
        description: true,
        duration: true,
        title: true,
        year: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return reply.code(201).send(movie);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 * DELETE MOVIE
 **********************************************************************************************************************/
export async function deleteMovie(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id: movieId } = req.params;
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
  if (!movie) {
    return reply.code(404).send({ message: 'Movie not found' });
  }

  // TODO: fix type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = req.user;
  if (user?.id !== movie.ownerId && !isUserAdmin(user)) {
    return reply.code(401).send({ message: 'User is not authorized to delete this movie' });
  }

  try {
    await prisma.movie.delete({ where: { id: movieId } });
    return reply.code(201).send({ success: true });
  } catch (e) {
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 * GET MOVIE
 **********************************************************************************************************************/
export async function getMovie(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id: movieId } = req.params;
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select: {
      id: true,
      description: true,
      duration: true,
      title: true,
      year: true,
      owner: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
  });
  if (!movie) {
    return reply.code(404).send({ message: 'Movie not found' });
  }

  // TODO: fix type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = req.user;
  if (user?.id !== movie.owner.id) {
    return reply.code(401).send({ message: 'User is not authorized to view details of this movie' });
  }
  return reply.code(200).send(movie);
}

/***********************************************************************************************************************
 * GET MOVIES
 **********************************************************************************************************************/
export async function getMovies(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.movie.findMany({
    select: {
      id: true,
      description: true,
      duration: true,
      title: true,
      year: true,
      owner: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return reply.code(200).send(users);
}

/***********************************************************************************************************************
 * UPDATE MOVIE
 **********************************************************************************************************************/
export async function updateMovie(
  req: FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id: movieId } = req.params;
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
  if (!movie) {
    return reply.code(404).send({ message: 'Movie not found' });
  }

  // TODO: fix type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = req.user;
  if (user?.id !== movie.ownerId && !isUserAdmin(user)) {
    return reply.code(401).send({ message: 'User is not authorized to update this movie' });
  }

  const { description, duration, year } = req.body;
  const dataToUpdate: Partial<UpdateMovieInput> = {};

  if (description !== undefined) {
    dataToUpdate.description = description;
  }
  if (duration !== undefined) {
    dataToUpdate.duration = duration;
  }
  if (year !== undefined) {
    dataToUpdate.year = year;
  }

  try {
    const movie = await prisma.movie.update({
      data: dataToUpdate,
      where: { id: movieId },
      select: {
        id: true,
        description: true,
        duration: true,
        title: true,
        year: true,
        owner: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
    return reply.code(201).send(movie);
  } catch (e) {
    return reply.code(500).send(e);
  }
}
