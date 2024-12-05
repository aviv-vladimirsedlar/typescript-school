# Lambda Layer for Core Node Modules
resource "aws_lambda_layer_version" "node_modules_layer_core" {
  # Name of the Lambda layer, including the environment (e.g., dev or production)
  layer_name = "node-modules-layer-core-${var.environment}"

  # Description of the Lambda layer for identification in the AWS Management Console
  description = "Layer containing core node_modules for ${var.environment}"

  # Specify compatible runtime for this layer (must match the runtime used in Lambda functions)
  compatible_runtimes = ["nodejs20.x"]

  # Path to the ZIP file containing the core node modules
  filename = "${path.module}/../layer-core.zip"
}

# Lambda Layer for Project-Specific Node Modules
resource "aws_lambda_layer_version" "node_modules_layer_project" {
  # Name of the project-specific Lambda layer
  layer_name = "node-modules-layer-project-${var.environment}"

  # Description to differentiate it from the core node_modules layer
  description = "Layer containing project-specific node_modules for ${var.environment}"

  # Specify compatible runtime for this layer
  compatible_runtimes = ["nodejs20.x"]

  # Path to the ZIP file containing the project-specific node modules
  filename = "${path.module}/../layer-project.zip"
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  # Name of the IAM role with the environment name appended
  name = "lambda-role-${var.environment}"

  # Policy that allows the Lambda service to assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        # Allows Lambda to assume this role
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com" # Principal is the Lambda service
        }
      }
    ]
  })

  # Tags to organize and identify the IAM role
  tags = {
    Name        = "Lambda Execution Role"
    Environment = var.environment
  }
}

# Attach Policy for VPC Access and Basic Lambda Permissions
resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
  # Attach a policy to allow Lambda to access resources in a VPC
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution_policy" {
  # Attach a policy for basic Lambda execution, including logging to CloudWatch
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function Configuration
resource "aws_lambda_function" "lambda_api" {
  # Name of the Lambda function
  function_name = "api-lambda-${var.environment}"

  # Path to the ZIP file containing the Lambda function code
  filename = "${path.module}/../lambda-${var.environment}.zip"

  # Entry point of the Lambda function
  handler = "dist/src/index.handler"

  # Runtime environment for the Lambda function
  runtime = "nodejs20.x"

  # IAM role ARN for the Lambda function
  role = aws_iam_role.lambda_role.arn

  # Configure memory and timeout settings
  memory_size = 256 # Memory in MB
  timeout     = 15  # Timeout in seconds

  # Publish a new version of the Lambda function on each deployment
  publish = true

  # Ensure the function gets updated when the ZIP file changes
  source_code_hash = filebase64sha256("${path.module}/../lambda-${var.environment}.zip")

  # Ensure Lambda waits for the layers to be created before using them
  depends_on = [
    aws_lambda_layer_version.node_modules_layer_core,
    aws_lambda_layer_version.node_modules_layer_project
  ]

  # Attach layers to the Lambda function
  layers = [
    aws_lambda_layer_version.node_modules_layer_core.arn,
    aws_lambda_layer_version.node_modules_layer_project.arn
  ]

  # Define environment variables for the Lambda function
  environment {
    variables = {
      NODE_ENV          = var.environment # Environment (e.g., dev, production)
      NODE_PATH         = "/opt/nodejs/node20/node_modules:/var/task/node_modules" # Include paths for layers and function
      POSTGRES_HOST     = aws_rds_cluster.aurora_cluster.endpoint
      POSTGRES_USER     = var.master_username
      POSTGRES_PASSWORD = var.master_password
      POSTGRES_DB       = var.db_name
      POSTGRES_PORT     = 5432
      DATABASE_URL      = "postgresql://${var.master_username}:${var.master_password}@${aws_rds_cluster.aurora_cluster.endpoint}:5432/${var.db_name}" # Connection string for PostgreSQL
    }
  }

  # Configure VPC access for the Lambda function
  vpc_config {
    # Use private subnets for security
    subnet_ids = aws_subnet.private_subnet[*].id

    # Specify security groups to control access
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  # Tags to help organize and identify the Lambda function
  tags = {
    Name        = "API Lambda Function"
    Environment = var.environment
  }
}
