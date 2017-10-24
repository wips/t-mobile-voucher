provider "aws" {
  # todo: use 'profile'
  # profile = "${var.aws_profile}"
  access_key    = "${var.access_key}"
  secret_key    = "${var.secret_key}"
  region        = "${var.aws_region}"
}
