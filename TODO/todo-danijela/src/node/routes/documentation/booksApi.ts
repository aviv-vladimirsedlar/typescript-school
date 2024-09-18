export const AddBookSchema = {
    description: 'Create a new book',
    tags: ['books'],
    summary: 'Creates new book',
    body: {
        type: 'object',
        properties: {
            title: {type: 'string'},
            author: {type: 'string'},
            isbn: {type: 'string'},
            pageNumber: {type: 'number'},
            genres: {type: 'object'},
        },
    },
    response: {
        200: {
            description: 'Success',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                title: {type: 'string'},
                author: {type: 'string'},
                isbn: {type: 'string'},
                pageNumber: {type: 'number'},
                genres: {type: 'object'},
                __v: {type: 'number'},
            },
        },
    },
};

export const EditBookSchema = {
    description: 'Updates an existing book',
    tags: ['books'],
    summary: 'Updates book by ID with given values',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Book ID'
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            title: {type: 'string'},
            author: {type: 'string'},
            isbn: {type: 'string'},
            pageNumber: {type: 'number'},
            genres: {type: 'object'},
        },
    },
    response: {
        200: {
            description: 'Success',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                title: {type: 'string'},
                author: {type: 'string'},
                isbn: {type: 'string'},
                pageNumber: {type: 'number'},
                genres: {type: 'object'},
                __v: {type: 'number'},
            },
        },
    },
};

export const GetBookSchema = {
    description: 'Gets a single book',
    tags: ['books'],
    summary: 'Gets book by ID',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Book ID'
            }
        }
    },
    response: {
        200: {
            description: 'Success',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                title: {type: 'string'},
                author: {type: 'string'},
                isbn: {type: 'string'},
                pageNumber: {type: 'number'},
                genres: {type: 'object'},
                __v: {type: 'number'},
            },
        },
    },
};

export const GetBooksSchema = {
    description: 'Gets all books',
    tags: ['books'],
    summary: 'Gets all books',
    response: {
        200: {
            description: 'Success',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {type: 'string'},
                    title: {type: 'string'},
                    author: {type: 'string'},
                    isbn: {type: 'string'},
                    pageNumber: {type: 'number'},
                    genres: {type: 'object'},
                    __v: {type: 'number'},
                },
            }
        },
    },
};

export const DeleteBookSchema = {
    description: 'Deletes a single book',
    tags: ['books'],
    summary: 'Deletes book by ID',
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'Book ID',
            },
        },
    },
    response: {
        200: {
            description: 'Success',
            type: 'object',
            properties: {
                _id: {type: 'string'},
                title: {type: 'string'},
                author: {type: 'string'},
                isbn: {type: 'string'},
                pageNumber: {type: 'number'},
                genres: {type: 'object'},
                __v: {type: 'number'},
            },
        },
    },
};
