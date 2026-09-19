"""
SchemeSaathi AI — Amazon S3 Document Service

Handles secure document storage.
In DEMO_MODE, saves files locally.
In production, uploads to a private S3 bucket with presigned URL access.
"""
import os
import shutil
import uuid
from typing import Optional

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "schemesaathi-documents")
S3_UPLOAD_PREFIX = os.getenv("S3_UPLOAD_PREFIX", "uploads/")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
LOCAL_UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"
)


def _get_s3_client():
    import boto3
    return boto3.client("s3", region_name=AWS_REGION)


def upload_document(file_bytes: bytes, original_filename: str, profile_id: int) -> dict:
    """
    Upload a document. Returns a dict with storage key and mode.
    In demo mode: saves locally.
    In production: uploads to S3 private bucket.
    """
    unique_name = f"{profile_id}_{uuid.uuid4().hex[:8]}_{original_filename}"

    if DEMO_MODE:
        os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)
        local_path = os.path.join(LOCAL_UPLOAD_DIR, unique_name)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        return {
            "storage_key": unique_name,
            "local_path": local_path,
            "mode": "local",
            "bucket": None,
        }

    # Production: upload to S3
    s3_key = f"{S3_UPLOAD_PREFIX}{unique_name}"
    client = _get_s3_client()
    client.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=s3_key,
        Body=file_bytes,
        ServerSideEncryption="AES256",
        # Documents are private — no public ACL
    )
    return {
        "storage_key": s3_key,
        "local_path": None,
        "mode": "s3",
        "bucket": S3_BUCKET_NAME,
    }


def get_signed_url(storage_key: str, expires_in: int = 300) -> Optional[str]:
    """
    Generate a temporary presigned URL for a stored document.
    Returns None in demo mode (direct local access).
    """
    if DEMO_MODE:
        return None

    client = _get_s3_client()
    url = client.generate_presigned_url(
        "get_object",
        Params={"Bucket": S3_BUCKET_NAME, "Key": storage_key},
        ExpiresIn=expires_in,
    )
    return url


def delete_document(storage_key: str) -> bool:
    """Delete a stored document. Returns True on success."""
    if DEMO_MODE:
        local_path = os.path.join(LOCAL_UPLOAD_DIR, storage_key)
        if os.path.exists(local_path):
            os.remove(local_path)
        return True

    try:
        client = _get_s3_client()
        client.delete_object(Bucket=S3_BUCKET_NAME, Key=storage_key)
        return True
    except Exception:
        return False
