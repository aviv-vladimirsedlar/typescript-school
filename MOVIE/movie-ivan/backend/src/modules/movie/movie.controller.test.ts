/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { buildServer } from '../..';
import prisma from '../../config/prisma.db';

import { getMovies, getMovie, createMovie, updateMovie, deleteMovie } from './movie.controller';
import { CreateMovieInput, UpdateMovieInput } from './movie.schema';

let app: FastifyInstance;

const mockedUser = {
  id: 'user-id',
  firstName: 'user',
  lastName: 'user',
  email: 'text@test.com',
  password: 'hash',
  createdAt: '2021-08-01T00:00:00.000Z',
  updatedAt: '2021-08-01T00:00:00.000Z',
};

const mockedMovie = {
  id: 'movie-id',
  title: 'Test Movie',
  description: 'A test movie',
  duration: 120,
  year: 2021,
  ownerId: mockedUser.id,
  createdAt: new Date('2021-08-01T00:00:00.000Z'),
  updatedAt: new Date('2021-08-01T00:00:00.000Z'),
};

beforeAll(async () => {
  app = buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Movie Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return paginated movies with metadata', async () => {
      const page = 1;
      const limit = 2;
      const totalCount = 5;
      const totalPages = Math.ceil(totalCount / limit);

      // Mock prisma calls
      jest
        .spyOn(prisma.movie, 'findMany')
        .mockResolvedValueOnce([mockedMovie, { ...mockedMovie, title: 'Test Movie 2', id: 'movie-id-2' }]);
      jest.spyOn(prisma.movie, 'count').mockResolvedValueOnce(totalCount);

      const req = {
        query: { page: String(page), limit: String(limit) },
      } as unknown as FastifyRequest<{ Querystring: { page?: string; limit?: string } }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await getMovies(req, reply);

      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({
        data: [mockedMovie, { ...mockedMovie, title: 'Test Movie 2', id: 'movie-id-2' }],
        meta: {
          page,
          limit,
          totalPages,
          totalCount,
        },
      });

      // Verify Prisma was called with pagination
      expect(prisma.movie.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
        select: expect.any(Object),
      });
    });
  });

  describe('getMovie', () => {
    it('should return 404 if the movie is not found', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(null);

      const req = { params: { id: 'movie-id' }, user: mockedUser as unknown } as FastifyRequest<{
        Params: { id: string };
      }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await getMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(404);
    });

    it('should return a movie if found and authorized', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(mockedMovie);

      const req = { params: { id: mockedMovie.id }, user: mockedUser as unknown } as FastifyRequest<{
        Params: { id: string };
      }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await getMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(mockedMovie);
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.movie, 'create').mockResolvedValueOnce(mockedMovie);

      const req = {
        body: { title: 'New Movie', description: 'A new movie', duration: 120, year: 2021 },
        user: mockedUser,
      } as unknown as FastifyRequest<{ Body: CreateMovieInput }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await createMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith(mockedMovie);
    });

    it('should return 401 if a movie with the title already exists', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(mockedMovie);
      jest.spyOn(prisma.movie, 'create').mockResolvedValueOnce(mockedMovie);

      const req = {
        body: { title: 'New Movie', description: 'A new movie', duration: 120, year: 2021 },
        user: mockedUser,
      } as unknown as FastifyRequest<{ Body: CreateMovieInput }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await createMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(409);
      expect(reply.send).toHaveBeenCalledWith({ message: 'Movie with this title already exists' });
    });

    it('should return 500 on create - database error', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockRejectedValue('error');

      const req = {
        body: { title: 'New Movie', description: 'A new movie', duration: 120, year: 2021 },
        user: mockedUser,
      } as unknown as FastifyRequest<{ Body: CreateMovieInput }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await createMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith('error');
    });
  });

  describe('updateMovie', () => {
    it('should update a movie if authorized', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(mockedMovie);
      jest.spyOn(prisma.movie, 'update').mockResolvedValueOnce({ ...mockedMovie, title: 'Updated Title' });

      const req = {
        params: { id: 'movie-id' },
        body: { title: 'Updated Title' },
        user: mockedUser,
      } as unknown as FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply<{
        Body: UpdateMovieInput;
        Params: { id: string };
      }>;

      await updateMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({ ...mockedMovie, title: 'Updated Title' });
    });

    it('should update a movie if authorized - different set of data', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(mockedMovie);
      jest.spyOn(prisma.movie, 'update').mockResolvedValueOnce({
        ...mockedMovie,
        title: 'Updated Title',
        description: 'What an awesome movie',
        year: 2022,
      });

      const req = {
        params: { id: 'movie-id' },
        body: { title: 'Updated Title', description: 'What an awesome movie', year: 2022 },
        user: mockedUser,
      } as unknown as FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply<{
        Body: UpdateMovieInput;
        Params: { id: string };
      }>;

      await updateMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({
        ...mockedMovie,
        title: 'Updated Title',
        description: 'What an awesome movie',
        year: 2022,
      });
    });

    it('should return 401 if the user is not authorized to update', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(mockedMovie);

      const req = {
        params: { id: 'movie-id' },
        body: { title: 'Updated Title' },
        user: { ...mockedUser, id: 'another-user-id' },
      } as unknown as FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply<{
        Body: UpdateMovieInput;
        Params: { id: string };
      }>;

      await updateMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: 'User is not authorized to update this movie' });
    });

    it('should return 500 on udpate - database error', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockRejectedValue('error');

      const req = {
        params: { id: 'movie-id' },
        body: { title: 'Updated Title' },
        user: mockedUser,
      } as unknown as FastifyRequest<{ Body: UpdateMovieInput; Params: { id: string } }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply<{
        Body: UpdateMovieInput;
        Params: { id: string };
      }>;

      await updateMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith('error');
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie if authorized', async () => {
      jest.spyOn(prisma.movie, 'findUnique').mockResolvedValueOnce(mockedMovie);
      jest.spyOn(prisma.movie, 'delete').mockResolvedValueOnce({} as any);

      const req = { params: { id: 'movie-id' }, user: mockedUser } as unknown as FastifyRequest<{
        Params: { id: string };
      }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await deleteMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith({ success: true, message: 'Movie deleted successfully' });
    });

    it('should return 401 if the user is not authorized to delete', async () => {
      const mockMovie = { id: 'movie-id', ownerId: 'another-user-id' };
      (prisma.movie.findUnique as jest.Mock).mockResolvedValue(mockMovie);

      const req = { params: { id: 'movie-id' }, user: mockedUser } as unknown as FastifyRequest<{
        Params: { id: string };
      }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await deleteMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ message: 'User is not authorized to delete this movie' });
    });

    it('should return 500 on udpate - database error', async () => {
      jest
        .spyOn(prisma.movie, 'findUnique')
        .mockRejectedValue({ message: 'User is not authorized to delete this movie' });

      const req = { params: { id: 'movie-id' }, user: mockedUser } as unknown as FastifyRequest<{
        Params: { id: string };
      }>;
      const reply = { code: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as FastifyReply;

      await deleteMovie(req, reply);
      expect(reply.code).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ message: 'User is not authorized to delete this movie' });
    });
  });
});
