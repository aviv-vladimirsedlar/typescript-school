import {model, Schema} from "mongoose";

export interface IBook {
    title: string;
    author: string;
    isbn: string;
    pageNumber: number;
    genres: Map<string, string>;
}

const bookSchema = new Schema<IBook>({
    title: String,
    author: String,
    isbn: String,
    pageNumber: Number,
    genres: {
        type: Map,
        of: String,
    },
});

export default model<IBook>('Book', bookSchema);
