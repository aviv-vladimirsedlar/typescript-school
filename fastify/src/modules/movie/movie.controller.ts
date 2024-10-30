import { FastifyReply, FastifyRequest } from 'fastify';

import prisma from '../../config/prisma.db';
import { isUserAdmin } from '../../middlewares/auth.strategy';
import { PassportUser } from '../../types/declarations';
import logger from '../../utils/logger.util';
import { sanitizeString } from '../../utils/string.util';

import { CreateMovieInput, UpdateMovieInput } from './movie.schema';

/***********************************************************************************************************************
 MARK: - get movie
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

  return reply.code(200).send(movie);
}

/***********************************************************************************************************************
 MARK: - get movie list
 **********************************************************************************************************************/
export async function getMovies(
  req: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply,
) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const movies = await prisma.movie.findMany({
    skip: offset,
    take: limit,
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
  const totalMovies = await prisma.movie.count(); // Total count for pagination metadata
  const totalPages = Math.ceil(totalMovies / limit);

  return reply.code(200).send({
    data: movies,
    meta: { page, limit, totalPages, totalMovies },
  });
}

/***********************************************************************************************************************
 MARK: - create movie
 **********************************************************************************************************************/
export async function createMovie(req: FastifyRequest<{ Body: CreateMovieInput }>, reply: FastifyReply) {
  const { description, duration, year } = req.body;
  const user = req.user as PassportUser;

  try {
    const title = sanitizeString(req.body.title);
    const movie = await prisma.movie.findUnique({ where: { title } });
    if (movie) {
      return reply.code(409).send({ message: 'Movie with this title already exists' });
    }

    const createdMovie = await prisma.movie.create({
      data: { description: description || '', duration, title, year, owner: { connect: { id: user.id } } },
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
    return reply.code(201).send(createdMovie);
  } catch (e) {
    logger.error('ERROR "createMovie": ', e);
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 MARK: - update movie
 **********************************************************************************************************************/
export async function updateMovie(
  req: FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id: movieId } = req.params;
  try {
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
      return reply.code(404).send({ message: 'Movie not found' });
    }

    const user = req.user as PassportUser;
    if (user?.id !== movie.ownerId) {
      const isAdmin = await isUserAdmin(user);
      if (!isAdmin) {
        return reply.code(401).send({ message: 'User is not authorized to update this movie' });
      }
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

    const updatedMovie = await prisma.movie.update({
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
    return reply.code(201).send(updatedMovie);
  } catch (e) {
    return reply.code(500).send(e);
  }
}

/***********************************************************************************************************************
 MARK: - delete movie
 **********************************************************************************************************************/
export async function deleteMovie(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id: movieId } = req.params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      return reply.code(404).send({ message: 'Movie not found' });
    }

    const user = req.user as PassportUser;
    if (user?.id !== movie.ownerId) {
      const isAdmin = await isUserAdmin(user);
      if (!isAdmin) {
        return reply.code(401).send({ message: 'User is not authorized to delete this movie' });
      }
    }

    await prisma.movie.delete({ where: { id: movieId } });
    return reply.code(404).send({ success: true, message: 'Movie deleted successfully' });
  } catch (e) {
    return reply.code(500).send(e);
  }
}
