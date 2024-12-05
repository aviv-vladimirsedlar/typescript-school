# Subnet Group for Aurora database
resource "aws_db_subnet_group" "aurora_subnet_group" {
  # The name of the subnet group for the Aurora cluster.
  # Subnet groups define which subnets the database can use within the VPC.
  name       = "aurora-subnet-group"

  # Associate the subnet group with all private subnets.
  # Private subnets ensure that the database is not directly accessible from the internet.
  subnet_ids = aws_subnet.private_subnet[*].id

  # Tags to identify the subnet group and its environment (e.g., dev, production).
  tags = {
    Name        = "Aurora Subnet Group"
    Environment = var.environment
  }
}

# Aurora RDS Cluster
resource "aws_rds_cluster" "aurora_cluster" {
  # A unique identifier for the Aurora cluster, suffixed by the environment (e.g., dev, production).
  cluster_identifier = "aurora-cluster-${var.environment}"

  # Aurora PostgreSQL engine and version.
  engine           = "aurora-postgresql"
  engine_version   = "15.4"

  # Master username and password for the database.
  # These credentials should ideally be stored securely, e.g., in AWS Secrets Manager or Parameter Store.
  master_username = var.master_username
  master_password = var.master_password

  # Default database name created within the cluster.
  database_name = var.db_name

  # Use the previously created subnet group to define where the cluster can operate.
  db_subnet_group_name = aws_db_subnet_group.aurora_subnet_group.name

  # Security group to control inbound/outbound traffic to the cluster.
  vpc_security_group_ids = [aws_security_group.aurora_sg.id]

  # Skip creating a final snapshot when deleting the cluster (useful for dev environments).
  skip_final_snapshot = true

  # Retain backups for 7 days and specify a preferred backup window.
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"

  # Automatically delete backups when the cluster is deleted.
  delete_automated_backups = true

  # Tags for identifying the cluster and its environment.
  tags = {
    Name        = "Aurora Cluster"
    Environment = var.environment
  }
}

# Aurora Cluster Instance
resource "aws_rds_cluster_instance" "aurora_instance" {
  # Specify the number of instances to create for the cluster.
  # Aurora can have multiple instances for high availability and scaling.
  count = 1

  # Associate the instance with the previously created Aurora cluster.
  cluster_identifier = aws_rds_cluster.aurora_cluster.id

  # Instance class to define the performance and cost.
  # "db.t3.medium" is suitable for small-scale applications; scale up for production.
  instance_class = "db.t3.medium"

  # The database engine must match the cluster's engine.
  engine = "aurora-postgresql"

  # Specify whether the instance should be publicly accessible.
  # Note: This should generally be `false` for production to ensure the database is private.
  publicly_accessible = true

  # Tags for identifying the instance and its environment.
  tags = {
    Name        = "Aurora Instance ${count.index}" # Use the count index for naming multiple instances.
    Environment = var.environment
  }
}
