# React LUQA Project

This project is a scalable and maintainable React application designed as a sales panel for internal use. The application allows salespeople to manage leads, track projects, and access important customer information, following best practices for folder structure, state management, and dependency usage.

---

## Table of Contents

- [Project Features](#project-features)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)

---

## Project Features

- **Feature-Based Folder Structure**: Encapsulates logic within individual features for scalability and modularity.
- **Reusable Modules**: Shared components, hooks, and utilities are centralized in the `common` folder to encourage reusability.
- **State Management**: Uses Redux Toolkit for global state and React-Query for server-side state.
- **Efficient Forms**: Implements React-Hook-Form with Zod for lightweight, schema-based form handling.
- **API Communication**: Axios is used for customizable and consistent API requests.

---

## Folder Structure

Below is the high-level folder structure:

src/
|– common/ # Shared reusable modules
| |– components/ # Shared reusable UI components
| |– types/ # Shared reusable types
| |– hooks/ # Shared reusable hooks
| |– layouts/ # Shared layouts (Navbar, Sidebar, etc.)
| |– utils/ # Utility functions and helpers
|
|– config/ # Global configurations and state management
|– features/ # Feature-specific modules
|– pages/ # High-level route components
|– tests/ # Dedicated testing folder (e2e tests)
|– App.tsx
|– index.tsx
|– routes.ts

For a detailed explanation of the folder structure, refer to the project's [Architectural Decision Record (ADR)](./docs/ADR.md).

---

## Dependencies

The project uses the following core libraries:

1. **[React-Query](https://tanstack.com/query/latest)**: Efficient server-state management.
2. **[Redux Toolkit](https://redux-toolkit.js.org/)**: Simplified global state management.
3. **[React-Hook-Form](https://react-hook-form.com/)**: Lightweight form handling.
4. **[Zod](https://zod.dev/)**: Schema-based form validation.
5. **[Axios](https://axios-http.com/)**: API client with interceptors for request/response customization.

For the full list of dependencies, check the `package.json` file.

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+)
- **npm** or **yarn**

### Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-folder>

   ```

2. **Install Dependencies**

   npm install

3. **Run the Application**

   source dev
