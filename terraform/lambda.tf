data "archive_file" "lambda_zip" {
    type        = "zip"
    source_dir  = "../src/lambda"
    output_path = "zip/lambda.zip"
}

resource "aws_lambda_function" "check-number" {
    filename = "zip/lambda.zip"
    function_name = "check-number"
    handler = "check-number.handler"
    runtime = "nodejs6.10"
    role = "${aws_iam_role.t-mobile-role.arn}"
}

resource "aws_lambda_function" "process-even" {
    filename = "zip/lambda.zip"
    function_name = "process-even"
    handler = "process-even.handler"
    runtime = "nodejs6.10"
    role = "${aws_iam_role.t-mobile-role.arn}"
}

resource "aws_lambda_function" "process-odd" {
    filename = "zip/lambda.zip"
    function_name = "process-odd"
    handler = "process-odd.handler"
    runtime = "nodejs6.10"
    role = "${aws_iam_role.t-mobile-role.arn}"
}
