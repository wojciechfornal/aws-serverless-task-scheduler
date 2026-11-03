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

### tasks

```shell
curl --header "Content-Type: application/json" \
--request POST \
--data '{"title":"New task title","description":"", "remindAt": "2026-11-10T18:00:00.000Z"}' \
http://localhost:3000/task
```

Expected output

```text
{"id":"01a19ff2-62b5-7b6b-abec-6896cff55172","title":"New task title","remindAt":"2026-11-10T18:00:00.000Z","completed":false,"description":""}
```