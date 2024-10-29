# Fastify Example Project

This project is a starter template for building a Fastify API with authentication, PostgreSQL, Prisma, and Kubernetes support. It includes JWT-based authentication with `passport`, user creation, ESLint and Prettier configurations, and containerized PostgreSQL. Additionally, it provides scripts to start and stop Kubernetes services.

## Features

- **Code Quality, Formatting and Linting**: Configured with ESLint and Prettier for code quality and consistent formatting.
- **Database**: PostgreSQL with Prisma ORM for data modeling.
- **Kubernetes**: Scripts to start and stop Kubernetes services. (Rancher Desktop)
- **User Management**: Endpoints for user creation and login.
- **User Authentication and Authorization**: JWT-based authentication with role-based authorization powered by `passport`.
- **Roles and Permissions**: Roles (`admin`, `author`, `user`) control access to different actions:
  - **Admin**: Full access to manage movies, users, and roles.
  - **Author**: Can create, edit, and delete their own movies.
  - **User**: Can view movies only.
- **Prisma ORM**: Manages database models and relationships between `User`, `Role`, `RoleAllowed`, `UserRole`, and `Movie`.
- **Input Validation**: Uses Zod to validate incoming data, ensuring required fields and formats.
- **Middleware**: Custom middleware for authorization, verifying that users have permissions based on their role.
- **Docs - Swagger UI**: After starting the server, access the Swagger UI at /docs.

## Endpoints

- **Authentication**:
  - `POST /api/users/register`: Register a new user with default `user` role.
  - `POST /api/users/login`: Authenticate with email and password, receive JWT.
- **Role Management**:
  - `POST /users/:id/assign-role`: Assign a role to a user (admin only).
- **Movies**:
  - `POST /api/movies`: Create a movie (admin, author).
  - `GET /api/movies`: View all movies (all roles).
  - `PUT /api/movies/:id`: Edit a movie (admin, or author for own movies).
  - `DELETE /api/movies/:id`: Delete a movie (admin, or author for own movies).
- **Swagger - docs**:
  - `GET /docs`: Swagger documentation

## Technologies Used

- **Fastify**: High-performance framework for Node.js with extensible plugin architecture.
- **Prisma**: ORM for type-safe database access with PostgreSQL.
- **Passport**: Authentication middleware with JWT strategy.
- **Zod**: Schema validation for request data.
- **PostgreSQL**: Relational database management for structured data.

## Project structure

```graph
.
├── src
│   ├── common           # Common (Types, Util)
│   ├── config           # Configurations (Prisma, Passport, JWT)
│   ├── middlewares      # Middlewares (Authorization)
│   ├── modules          # Business logic modules (e.g., user)
│   └── index.ts         # Fastify server setup
├── prisma
│   ├── schema.prisma    # Prisma schema definition
│   └── migrations       # Prisma migrations
├── .env.example         # Environment variables example file
├── docker-compose.yml   # Docker setup for PostgreSQL
├── start-postgres.sh    # Start Kubernetes services
└── stop-postgres.sh     # Stop Kubernetes services
```

## Prerequisites

- **Node.js**: Defined in `.nvmrc` (set to v20).
- **Kubernetes**: Installed locally for managing container orchestration.

## Project Setup

1. **Clone the Repository**:

```bash
   git clone <repository-url>
   cd fastify-example
```

2. Install Dependencies: Use nvm to set the Node version and install dependencies.

```bash
nvm install
nvm use
npm install
```

3. Configure Environment Variables: Copy the .env.example file to .env and fill in the necessary values.

```bash
cp .env.example .env
```

4. Kubernetes Setup (Optional): Use kubectl to manage Kubernetes services. The project includes scripts to start and stop Kubernetes resources.

```bash
./start-postgres.sh
```

### How to stop Kubernetes services

```bash
./stop-postgres.sh
```

5. Initialize Prisma ORM: Set up Prisma with initial migrations and generate the client.

- Deploying already created migrations

```bash
yarn migrate_deploy
```

- Seeding initial data

```bash
yarn migrate_deploy
```

- Initialize migrations - sync changes in schema

```bash
yarn migrate_dev
```

If having issues with running migration, comment out `kubectl port-forward svc/fastify-postgres 5432:5432 --address=0.0.0.0 &` in `start-postgres.sh`, start postgres service and forward port to 5432 in RancherDesktop

- Generate Prisma client

```bash
yarn prisma_generate
```

## Usage

### Starting the Development Server

```bash
./dev
```

#### OR

```bash
yarn start_dev
```

### Running ESLint and Prettier

```bash
npm run lint
npm run format
```

### Postman

- You can find the collection for postman in the ./postman folder

## TODO:

- add winston logger
- improve loading of schemas and routes - automate process
- add testing tools
