# Fastify Example Project

This project is a starter template for building a Fastify API with authentication, PostgreSQL, Prisma, and Kubernetes support. It includes JWT-based authentication with `passport`, user creation, ESLint and Prettier configurations, and containerized PostgreSQL. Additionally, it provides scripts to start and stop Kubernetes services.

## Features

- **Authorization**: JWT-based authentication with `passport`, storing tokens in secure HTTP-only cookies.
- **User Management**: Endpoints for user creation and login.
- **Code Quality**: ESLint and Prettier are configured for consistent code style.
- **Database**: PostgreSQL with Prisma ORM for data modeling.
- **Kubernetes**: Scripts to start and stop Kubernetes services. (Rancher Desktop)

## Project structure

```graph
.
├── src
│   ├── config           # Configurations (Prisma, Passport, JWT)
│   ├── modules          # Business logic modules (e.g., user)
│   └── server.ts        # Fastify server setup
├── prisma
│   ├── schema.prisma    # Prisma schema definition
├── k8s
│   ├── fastify-deployment.yml  # Fastify deployment config
│   └── postgres-deployment.yml # PostgreSQL deployment config
├── .env.example         # Environment variables example file
├── docker-compose.yml   # Docker setup for PostgreSQL
├── k8s-start.sh         # Start Kubernetes services
└── k8s-stop.sh          # Stop Kubernetes services
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

- Initialize migrations - sync changes in schema

```bash
yarn migrate_dev
```

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
