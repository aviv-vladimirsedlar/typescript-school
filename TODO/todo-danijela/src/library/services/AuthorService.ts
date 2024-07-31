import { Author, AuthorObject } from '../models'

export class AuthorService {

  async create (authorObject: AuthorObject) {
    const author = new Author(authorObject)
    //todo: implement
  }

  async findById (id: number) {
    //todo: implement
  }

  async update () {
    //todo: implement
  }

  async delete (id: string) {
    //todo: implement
  }
}
