# Outputs

# Output the CloudFront Distribution URL
# Provides the URL to access the deployed React app.
output "cloudfront_url" {
  value       = aws_cloudfront_distribution.movies_frontend_cdn.domain_name
  description = "URL for the CloudFront distribution"
}
