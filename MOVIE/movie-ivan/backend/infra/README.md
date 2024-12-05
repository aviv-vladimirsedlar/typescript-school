# Terraform Deployment

This document provides details about deploying infrastructure for the project using Terraform, along with automation scripts (`makefile` and `deploy.sh`).

## Overview

- **Infrastructure as Code:** Uses Terraform to define and manage AWS resources.
- **Automation Scripts:** Automates the deployment process with a `makefile` and a Bash script (`deploy.sh`).
- **Environment Management:** Supports `dev` and `production` environments.

## Parameters for Deployment

The deployment process can be customized using the following parameters:

| Parameter | Description                                                                                       | Accepted Values     | Default |
| --------- | ------------------------------------------------------------------------------------------------- | ------------------- | ------- |
| `env`     | Specifies the environment for deployment.                                                         | `dev`, `production` | `dev`   |
| `build`   | Determines whether the frontend should be built before deployment.                                | `true`, `false`     | `true`  |
| `clean`   | Removes any previous Terraform state files and performs a clean initialization before deployment. | `true`, `false`     | `false` |

## Deployment Workflow

**Running deployment**:

```bash
make deploy-build-dev
make deploy-build-production
```

**Destroying deployment**:

```bash
make destroy-dev
make destroy-production
```

## Directory Structure

```graph
infra/
├── deploy.sh       # Main deployment script
├── makefile        # Simplifies execution of deployment commands
├── api-gateway.tf
├── database.tf
├── lambda.tf
├── main.tf
├── outputs.tf
└── public
```

## How to Use Terraform

**Initialize Terraform:**

```bash
terraform init
```

**Plan Infrastructure Changes:**

```bash
terraform plan -var-file=vars/<environment>.tfvars
```

**Apply Infrastructure Changes:**

```bash
terraform apply -var-file=vars/<environment>.tfvars
```

**Destroy Infrastructure:**

```bash
terraform destroy -var-file=vars/<environment>.tfvars
```

## Notes

Make sure to configure your AWS credentials before deployment.
Use environment-specific .tfvars files to manage configurations for dev and production.
