variable "region" {
  default = "europe-west1"
}

variable "zones" {
  default = ["europe-west1-a", "europe-west1-b", "europe-west1-c"]
}

variable "instance-type" {
  default = "f1-micro"
}

variable "disk-size" {
  default = 10
}

variable "initial-node-count" {
  default = 1
}

variable "kubernetes-username" {}

variable "kubernetes-password" {}
