# Define the HTTP API for API Gateway
resource "aws_apigatewayv2_api" "lambda_api" {
  # A name for the API Gateway to easily identify it.
  name = "Lambda API"

  # Protocol type for the API Gateway.
  # HTTP is suitable for simple APIs; use "WEBSOCKET" for real-time communication.
  protocol_type = "HTTP"
}

# Define the integration between API Gateway and the Lambda function
resource "aws_apigatewayv2_integration" "lambda_integration" {
  # ID of the API Gateway that this integration belongs to.
  api_id = aws_apigatewayv2_api.lambda_api.id

  # Integration type defines how API Gateway connects to the backend.
  # "AWS_PROXY" sends the request directly to the Lambda function without additional processing.
  integration_type = "AWS_PROXY"

  # ARN of the Lambda function that handles the requests.
  # This connects the API Gateway to the specified Lambda function.
  integration_uri = aws_lambda_function.lambda_api.arn
}

# Define a route that connects API Gateway endpoints to the Lambda integration
resource "aws_apigatewayv2_route" "default_route" {
  # ID of the API Gateway for which this route is defined.
  api_id = aws_apigatewayv2_api.lambda_api.id

  # Define the HTTP method and path for the route.
  # "ANY /{proxy+}" means that all HTTP methods and paths are forwarded to the Lambda function.
  # The `{proxy+}` captures everything after the base URL, allowing dynamic paths.
  route_key = "ANY /{proxy+}"

  # Target specifies the integration that the route should forward requests to.
  # This is dynamically linked to the `aws_apigatewayv2_integration` resource.
  target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Create a deployment stage for the API Gateway
resource "aws_apigatewayv2_stage" "default_stage" {
  # ID of the API Gateway for which the stage is created.
  api_id = aws_apigatewayv2_api.lambda_api.id

  # Name of the stage; "$default" is a reserved stage name that routes requests without specifying a stage.
  name = "$default"

  # Enable auto-deployment, so changes to routes or integrations are deployed automatically.
  auto_deploy = true
}

# Grant API Gateway permission to invoke the Lambda function
resource "aws_lambda_permission" "api_gateway_invoke" {
  # A unique statement ID for the permission.
  # Helps identify this specific permission in the Lambda's policy.
  statement_id = "AllowAPIGatewayInvoke"

  # The action that is being allowed; in this case, invoking the Lambda function.
  action = "lambda:InvokeFunction"

  # ARN of the Lambda function that API Gateway is allowed to invoke.
  function_name = aws_lambda_function.lambda_api.arn

  # Specify the principal service that is being granted permission; in this case, API Gateway.
  principal = "apigateway.amazonaws.com"

  # Restrict the permission to the specific API Gateway and its stages/routes.
  # The `execution_arn` of the API Gateway dynamically includes all stages and routes.
  source_arn = "${aws_apigatewayv2_api.lambda_api.execution_arn}/*/*"
}
