# variables.tf
# This file is used to declare the structure, default values, and types of all variables.

# AWS Region
variable "region" {
  description = "AWS region"
  default     = "eu-west-2"
}

# Deployment environment (e.g., dev, staging, production)
variable "environment" {
  description = "The deployment environment"
  type        = string
}

# Project name
variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "MoviesApp"
}

# Default TTL for CloudFront
variable "default_ttl" {
  description = "Default time-to-live (TTL) for cached objects in CloudFront (in seconds)"
  type        = number
  default     = 3600
}

# Maximum TTL for CloudFront
variable "max_ttl" {
  description = "Maximum time-to-live (TTL) for cached objects in CloudFront (in seconds)"
  type        = number
  default     = 86400
}

# S3 Bucket Name Prefix
variable "bucket_prefix" {
  description = "Prefix for the S3 bucket name"
  type        = string
  default     = "movies-frontend"
}
