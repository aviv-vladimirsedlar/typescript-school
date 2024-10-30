/* eslint-disable @typescript-eslint/no-explicit-any */
import fastifyPassport from '@fastify/passport';
import { FastifyInstance } from 'fastify';
import supertest from 'supertest';

import { buildServer } from '../..';
import { authorize } from '../../middlewares/auth.strategy';

import * as movieController from './movie.controller'; // Import functions to be mocked

jest.mock('@fastify/passport', () => ({
  authenticate: jest.fn().mockImplementation(() => (req: any, reply: any, done: any) => done()),
}));
jest.mock('../../middlewares/auth.strategy');

const createMovie = jest.fn();
const deleteMovie = jest.fn();
const getMovie = jest.fn();
const getMovies = jest.fn();
const updateMovie = jest.fn();

(movieController as any).getMovie = getMovie;
(movieController as any).getMovies = getMovies;
(movieController as any).createMovie = createMovie;
(movieController as any).deleteMovie = deleteMovie;
(movieController as any).updateMovie = updateMovie;

const mockedUser = { id: 'user-id', firstName: 'user', lastName: 'user', email: 'text@test.com' };
const mockedMovie = { id: '1', title: 'Movie', description: 'Desc', year: 2021, duration: 120, owner: mockedUser };

describe('Movie Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should fetch the list of movies', async () => {
      getMovies.mockImplementationOnce(async (req, reply) => {
        reply.code(200).send([mockedMovie]);
      });
      const response = await supertest(app.server).get('/api/movies').set('Cookie', 'authCookie');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockedMovie]);
      expect(fastifyPassport.authenticate).toHaveBeenCalled();
    });
  });

  describe('GET /:id', () => {
    it('should fetch a movie by ID if authorized', async () => {
      getMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(200).send(mockedMovie);
      });
      (authorize as jest.Mock).mockResolvedValue(true);
      const response = await supertest(app.server).get('/api/movies/1').set('Cookie', 'authCookie');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockedMovie);
      expect(fastifyPassport.authenticate).toHaveBeenCalled();
    });

    it('should return 404 if movie is not found', async () => {
      getMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(404).send({ message: 'Movie not found' });
      });
      const response = await supertest(app.server).get('/api/movies/999').set('Cookie', 'authCookie');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Movie not found' });
    });
  });

  describe('POST /:id', () => {
    it('should create a movie if user is authorized', async () => {
      createMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(200).send(mockedMovie);
      });
      (authorize as jest.Mock).mockResolvedValue(true);

      const response = await supertest(app.server).post('/api/movies/create').set('Cookie', 'authCookie').send({
        title: mockedMovie.title,
        description: mockedMovie.description,
        year: mockedMovie.year,
        duration: mockedMovie.duration,
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(mockedMovie.title);
      expect(fastifyPassport.authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), ['create_movie']);
    });
  });

  describe('PUT /:id', () => {
    it('should update a movie if user is authorized', async () => {
      updateMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(201).send(mockedMovie);
      });
      (authorize as jest.Mock).mockResolvedValue(true);

      const response = await supertest(app.server)
        .put('/api/movies/1')
        .set('Cookie', 'authCookie')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(mockedMovie.title);
      expect(fastifyPassport.authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), ['edit_movie', 'edit_own_movie']);
    });

    it('should return 401 if user is not authorized to update', async () => {
      updateMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(401).send({ message: 'User is not authorized to update this movie' });
      });
      (authorize as jest.Mock).mockResolvedValue(false);

      const response = await supertest(app.server)
        .put('/api/movies/1')
        .set('Cookie', 'authCookie')
        .send({ title: 'Unauthorized Update' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User is not authorized to update this movie');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a movie if user is authorized', async () => {
      deleteMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(404).send({ success: true, message: 'Movie deleted successfully' });
      });
      (authorize as jest.Mock).mockResolvedValue(true);

      const response = await supertest(app.server).delete('/api/movies/1').set('Cookie', 'authCookie');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(true);
      expect(fastifyPassport.authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), [
        'delete_movie',
        'delete_own_movie',
      ]);
      expect(response.body.message).toBe('Movie deleted successfully');
    });

    it('should return 401 if user is not authorized to delete', async () => {
      deleteMovie.mockImplementationOnce(async (req, reply) => {
        reply.code(401).send({ message: 'User is not authorized to delete this movie' });
      });
      (authorize as jest.Mock).mockResolvedValue(false);

      const response = await supertest(app.server).delete('/api/movies/1').set('Cookie', 'authCookie');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User is not authorized to delete this movie');
    });
  });
});
