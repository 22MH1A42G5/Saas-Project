from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import boto3
import uuid
from botocore.exceptions import ClientError
import os
from db import db
from bson import ObjectId

deployment_bp = Blueprint('deployment', __name__)

@deployment_bp.route('/start-deployment', methods=['POST'])
@jwt_required()
def start_deployment():
    user_id = str(get_jwt_identity())
    external_id = str(uuid.uuid4())
    deployment = {
        'user_id': user_id,
        'external_id': external_id,
        'arn_validated': False,
        'status': 'external_id_generated',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
        'deployment_logs': [{
            'timestamp': datetime.utcnow(),
            'message': 'Deployment started'
        }]
    }
    result = db.deployments.insert_one(deployment)
    return jsonify({
        'deployment_id': str(result.inserted_id),
        'external_id': external_id,
        'message': 'New deployment started. Use this deployment_id for next steps.'
    }), 201

@deployment_bp.route('/submit-arn', methods=['POST'])
@jwt_required()
def submit_arn():
    data = request.get_json()
    aws_arn = data.get('aws_arn')
    deployment_id = data.get('deployment_id')
    user_id = str(get_jwt_identity())

    if not deployment_id:
        return jsonify({'msg': 'deployment_id is required'}), 400

    deployment = db.deployments.find_one({
        '_id': ObjectId(deployment_id),
        'user_id': user_id,
        'status': {'$in': ['external_id_generated', 'arn_validation_failed']}
    })

    if not deployment:
        return jsonify({'msg': 'Deployment not found or not in correct state'}), 400

    external_id = deployment['external_id']

    try:
        sts = boto3.client(
            'sts',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION")
        )
        assumed_role = sts.assume_role(
            RoleArn=aws_arn,
            RoleSessionName="DeploymentValidation",
            ExternalId=external_id
        )

        session = boto3.Session(
            aws_access_key_id=assumed_role['Credentials']['AccessKeyId'],
            aws_secret_access_key=assumed_role['Credentials']['SecretAccessKey'],
            aws_session_token=assumed_role['Credentials']['SessionToken'],
            region_name=os.getenv("AWS_REGION")
        )

        missing_permissions = check_required_permissions(session)

        if missing_permissions:
            db.deployments.update_one(
                {'_id': deployment['_id']},
                {
                    '$set': {
                        'arn_validated': False,
                        'status': 'arn_validation_failed',
                        'updated_at': datetime.utcnow()
                    },
                    '$push': {
                        'deployment_logs': {
                            'timestamp': datetime.utcnow(),
                            'message': f'ARN validation failed: {missing_permissions}'
                        }
                    }
                }
            )
            return jsonify({
                'msg': 'Role permissions insufficient',
                'missing_permissions': missing_permissions,
                'required_services': [
                    'EC2', 'ECR', 'ECS', 'CodeBuild', 'CodePipeline',
                    'IAM', 'CloudWatch', 'Application Load Balancer'
                ]
            }), 400

        db.deployments.update_one(
            {'_id': deployment['_id']},
            {
                '$set': {
                    'aws_arn': aws_arn,
                    'arn_validated': True,
                    'status': 'arn_validated',
                    'updated_at': datetime.utcnow()
                },
                '$push': {
                    'deployment_logs': {
                        'timestamp': datetime.utcnow(),
                        'message': 'ARN validated successfully'
                    }
                }
            }
        )

        return jsonify({
            'msg': 'ARN validated successfully!',
            'external_id': external_id
        }), 200

    except ClientError as e:
        error_code = e.response['Error']['Code']
        db.deployments.update_one(
            {'_id': deployment['_id']},
            {
                '$set': {
                    'arn_validated': False,
                    'status': 'arn_validation_failed',
                    'updated_at': datetime.utcnow()
                },
                '$push': {
                    'deployment_logs': {
                        'timestamp': datetime.utcnow(),
                        'message': f"AWS Error: {str(e)}"
                    }
                }
            }
        )
        if error_code == 'AccessDenied':
            return jsonify({
                'msg': 'Invalid ARN or External ID',
                'error': str(e)
            }), 400
        else:
            return jsonify({
                'msg': 'AWS Error',
                'error': str(e)
            }), 500

@deployment_bp.route('/submit-github', methods=['POST'])
@jwt_required()
def submit_github():
    data = request.get_json()
    github_repo = data.get('github_repo')
    github_pat = data.get('github_pat')
    stack = data.get('stack')
    env_vars = data.get('env_vars', [])
    deployment_id = data.get('deployment_id')
    user_id = str(get_jwt_identity())

    if not deployment_id:
        return jsonify({'msg': 'deployment_id is required'}), 400

    deployment = db.deployments.find_one({
        '_id': ObjectId(deployment_id),
        'user_id': user_id,
        'arn_validated': True
    })
    if not deployment:
        return jsonify({'msg': 'AWS ARN must be validated first.'}), 400

    db.deployments.update_one(
        {'_id': deployment['_id']},
        {
            '$set': {
                'github_repo': github_repo,
                'github_pat': github_pat,
                'stack': stack,
                'env_vars': env_vars,
                'updated_at': datetime.utcnow(),
                'status': 'github_info_submitted'
            },
            '$push': {
                'deployment_logs': {
                    'timestamp': datetime.utcnow(),
                    'message': 'GitHub info submitted'
                }
            }
        }
    )

    return jsonify({'msg': 'GitHub and stack info saved!'}), 200

@deployment_bp.route('/deployments', methods=['GET'])
@jwt_required()
def list_deployments():
    user_id = str(get_jwt_identity())
    deployments = list(db.deployments.find({'user_id': user_id}))
    for d in deployments:
        d['_id'] = str(d['_id'])
    return jsonify({'deployments': deployments}), 200

def check_required_permissions(session):
    """Check if the assumed role has required permissions"""
    missing_permissions = []

    # Test EC2 permissions
    try:
        ec2 = session.client('ec2')
        ec2.describe_regions()
    except ClientError:
        missing_permissions.append('EC2 access')

    # Test ECR permissions
    try:
        ecr = session.client('ecr')
        ecr.describe_repositories()
    except ClientError:
        missing_permissions.append('ECR access')

    # Test ECS permissions
    try:
        ecs = session.client('ecs')
        ecs.list_clusters()
    except ClientError:
        missing_permissions.append('ECS access')

    # Test CodeBuild permissions
    try:
        codebuild = session.client('codebuild')
        codebuild.list_projects()
    except ClientError:
        missing_permissions.append('CodeBuild access')

    return missing_permissions