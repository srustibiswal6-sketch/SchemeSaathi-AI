# AWS Deployment Guide — SchemeSaathi AI

## Prerequisites

- AWS CLI installed and configured
- Docker (for containerized deployment)
- Python 3.11+
- Node.js 20+

## Environment Setup

```bash
# Clone and configure
cp .env.example .env
# Fill in AWS credentials and configuration
```

## Bedrock Setup

1. Enable Claude model access in AWS Bedrock console → `ap-south-1`
2. Request access for: `anthropic.claude-3-haiku-20240307-v1:0`
3. Set `DEMO_MODE=false` and `BEDROCK_MODEL_ID` in `.env`

## S3 Setup

```bash
# Create private S3 bucket
aws s3api create-bucket \
  --bucket schemesaathi-documents \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Block all public access
aws s3api put-public-access-block \
  --bucket schemesaathi-documents \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

## Textract IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["textract:DetectDocumentText", "textract:AnalyzeDocument"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::schemesaathi-documents/uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel"],
      "Resource": "arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
    }
  ]
}
```

## Backend Deployment

```bash
cd backend
pip install -r requirements.txt
python database/seed.py
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Frontend Deployment

```bash
cd frontend
npm install
VITE_API_URL=https://your-api-domain.com/api npm run build
# Deploy dist/ to S3 + CloudFront or Vercel/Netlify
```
