import * as booksController from '../controllers/booksController';
import {RouteOptions} from 'fastify';
import {AddBookSchema, DeleteBookSchema, EditBookSchema, GetBookSchema, GetBooksSchema} from './documentation/booksApi';

const getBooksRoute: RouteOptions = {
    method: 'GET',
    url: '/api/books',
    handler: booksController.getBooks,
    schema: GetBooksSchema,
};

const getBookRoute: RouteOptions = {
    method: 'GET',
    url: '/api/books/:id',
    handler: booksController.getBook,
    schema: GetBookSchema,
};

const postBookRoute: RouteOptions = {
    method: 'POST',
    url: '/api/books',
    handler: booksController.addBook,
    schema: AddBookSchema,
};

const putBookRoute: RouteOptions = {
    method: 'PUT',
    url: '/api/books/:id',
    handler: booksController.updateBook,
    schema: EditBookSchema,
};

const deleteBookRoute: RouteOptions = {
    method: 'DELETE',
    url: '/api/books/:id',
    handler: booksController.deleteBook,
    schema: DeleteBookSchema,
};

const routes = [
    getBooksRoute,
    getBookRoute,
    postBookRoute,
    putBookRoute,
    deleteBookRoute
];

export default routes;
