# AWS Provider Configuration
provider "aws" {
  # Specify the AWS region where resources will be created
  region = var.region

  # Optional: Profile to use if AWS CLI credentials are configured with named profiles
  # profile = var.profile
}
