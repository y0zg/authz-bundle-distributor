variable "family" {
  type = string
  default = "ngss"
}

variable "repoName" {
  type = string
  default = "authz-bundle-distributor"
}

variable "environments" {
  type    = list(string)
  default = ["compose","ci","qa","staging","production",]
}

