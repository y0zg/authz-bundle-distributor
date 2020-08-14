terraform {
  backend "s3" {
    bucket = "twig-terraform"
    key = "ngss/authz-bundle-distributor/terraform.tfstate"
    region = "eu-west-1"
    dynamodb_table = "twig-terraform"
  }
}

provider "aws" {
  profile    = "default"
  region     = "eu-west-1"
}

provider "aws" {
  alias = "us-west-2"
  region = "us-west-2"
  profile = "default"
}

module "iam" {
  source = "./modules/iam"
  family = var.family
  repoName = var.repoName
  environments = var.environments
}

module "ecr" {
  source = "./modules/ecr"
  family = var.family
  repoName = var.repoName
}

