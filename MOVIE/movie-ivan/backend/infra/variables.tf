variable "region" {
  description = "AWS region" # Specifies the AWS region where resources will be deployed (e.g., us-east-1, eu-west-2).
  type        = string       # The data type is string, ensuring the input is a valid region identifier.
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)" # Identifies the environment type, such as development (dev) or production (prod).
  type        = string                                      
}

variable "project_name" {
  description = "The name of the project" # Sets the name of your project, which can be used for tagging or naming AWS resources.
  type        = string
}

variable "master_username" {
  description = "Master username for the database" # The username for the Aurora database cluster.
  type        = string                             # String type ensures input is a valid username.
}

variable "master_password" {
  description = "Master password for the database" # The password for the Aurora database cluster. Ensure this value is securely stored.
  type        = string                             # Sensitive data such as passwords must be handled carefully.
}

variable "db_name" {
  description = "Default database name" # The name of the primary database in the Aurora cluster.
  type        = string
}
