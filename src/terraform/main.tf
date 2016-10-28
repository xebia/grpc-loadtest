resource "google_container_cluster" "gke-cluster" {
  name = "${var.name}"
  zone = "${var.zone}"
  initial_node_count = "${var.initial-node-count}"

  master_auth {
    username = "${var.kubernetes-username}"
    password = "${var.kubernetes-password}"
  }

  node_config {
    machine_type = "${var.instance-type}"
    disk_size_gb = "${var.disk-size}"

    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring"
    ]
  }
}
