provider "aws" {
  alias = "us-west-2"
}

resource "aws_db_instance" "rds" {
  provider = aws.us-west-2
  allocated_storage = var.allocated_storage
  storage_type = "gp2"
  engine = "postgres"
  engine_version = "10.6"
  instance_class = var.instance_class
  name = var.name
	port = var.port
  identifier = var.identifier
  username = var.username
  password = var.password
  multi_az = true
  maintenance_window = "mon:10:00-mon:10:30"
  deletion_protection = true
  vpc_security_group_ids = ["sg-0aa79e5467cb7e421"]
  db_subnet_group_name = "default-vpc-c511e7bd"
  storage_encrypted = true
  kms_key_id = "arn:aws:kms:us-west-2:817276302724:key/f5f75677-d8e3-4650-af4c-5df23aad7b83"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ssm_parameter" "username" {
	name = "${var.prefix}/DB_USER"
	value = aws_db_instance.rds.username
	type = "String"
	overwrite = true
}

resource "aws_ssm_parameter" "password" {
	name = "${var.prefix}/DB_PASSWORD"
	value = var.password
	type = "SecureString"
	overwrite = true
}

resource "aws_ssm_parameter" "host" {
	name = "${var.prefix}/DB_HOST"
	value = aws_db_instance.rds.address
	type = "String"
	overwrite = true
}

resource "aws_ssm_parameter" "port" {
	name = "${var.prefix}/DB_PORT"
	value = aws_db_instance.rds.port
	type = "String"
	overwrite = true
}

resource "aws_ssm_parameter" "name" {
	name = "${var.prefix}/DB_NAME"
	value = aws_db_instance.rds.name
	type = "String"
	overwrite = true
}
