# aws-serverless-task-scheduler
AWS Serverless Task Scheduler

## Main skills practiced in the project

API, Lambda, DynamoDB, Terraform

## Checking APIs

### health

```shell
curl -i http://localhost:3000/health
```

Expected output

```text
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
content-length: 15
Date: Mon, 02 Nov 2026 20:37:35 GMT
Connection: keep-alive
Keep-Alive: timeout=72

{"status":"ok"}
```