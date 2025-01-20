#!/bin/bash
set -euo pipefail

# Enable strict error handling:
# -e: Exit immediately if a command exits with a non-zero status.
# -u: Treat unset variables as an error and exit immediately.
# -o pipefail: Ensure the script fails if any command in a pipeline fails.

# Default values for flags
CLEAN=false  # Flag to control whether the .terraform directory should be cleaned.
ENV=""       # Environment variable to specify the deployment environment (e.g., dev or production).

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    clean=*) CLEAN="${1#*=}";; # Extract the value after 'clean=' and assign it to CLEAN.
    env=*) ENV="${1#*=}";;    # Extract the value after 'env=' and assign it to ENV.
    *) echo "Unknown parameter passed: $1"; exit 1;; # Exit if an unknown parameter is passed.
  esac
  shift # Move to the next argument.
done

# Ensure the environment variable ENV is set and valid
if [[ -z "$ENV" ]]; then
  echo "Error: env is required. Usage: ./script.sh env=dev|production clean=true|false"
  exit 1
fi

if [[ "$ENV" != "dev" && "$ENV" != "production" ]]; then
  echo "Error: env must be 'dev' or 'production'."
  exit 1
fi

# Conditional removal of the .terraform directory if CLEAN is true
if [[ "$CLEAN" == "true" ]]; then
  echo "Cleaning .terraform directory"
  rm -rf .terraform || true # Remove the .terraform directory and ignore errors if it doesn't exist.
else
  echo "Skipping .terraform cleanup"
fi

# Initialize Terraform and ensure the correct workspace is selected
terraform init -input=false # Initialize Terraform without interactive input.
terraform workspace new "$ENV" || true # Create a new workspace for the specified environment if it doesn't exist.
terraform workspace select "$ENV" # Select the workspace for the specified environment.

# Function to build the React application
build_react_app () {
  cd .. # Navigate to the parent directory where the React application resides.
  yarn install # Install all dependencies defined in package.json.
  yarn build:dev # Build the React application in development mode.
  cd infra # Navigate back to the infra directory where the Terraform configuration is located.
}

# Function to deploy infrastructure using Terraform
deploy_infra () {
  echo "Deploying infra for environment: $ENV"
  terraform apply -input=false -auto-approve -var-file="env/$ENV.tfvars" 
  # Apply the Terraform configuration using the specified environment variable file.

  terraform apply -var="environment=$ENV" -var="project_name=MoviesApp" -auto-approve 
  # Reapply Terraform with additional variables (e.g., environment and project_name).
}

# Build the React application
build_react_app

# Deploy the infrastructure
deploy_infra
