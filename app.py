from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from dotenv import load_dotenv
from routes.deployment_routes import deployment_bp
from db import db

load_dotenv()

app = Flask(__name__)   
CORS(app)

# Config
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour in seconds
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(deployment_bp)

@app.route('/ping')
def ping():
    return jsonify({'message': 'pong'})

# --- Registration ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if db.users.find_one({'email': email}):
        return jsonify({'msg': 'Email already registered'}), 400
    password_hash = generate_password_hash(password)
    user = {
        'name': name,
        'email': email,
        'password_hash': password_hash,
        'created_at': datetime.utcnow(),
        'last_login': None
    }
    result = db.users.insert_one(user)
    access_token = create_access_token(identity=str(result.inserted_id))
    return jsonify({'token': access_token}), 201

# --- Login ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = db.users.find_one({'email': email})
    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'msg': 'Invalid credentials'}), 401
    db.users.update_one({'_id': user['_id']}, {'$set': {'last_login': datetime.utcnow()}})
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({'token': access_token}), 200

# --- Example Protected Route ---
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'msg': 'You are logged in!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 2000)))