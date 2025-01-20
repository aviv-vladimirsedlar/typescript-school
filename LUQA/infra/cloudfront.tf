# Create a CloudFront Origin Access Identity (OAI)
# This identity is used by CloudFront to securely access the S3 bucket.
resource "aws_cloudfront_origin_access_identity" "movies_frontend_oai" {
  comment = "Access Identity for ${var.project_name}" # Descriptive comment for identification.
}

# Define a Bucket Policy for CloudFront Access
# This policy allows only the CloudFront OAI to access the S3 bucket.
resource "aws_s3_bucket_policy" "movies_frontend_policy" {
  bucket = aws_s3_bucket.movies_frontend.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          "AWS": "${aws_cloudfront_origin_access_identity.movies_frontend_oai.iam_arn}" # Grants access to the specific CloudFront OAI.
        },
        Action    = "s3:GetObject", # Permission to read objects in the bucket.
        Resource  = "${aws_s3_bucket.movies_frontend.arn}/*" # Grants access to all objects in the bucket.
      }
    ]
  })
}

# Create a CloudFront Distribution to Serve the React App
# CloudFront caches files at edge locations for faster global access and provides HTTPS support.
resource "aws_cloudfront_distribution" "movies_frontend_cdn" {
  origin {
    domain_name = aws_s3_bucket.movies_frontend.bucket_regional_domain_name # Regional endpoint for the S3 bucket.
    origin_id   = "S3-${aws_s3_bucket.movies_frontend.bucket}"             # Unique ID for the origin.

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.movies_frontend_oai.cloudfront_access_identity_path # Connects CloudFront to the S3 bucket securely.
    }
  }

  enabled = true # Enables the distribution.

  # Configure a default root object for directory-like URLs (e.g., "/").
  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id       = "S3-${aws_s3_bucket.movies_frontend.bucket}" # Connects the default behavior to the S3 origin.
    viewer_protocol_policy = "redirect-to-https" # Redirects HTTP requests to HTTPS for better security.

    allowed_methods = ["GET", "HEAD"] # Limits allowed HTTP methods to safe ones.
    cached_methods  = ["GET", "HEAD"] # Specifies methods cached at CloudFront.

    forwarded_values {
      query_string = false # Disables forwarding query strings to the origin.
      cookies {
        forward = "none" # Prevents forwarding cookies to the origin.
      }
    }

    min_ttl     = 0       # Minimum cache time-to-live (TTL) for objects.
    default_ttl = var.default_ttl # Default TTL for cached objects.
    max_ttl     = var.max_ttl # Maximum TTL for cached objects.
  }

  restrictions {
    geo_restriction {
      restriction_type = "none" # No geographic restrictions.
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true # Uses the default CloudFront SSL certificate for HTTPS.
  }

  # Redirect errors to index.html for proper React routing (e.g., /auth/login).
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  # Tags for identifying the distribution.
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}