from flask import Blueprint, request, jsonify
from api.models import db, User, Survey, Question, Option, Vote, Invitation

api = Blueprint('api', __name__)

# User Endpoints
@api.route('/users', methods=['POST'])              #### FUNCIONANDO
def create_user():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Aquí debes incluir lógica para validar y crear un nuevo usuario
        new_user = User(email=data['email'], password_hash=data['password'], full_name=data['full_name'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201





@api.route('/users/<int:id>', methods=['GET'])   #### FUNCIONANDO
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.serialize())

@api.route('/users', methods=['GET'])  #### FUNCIONANDO
def get_users():
    users = User.query.all()
    return jsonify([{"id":user.id, "full_name": user.full_name, "email": user.email, "created_at": user.created_at, "is_active": user.is_active } for user in users]), 200      #### CON ESTA SALEN LAS RUTAS EN EL PREVISUALIZADOR HACER PARA TODOS LOS GETS 

@api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.email = data.get('email', user.email)
    user.full_name = data.get('full_name', user.full_name)
    user.is_active = data.get('is_active', user.is_active)
    user.password_hash = data.get('password', user.password_hash)
    db.session.commit()
    return jsonify(user.serialize())

@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

@api.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello from Flask!"}), 200

# (Resto de los endpoints de surveys, questions, options, votes, invitations)




# """
# This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# """
# from flask import Flask, request, jsonify, url_for, Blueprint
# from api.models import db, User
# from api.utils import generate_sitemap, APIException
# from flask_cors import CORS

# api = Blueprint('api', __name__)

# # Allow CORS requests to this API
# CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200
