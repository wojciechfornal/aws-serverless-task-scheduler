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

See [Wiki](https://github.com/wojciechfornal/aws-serverless-task-scheduler/wiki) for more.
