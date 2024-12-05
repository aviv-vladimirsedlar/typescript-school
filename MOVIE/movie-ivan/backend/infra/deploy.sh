#!/bin/bash
set -euo pipefail

# Enable strict error handling:
# -e: Exit immediately if a command exits with a non-zero status.
# -u: Treat unset variables as an error and exit immediately.
# -o pipefail: Ensure the script fails if any command in a pipeline fails.

# Default values for flags
BUILD=true  # Whether to build the application before deployment.
CLEAN=false # Whether to clean the `.terraform` directory before running.
ENV=""      # The environment for the deployment, e.g., `dev` or `production`.

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    build=*) BUILD="${1#*=}";; # Extract and set the value of `build=`.
    clean=*) CLEAN="${1#*=}";; # Extract and set the value of `clean=`.
    env=*) ENV="${1#*=}";;     # Extract and set the value of `env=`.
    *) echo "Unknown parameter passed: $1"; exit 1;; # Exit for unrecognized parameters.
  esac
  shift # Move to the next argument.
done

# Validate that the ENV variable is set and valid
if [[ -z "$ENV" ]]; then
  echo "Error: env is required. Usage: ./deploy.sh env=dev|production build=true|false clean=true|false"
  exit 1
fi

if [[ "$ENV" != "dev" && "$ENV" != "production" ]]; then
  echo "Error: env must be 'dev' or 'production'."
  exit 1
fi

# Optionally clean the .terraform directory
if [[ "$CLEAN" == "true" ]]; then
  echo "Cleaning .terraform directory"
  rm -rf .terraform || true # Remove `.terraform` directory if it exists.
else
  echo "Skipping .terraform cleanup"
fi

# Initialize Terraform and ensure the correct workspace is selected
terraform init -input=false # Initialize Terraform without prompting for input.

# Create a new Terraform workspace if it doesn't exist, then select it.
if ! terraform workspace list | grep -q "$ENV"; then
  terraform workspace new "$ENV"
fi
terraform workspace select "$ENV"

# Function to build the application
build_app () {
  echo "Building application for environment: $ENV"
  
  cd .. || exit 1 # Navigate to the parent directory.

  # Clean up previous build artifacts
  rm -rf dist nodejs layer layer-core.zip layer-project.zip lambda-*.zip node_modules

  # Install production dependencies
  yarn install --production

  # Build application and include Prisma client generation
  if [[ "$ENV" == "dev" ]]; then
    yarn build:dev
    yarn prisma:generate
    cp secretKeyPassport dist/secretKeyPassport # Copy secret key to the `dist` folder.
  elif [[ "$ENV" == "production" ]]; then
    yarn build:production
    yarn prisma:generate
    cp secretKeyPassport dist/secretKeyPassport # Copy secret key to the `dist` folder.
  fi

  # Package the Lambda function with application files
  zip -r "lambda-$ENV.zip" dist package.json package-lock.json

  # Create AWS Lambda layers
  mkdir -p nodejs/node20/node_modules # Create directory structure for layers.

  # Move critical node_modules into the core layer
  mv node_modules/@prisma nodejs/node20/node_modules
  mv node_modules/@fastify nodejs/node20/node_modules
  mv node_modules/fastify nodejs/node20/node_modules
  mv node_modules/prisma nodejs/node20/node_modules
  zip -r layer-core.zip nodejs # Package the core layer.

  # Clean up and prepare the project layer
  rm -rf nodejs
  mkdir -p nodejs/node20/node_modules
  rm -rf node_modules/.bin # Remove unnecessary files from node_modules.
  mv node_modules nodejs/node20/
  zip -r layer-project.zip nodejs # Package the project layer.

  cd infra || exit 1 # Navigate back to the infra directory.
}

# Function to deploy infrastructure using Terraform
deploy_infra () {
  echo "Deploying infrastructure for environment: $ENV"
  
  # Apply Terraform configuration. You can uncomment the `-replace` argument to force updates.
  terraform apply -input=false -auto-approve -var-file="env/$ENV.tfvars"
}

# Conditionally build the application if the `build` flag is set
if [[ "$BUILD" == "true" ]]; then
  build_app
else
  echo "Skipping application build"
fi

# Deploy the infrastructure
deploy_infra
