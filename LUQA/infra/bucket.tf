# Generate a Random Suffix for Unique Bucket Names
# This prevents naming conflicts since S3 bucket names must be globally unique.
resource "random_id" "bucket_suffix" {
  byte_length = 4 # Generates a 4-byte random suffix (8-character hexadecimal string).
}

# Create an S3 Bucket for Static Website Hosting
# This bucket will store your React application's build files and host them for CloudFront to access.
resource "aws_s3_bucket" "movies_frontend" {
  bucket = "${var.bucket_prefix}-${var.environment}-${random_id.bucket_suffix.hex}" # Unique bucket name with environment and random suffix.

  # Tags to help organize and identify resources in AWS.
  tags = {
    Environment = var.environment # Environment tag, e.g., dev, staging, production.
    Project     = var.project_name # Project tag to identify this resource belongs to MoviesApp.
  }
}

# Enable Static Website Hosting for the S3 Bucket
# Configures the bucket to serve static files like a web server.
resource "aws_s3_bucket_website_configuration" "movies_frontend_website" {
  bucket = aws_s3_bucket.movies_frontend.bucket

  index_document {
    suffix = "index.html" # The main entry point for the React application.
  }

  error_document {
    key = "index.html" # SPA redirects all errors to index.html for client-side routing.
  }
}

# Enforce Ownership Controls on the S3 Bucket
# Ensures all objects uploaded are owned by the bucket owner.
resource "aws_s3_bucket_ownership_controls" "movies_frontend_ownership" {
  bucket = aws_s3_bucket.movies_frontend.id

  rule {
    object_ownership = "BucketOwnerEnforced" # Bucket owner automatically owns all objects, disabling ACLs.
  }
}

# Restrict Public Access to the S3 Bucket
# This ensures the bucket is only accessible through CloudFront.
resource "aws_s3_bucket_public_access_block" "movies_frontend_access_block" {
  bucket                  = aws_s3_bucket.movies_frontend.id
  block_public_acls       = true  # Blocks all public ACLs on objects in the bucket.
  block_public_policy     = true  # Prevents public bucket policies.
  ignore_public_acls      = true  # Ignores any public ACLs.
  restrict_public_buckets = true  # Restricts making the bucket public.
}

# Upload React Build Files to the S3 Bucket
# Syncs the local build files with the S3 bucket.
resource "aws_s3_object" "react_app_files" {
  for_each = fileset("${path.module}/../build", "**") # Matches all files in the build directory.

  bucket        = aws_s3_bucket.movies_frontend.bucket
  key           = each.key # Sets the S3 object key to the file's relative path.
  source        = "${path.module}/../build/${each.key}" # Path to the local file.
  etag          = filemd5("${path.module}/../build/${each.key}") # Adds an MD5 hash for integrity checks.
  content_type  = lookup(
    {
      "html" = "text/html",
      "css"  = "text/css",
      "js"   = "application/javascript",
      "png"  = "image/png",
      "ico"  = "image/x-icon"
    },
    regex("([^\\.]+)$", each.key)[0],
    "application/octet-stream" # Default content type for unknown file types.
  )
}
