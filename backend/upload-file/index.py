import json
import os
import base64
import uuid
import boto3


def handler(event: dict, context) -> dict:
    '''Загрузка файлов задания в облачное хранилище S3 (base64 в JSON)'''
    method = event.get('httpMethod', 'POST')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Method not allowed'})}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid JSON'})}

    file_name = body.get('name') or 'file'
    content_type = body.get('contentType') or 'application/octet-stream'
    data_b64 = body.get('data') or ''

    if ',' in data_b64 and data_b64.startswith('data:'):
        data_b64 = data_b64.split(',', 1)[1]

    if not data_b64:
        return {'statusCode': 400, 'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'No data'})}

    try:
        raw = base64.b64decode(data_b64)
    except Exception:
        return {'statusCode': 400, 'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid base64'})}

    if len(raw) > 10 * 1024 * 1024:
        return {'statusCode': 413, 'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'File too large (max 10MB)'})}

    safe_name = ''.join(c for c in file_name if c.isalnum() or c in '._-') or 'file'
    key = f'tasks/{uuid.uuid4().hex}_{safe_name}'

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)

    cdn_url = f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}'

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'url': cdn_url,
            'name': file_name,
            'size': len(raw),
            'contentType': content_type,
        }),
    }
