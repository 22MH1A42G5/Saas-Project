# ...existing code...
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Change this in production!
jwt = JWTManager(app)

# In-memory user store (replace with DB later)
users = {}

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
    if username in users:
        return jsonify({"msg": "User already exists"}), 409
    users[username] = password
    return jsonify({"msg": "User registered"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if users.get(username) != password:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@app.route("/api/hello")
@jwt_required(optional=True)
def hello():
    user = get_jwt_identity()
    if user:
        return {"message": f"Hello, {user}!"}
    return {"message": "Hello, World!"}

@app.route("/api/dashboard")
@jwt_required()
def dashboard():
    user = get_jwt_identity()
    return {"message": f"Welcome to your dashboard, {user}!"}

if __name__ == "__main__":
    app.run(debug=True)
# ...existing code...