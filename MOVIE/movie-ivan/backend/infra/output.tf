# Outputs for Aurora Database Cluster Endpoints
output "aurora_cluster_endpoint" {
  # Provides the primary endpoint for the Aurora cluster (read/write operations).
  value       = aws_rds_cluster.aurora_cluster.endpoint
  description = "The endpoint of the Aurora database cluster"
}

output "aurora_reader_endpoint" {
  # Provides the reader endpoint for the Aurora cluster (optimized for read-only operations).
  value       = aws_rds_cluster.aurora_cluster.reader_endpoint
  description = "The reader endpoint of the Aurora database cluster"
}

# Lambda Function Output
output "lambda_function_arn" {
  # Outputs the Amazon Resource Name (ARN) of the Lambda function, useful for debugging or integrating with other services (e.g., API Gateway, EventBridge).
  value       = aws_lambda_function.lambda_api.arn
  description = "The ARN of the Lambda function"
}

# API Gateway Outputs
output "api_gateway_domain" {
  # Provides the public domain name of the API Gateway to be used for invoking your Lambda function.
  value       = aws_apigatewayv2_api.lambda_api.api_endpoint
  description = "The domain name for the API Gateway"
}

output "cloudfront_domain_name_debug" {
  # Outputs the stripped-down domain name being used by CloudFront (removing the protocol for debugging purposes).
  value       = replace(aws_apigatewayv2_api.lambda_api.api_endpoint, "https://", "")
  description = "CloudFront domain name being used"
}
