resource "aws_iam_role" "t-mobile-role" {
  name = "t-mobile-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [
            "lambda.amazonaws.com",
            "states.us-west-2.amazonaws.com",
            "apigateway.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "invoke-lambda" {
  name       = "invoke-lambda"
  roles      = ["${aws_iam_role.t-mobile-role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaFullAccess"
}

resource "aws_iam_policy_attachment" "step-functions" {
  name       = "step-functions"
  roles      = ["${aws_iam_role.t-mobile-role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/AWSStepFunctionsFullAccess"
}
