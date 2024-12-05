# Automatically fetch available availability zones (AZs) in the current region
data "aws_availability_zones" "available" {
  state = "available" # Filter for only available zones in the region
}

# Create a new Virtual Private Cloud (VPC)
resource "aws_vpc" "api_vpc" {
  cidr_block = "10.0.0.0/16" # Defines the IP address range for the VPC (supports up to ~65,000 IP addresses)
  enable_dns_support   = true   # Enable DNS resolution inside the VPC
  enable_dns_hostnames = true   # Enable assigning DNS hostnames to resources within the VPC (required for Lambda and RDS)

  tags = {
    Name        = "API VPC" # Name tag for easier identification
    Environment = var.environment # Dynamic tag to specify the deployment environment (e.g., dev, prod)
  }
}

# Create subnets in multiple availability zones
resource "aws_subnet" "private_subnet" {
  count = 2 # Create 2 private subnets for high availability

  vpc_id            = aws_vpc.api_vpc.id # Attach the subnets to the VPC
  cidr_block        = cidrsubnet(aws_vpc.api_vpc.cidr_block, 8, count.index) # Split the VPC CIDR block into smaller subnets
  availability_zone = data.aws_availability_zones.available.names[count.index] # Assign each subnet to a unique availability zone

  tags = {
    Name        = "Private Subnet ${count.index}" # Assign a unique name for each subnet (e.g., Private Subnet 0, Private Subnet 1)
    Environment = var.environment # Dynamic tag for the deployment environment
  }
}

# Security Group for Aurora database
resource "aws_security_group" "aurora_sg" {
  name        = "aurora-sg" # Security group name
  description = "Security group for Aurora database" # Description of the security group
  vpc_id      = aws_vpc.api_vpc.id # Attach the security group to the VPC

  # Allow inbound traffic for PostgreSQL (port 5432) from Lambda's security group
  ingress {
    description     = "Allow PostgreSQL access from Lambda"
    from_port       = 5432 # PostgreSQL default port
    to_port         = 5432
    protocol        = "tcp" # Use TCP protocol
    security_groups = [aws_security_group.lambda_sg.id] # Allow connections only from the Lambda security group
    cidr_blocks     = ["104.30.134.142/32"] # Replace with your public IP for direct database access during testing
  }

  # Allow all outbound traffic from the database
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"] # Allow traffic to any destination
  }

  tags = {
    Name        = "Aurora Security Group"
    Environment = var.environment
  }
}

# Security Group for Lambda functions
resource "aws_security_group" "lambda_sg" {
  name        = "lambda-sg" # Security group name
  description = "Security group for Lambda functions"
  vpc_id      = aws_vpc.api_vpc.id # Attach the security group to the VPC

  # Allow inbound traffic only within the VPC
  ingress {
    description = "Allow traffic within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = [aws_vpc.api_vpc.cidr_block] # Restrict traffic to the VPC CIDR block
  }

  # Allow all outbound traffic from the Lambda function
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"] # Allow traffic to any destination
  }

  tags = {
    Name        = "Lambda Security Group"
    Environment = var.environment
  }
}

# Add an Internet Gateway to the VPC
resource "aws_internet_gateway" "api_igw" {
  vpc_id = aws_vpc.api_vpc.id # Attach the Internet Gateway to the VPC

  tags = {
    Name        = "API Internet Gateway"
    Environment = var.environment
  }
}

# Route Table for public internet access
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.api_vpc.id # Attach the route table to the VPC

  # Define a route to send all traffic (0.0.0.0/0) to the Internet Gateway
  route {
    cidr_block = "0.0.0.0/0" # Route all internet-bound traffic
    gateway_id = aws_internet_gateway.api_igw.id # Use the Internet Gateway as the target
  }

  tags = {
    Name        = "Public Route Table"
    Environment = var.environment
  }
}

# Associate the Route Table with Subnets
resource "aws_route_table_association" "public_subnet_association" {
  count          = 2 # Ensure 2 associations for the two private subnets
  subnet_id      = aws_subnet.private_subnet[count.index].id # Attach the route table to each subnet
  route_table_id = aws_route_table.public_route_table.id # Use the public route table for internet access
}
