resource "aws_sfn_state_machine" "t-mobile-state-machine" {
  name     = "t-mobile-state-machine"
  role_arn = "${aws_iam_role.t-mobile-role.arn}"

  definition = <<EOF
{
  "StartAt": "Check number",
  "States": {
    "Check number": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.check-number.arn}",
      "Next": "Odd or even?"
    },

    "Odd or even?": {
      "Type" : "Choice",
      "Choices": [
        {
          "Variable": "$",
          "BooleanEquals": true,
          "Next": "Process even"
        },
        {
          "Variable": "$",
          "BooleanEquals": false,
          "Next": "Process odd"
        }
      ],
      "Default": "Incorrect value"
    },

    "Process even": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.process-even.arn}",
      "End": true
    },

    "Process odd": {
      "Type": "Task",
      "Resource": "${aws_lambda_function.process-odd.arn}",
      "End": true
    },

    "Incorrect value": {
      "Type": "Fail",
      "Cause": "No Matches!"
    }
  }
}
EOF
}
