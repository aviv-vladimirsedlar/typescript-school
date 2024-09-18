import Book, {IBook} from '../models/Book';
import {Document} from 'mongoose';
import {FastifyReply, FastifyRequest} from 'fastify';

export const getBooks = async (req: FastifyRequest, reply: FastifyReply): Promise<Document[]> => {
    try {
        const books = await Book.find();
        return books;
    } catch (err) {
        return reply.code(500).send({error: err})
    }
};

export const getBook = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = req.params as { id: string };
        const id = params.id
        const book = await Book.findById(id);
        return book;
    } catch (err) {
        return reply.code(500).send({error: err})
    }
};

export const addBook = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const book = new Book(req.body);
        return await book.save();
    } catch (err) {
        return reply.code(500).send({error: err})
    }
};

export const updateBook = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = req.params as { id: string };
        const id = params.id;
        const book = req.body as IBook;
        const {...updateData} = book;

        const update = await Book.findByIdAndUpdate(id, updateData, {new: true});

        if (!update) {
            return reply.status(404).send({error: 'Book not found'});
        }

        return update;
    } catch (err) {
        return reply.code(500).send({error: err})
    }
};

export const deleteBook = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = req.params as { id: string };
        const id = params.id;
        const book = await Book.findByIdAndRemove(id);
        return book;
    } catch (err) {
        return reply.code(500).send({error: err})
    }
};
