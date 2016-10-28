provider "google" {
  credentials = "${file("account.json")}"
  project     = "grpc-loadtest"
  region      = "${var.region}"
}
