# aws-serverless-task-scheduler
AWS Serverless Task Scheduler

## Idea for an architecture

This is still a work in progress...

<img width="1500" height="570" alt="image" src="https://github.com/user-attachments/assets/7d31d764-59b5-446a-a0dc-c8cb4368b196" />


- Terraform defines the infrastructure.
- The client sends HTTP requests through API Gateway to the TypeScript/Fastify API Lambda.
- DynamoDB holds task records.
- EventBridge Scheduler manages one-time reminders and invokes the reminder Lambda, which initially records (logs) the reminder. No delivery (push, sms, e-mail, whatever) yet.
- IAM roles provide least-privilege permissions.
- CloudWatch receives logs and metrics.
  

**TODO**

- [ ] Retry behavior
- [ ] duplicate handling
- [ ] Failure recovery
- [ ] Cleanup

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
