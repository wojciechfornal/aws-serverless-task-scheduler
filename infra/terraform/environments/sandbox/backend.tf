terraform {

  backend "s3" {
    bucket       = "aws-serverless-task-scheduler-359598898883-us-east-1-an"
    key          = "sandbox/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
  
}
