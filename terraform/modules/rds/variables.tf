variable "instance_class" {
  type = string
  default = "db.t3.small"
}

variable "allocated_storage" {
  type = number
  default = 100
}

variable "port" {
	type = number
	default = 5432
}

variable "identifier" {
  type = string
}

variable "name" {
  type = string
}

variable "username" {
  type = string
}

variable "password" {
  type = string 
}

variable "prefix" {
  type = string 
}
