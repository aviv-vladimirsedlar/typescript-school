# Frontend Project

This project is a React application configured with TypeScript, Redux, and Tailwind CSS. It includes ESLint and Prettier for code quality and integrates testing through WebdriverIO with Cucumber for BDD, along with Storybook for UI component documentation.

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)

## Technologies

- **React:** A JavaScript library for building user interfaces.
- **Redux & React-Query:** State management tools.
- **TypeScript:** A superset of JavaScript that adds typing.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Formik & Yup:** Form management and validation libraries.
- **Storybook:** An open-source tool for developing UI components in isolation.
- **WebdriverIO & Cucumber:** For end-to-end testing.

## Features

- **TypeScript Support:** Strongly typed code with TypeScript.
- **State Management:** Redux and React-Query for efficient state management.
- **CSS Framework:** Tailwind CSS for styling.
- **Form Management:** Formik and Yup for form handling and validation.
- **Testing Setup:** Includes both Jest and WebdriverIO with Cucumber for end-to-end and component tests.
- **Storybook Integration:** Document and visually test UI components.
- **CI/CD Ready:** Configured with Chromatic for visual regression testing on Storybook.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **Yarn**: Use Yarn for package management.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/frontend.git
cd frontend
yarn install
```

## Project structure

```graph

├── src
│   ├── common
│   │   ├── components  # Reusable components
│   │   └── hooks       # Custom hooks
│   ├── modules         # App-specific feature modules
│   ├── layouts         # Layout components
│   └── store           # Redux store setup and slices
├── tests               # End-to-end tests with WebdriverIO and Cucumber
│   ├── features        # Cucumber feature files
│   ├── pageobjects     # Page objects for WebdriverIO tests
│   └── step-definitions # Step definitions for Cucumber tests
├── .storybook          # Storybook configuration
└── public

```

## Terraform Deployment

For detailed instructions on deploying infrastructure with Terraform, see the [Terraform Deployment Guide](infra/README.md).

## Available Scripts

In the project directory, you can run the following commands:

#### Start the App

`yarn start` - Runs the app in development mode on http://localhost:3000.

#### Build the App

`yarn build` - Builds the app for production to the build folder.

#### Run Tests

`yarn test` - Launches the test runner in the interactive watch mode.

#### Format Code

`yarn format` - Formats code according to Prettier configuration.

#### Lint Code

`yarn lint` - Checks code for issues using ESLint.

#### Fix Lint Errors

`yarn lint:fix` - Automatically fixes lint errors.

#### Run WebdriverIO Tests

`yarn wdio` - Runs the end-to-end tests with WebdriverIO.

#### Start Storybook

`yarn storybook` - Launches Storybook on http://localhost:6006 for developing and testing UI components.

#### Build Storybook

`yarn build-storybook` - Builds Storybook as a static web application in the storybook-static directory.
