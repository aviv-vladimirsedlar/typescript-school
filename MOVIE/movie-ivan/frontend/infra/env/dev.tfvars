# dev.tfvars

region         = "eu-west-2"         # AWS region
environment    = "dev"               # Environment name
project_name   = "MoviesAppDev"      # Environment-specific project name
default_ttl    = 300                 # Lower TTL for dev to see changes quicker
max_ttl        = 3600                # Shorter cache in development
bucket_prefix  = "movies-frontend"   # Common bucket prefix
