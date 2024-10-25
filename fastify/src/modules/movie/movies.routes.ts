// import { FastifyInstance } from 'fastify'

// import { MovieType } from '../lib/movie.interface'
// import { IdeleteReply, IQuerystring, IReply } from '../lib/interfaces'
// import { Movie } from '../entity/movie.entity'

// export function configureRoutes(app: FastifyInstance) {
//   app.get<{ Reply: IReply<{ movies: MovieType[] }> }>('/', async (request, reply) => {
//     // const movieRepository = app.orm['typeorm'].getRepository(Movie)
//     // const movies = await movieRepository.find()
//     reply.code(200).send({ success: true, data: { movies: [] } })
//   })

//   app.post<{ Body: MovieType; Reply: IReply<{ movies: MovieType[] }> }>(
//     '/api/movies',
//     {
//       preValidation: (request, reply, done) => {
//         const { title, description, year, duration } = request.body
//         done(title.length < 2 ? new Error('title must be more than 2 characters') : undefined)
//       },
//     },

//     async (request, reply) => {
//       // The `name` and `mail` types are automatically inferred
//       const { title, description, year, duration } = request.body
//       try {
//         const movie = new Movie()
//         movie.title = title
//         movie.description = description
//         movie.year = year
//         movie.duration = duration
//         // const movieRepository = app.orm['typeorm'].getRepository(Movie)
//         // const result = await movieRepository.save(movie)
//         // reply.status(201).send({
//         //   success: true,
//         //   data: {
//         //     movies: [result],
//         //   },
//         // })
//       } catch (error) {
//         reply.code(400).send({ error: error as string })
//       }
//     },
//   )

//   app.get<{ Querystring: IQuerystring; Reply: IReply<{ movies: MovieType[] }> }>(
//     '/api/movies',
//     {
//       preValidation: (request, reply, done) => {
//         const { id } = request.query
//         done(id === '' || undefined ? new Error('please provide The id') : undefined)
//       },
//     },
//     async (request, reply) => {
//       try {
//         const { id } = request.query
//         // const movieRepository = app.orm['typeorm'].getRepository(Movie)
//         // const movie = await movieRepository.findOne({ where: { id } })
//         // if (!movie) {
//         reply.code(404).send({ error: 'Movie not found' })
//         // } else {
//         //   reply.code(200).send({
//         //     success: true,
//         //     data: {
//         //       movies: [movie],
//         //     },
//         //   })
//         // }
//       } catch (error) {
//         reply.code(400).send({ error: error as string })
//       }
//     },
//   )

//   app.delete<{ Querystring: IQuerystring; Reply: IdeleteReply }>(
//     '/api/movies',
//     async (request, reply) => {
//       const { id } = request.query
//       // const movieRepository = app.orm['typeorm'].getRepository(Movie)
//       // const movie = await movieRepository.findOne({ where: { id } })
//       // if (!movie) {
//       reply.code(404).send({ error: 'Movie not found' })
//       // } else {
//       //   await movieRepository.remove(movie)
//       //   reply.code(200).send({ success: true })
//       // }
//     },
//   )

//   app.put<{
//     Querystring: IQuerystring
//     Body: MovieType
//     Reply: IReply<{ movies: MovieType[] }>
//   }>('/api/movies', async (request, reply) => {
//     const { id } = request.query
//     const { title, description, year, duration } = request.body
//     // const movieRepository = app.orm['typeorm'].getRepository(Movie)
//     // const movie = await movieRepository.findOne({ where: { id } })
//     // if (!movie) {
//     reply.code(404).send({ error: 'Movie not found' })
//     // } else {
//     //   movie.title = title
//     //   movie.description = description
//     //   movie.year = year
//     //   movie.duration = duration
//     //   await movieRepository.save(movie)
//     //   reply.code(200).send({
//     //     success: true,
//     //     data: {
//     //       movies: [movie],
//     //     },
//     //   })
//     // }
//   })
// }
