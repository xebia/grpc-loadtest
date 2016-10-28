variable "region" {
  default = "europe-west1"
}

variable "zone" {
  default = "europe-west1-b"
}

variable "name" {
  default = "gke-cluster"
}

variable "instance-type" {
  default = "n1-standard-1"
}

variable "disk-size" {
  default = 10
}

variable "initial-node-count" {
  default = 1
}

variable "kubernetes-username" {}

variable "kubernetes-password" {}
