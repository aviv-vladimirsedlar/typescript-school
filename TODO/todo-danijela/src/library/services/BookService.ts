import { Author, Book, BookObject } from '../models'
import { AuthorService } from './AuthorService'

export class BookService {
  #authorService: AuthorService

  constructor (authorService: AuthorService) {
    this.#authorService = authorService
  }

  async listAll () {
    //todo: implement
  }

  async findById (id: number) {
    //todo: implement
  }

  async getAuthors (book: Book) {
    const authors: Author[] = []
    for (const authorId of book.authors) {
      try {
        const author = await this.#authorService.findById(authorId)
        authors.push(author)
      } catch (err) {
        console.warn(`Author ${authorId} not found for book ${book.id}`)
        continue
      }
    }

    return authors
  }

  async create (bookObject: BookObject) {
    //todo: implement
  }

  async update (searchId: string, updateValues: Partial<BookObject>) {
    //todo: implement
  }

  async delete (id: string) {
    //todo: implement
    }
}
