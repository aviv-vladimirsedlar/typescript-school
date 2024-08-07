import {AuthorService, BookService} from './services'

export interface Config {
    port: number
    services: {
        AuthorService: AuthorService
        BookService: BookService
    }
}

(async () => {

    const config: Config = {
        port: Number(process.env.PORT) || 3000,
        services: {
            AuthorService: createAuthorService(),
            BookService: createBookService()
        }
    }

    start(config)
})()
