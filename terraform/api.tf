resource "aws_api_gateway_rest_api" "t-mobile-infrastructure" {
  name        = "T-Mobile Infrastructure"
  description = "This is API for T-Mobile infrastructure."
}

########### GET (check-number) ###########

resource "aws_api_gateway_resource" "check-number" {
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  parent_id   = "${aws_api_gateway_rest_api.t-mobile-infrastructure.root_resource_id}"
  path_part   = "check-number"
}

resource "aws_api_gateway_method" "check-number-get" {
  rest_api_id   = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id   = "${aws_api_gateway_resource.check-number.id}"
  http_method   = "GET"
  authorization = "NONE"
  request_parameters {
    "method.request.querystring.number" = true
  }
}

resource "aws_api_gateway_integration" "check-number" {
  rest_api_id             = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id             = "${aws_api_gateway_resource.check-number.id}"
  http_method             = "${aws_api_gateway_method.check-number-get.http_method}"
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.check-number.arn}/invocations"
  credentials             = "arn:aws:iam::${var.account_id}:role/${aws_iam_role.t-mobile-role.name}"

  request_templates {
    "application/json" = <<EOF
    {
      "number": $input.params('number')
    }
    EOF
  }
}

resource "aws_api_gateway_method_response" "check-number-get-200" {
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id = "${aws_api_gateway_resource.check-number.id}"
  http_method = "${aws_api_gateway_method.check-number-get.http_method}"
  status_code = "200"
  response_models {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "check-number-get-200-response" {
  depends_on  = [ "aws_api_gateway_integration.check-number" ]
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id = "${aws_api_gateway_resource.check-number.id}"
  http_method = "${aws_api_gateway_method.check-number-get.http_method}"
  status_code = "${aws_api_gateway_method_response.check-number-get-200.status_code}"
}

resource "aws_lambda_permission" "check-number" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.check-number.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.t-mobile-infrastructure.id}/*/*/*"
}

########### POST (get-voucher) ###########

resource "aws_api_gateway_resource" "get-voucher" {
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  parent_id   = "${aws_api_gateway_rest_api.t-mobile-infrastructure.root_resource_id}"
  path_part   = "get-voucher"
}

resource "aws_api_gateway_method" "get-voucher-post" {
  rest_api_id   = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id   = "${aws_api_gateway_resource.get-voucher.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get-voucher" {
  rest_api_id             = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id             = "${aws_api_gateway_resource.get-voucher.id}"
  http_method             = "${aws_api_gateway_method.get-voucher-post.http_method}"
  integration_http_method = "POST"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${var.region}:states:action/StartExecution"
  credentials             = "arn:aws:iam::${var.account_id}:role/${aws_iam_role.t-mobile-role.name}"

  request_templates {
    "application/json" = <<EOF
    {
      "input": "{\"memberId\":\"$input.json('$.memberId')\",\"campaignId\":\"$input.json('$.campaignId')\"}",
      "stateMachineArn": "${aws_sfn_state_machine.get-voucher-state-machine.id}"
    }
    EOF
  }
}

resource "aws_api_gateway_method_response" "get-voucher-post-200" {
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id = "${aws_api_gateway_resource.get-voucher.id}"
  http_method = "${aws_api_gateway_method.get-voucher-post.http_method}"
  status_code = "200"
  response_models {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "get-voucher-post-200-response" {
  depends_on  = [ "aws_api_gateway_integration.get-voucher" ]
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  resource_id = "${aws_api_gateway_resource.get-voucher.id}"
  http_method = "${aws_api_gateway_method.get-voucher-post.http_method}"
  status_code = "${aws_api_gateway_method_response.get-voucher-post-200.status_code}"
}

########### API deployment ###########

resource "aws_api_gateway_deployment" "t-mobile-infrastructure" {
  depends_on = [
    "aws_api_gateway_method.check-number-get",
    "aws_api_gateway_integration.check-number",
    "aws_api_gateway_method.get-voucher-post",
    "aws_api_gateway_integration.get-voucher"
  ]
  rest_api_id = "${aws_api_gateway_rest_api.t-mobile-infrastructure.id}"
  stage_name = "dev"
}
