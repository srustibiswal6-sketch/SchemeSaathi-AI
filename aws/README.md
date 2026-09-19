# AWS Services — SchemeSaathi AI

This directory contains AWS architecture documentation.

## Files

- [`architecture.md`](architecture.md) — Full architecture diagram and service overview
- [`deployment.md`](deployment.md) — Step-by-step deployment guide

## Quick Reference

| Service | Region | Purpose |
|---|---|---|
| Amazon Bedrock | ap-south-1 | LLM explanations (Claude) |
| Amazon S3 | ap-south-1 | Document storage (private) |
| Amazon Textract | ap-south-1 | Document OCR |
| Amazon RDS | ap-south-1 | PostgreSQL (production) |
| Amazon CloudWatch | ap-south-1 | Logs |

## Demo Mode

The entire application runs without AWS credentials when `DEMO_MODE=true`.
All AWS services have mock implementations that produce realistic demo output.
