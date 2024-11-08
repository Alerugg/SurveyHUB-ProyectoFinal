from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Survey, Question, Option
import jwt
import datetime
from functools import wraps

api = Blueprint('api', __name__)

SECRET_KEY = 'your_secret_key_here'  # Debes reemplazar esto por una clave secreta segura

# Decorador para proteger los endpoints

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 403

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({"error": "Token is invalid"}), 403

        return f(current_user, *args, **kwargs)

    return decorated

# User Endpoints
@api.route('/users', methods=['POST'])  #### FUNCIONANDO - Actualizado con hashing de contraseña
def create_user():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Verificar si el email ya está registrado
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        # Hashear la contraseña
        password_hash = generate_password_hash(data['password'])

        # Crear el nuevo usuario
        new_user = User(email=data['email'], password_hash=password_hash, full_name=data['full_name'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

@api.route('/login', methods=['POST'])  #### Nuevo endpoint para login
def login_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token, "user_id": user.id}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@api.route('/users/<int:id>', methods=['GET'])  #### FUNCIONANDO
@token_required
def get_user(current_user, id):
    if current_user.id != id:
        return jsonify({"error": "Unauthorized access"}), 403

    user = User.query.get_or_404(id)
    return jsonify(user.serialize())

@api.route('/users', methods=['GET'])  #### FUNCIONANDO
@token_required
def get_users(current_user):
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/users/<int:id>', methods=['PUT'])
@token_required
def update_user(current_user, id):
    if current_user.id != id:
        return jsonify({"error": "Unauthorized access"}), 403

    user = User.query.get_or_404(id)
    data = request.get_json()
    user.email = data.get('email', user.email)
    user.full_name = data.get('full_name', user.full_name)
    user.is_active = data.get('is_active', user.is_active)
    user.password_hash = generate_password_hash(data.get('password', user.password_hash))
    db.session.commit()
    return jsonify(user.serialize())

@api.route('/users/<int:id>', methods=['DELETE'])
@token_required
def delete_user(current_user, id):
    if current_user.id != id:
        return jsonify({"error": "Unauthorized access"}), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

# Survey Endpoints
@api.route('/surveys', methods=['POST'])
@token_required
def create_survey(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    new_survey = Survey(
        creator_id=current_user.id,
        title=data['title'],
        description=data.get('description'),
        start_date=data.get('start_date'),
        end_date=data.get('end_date'),
        is_public=data.get('is_public', True),
        status=data.get('status', 'draft'),
        type=data['type']
    )
    db.session.add(new_survey)
    db.session.commit()

    return jsonify({"message": "Survey created successfully"}), 201

@api.route('/surveys/<int:id>', methods=['GET'])
@token_required
def get_survey(current_user, id):
    survey = Survey.query.get_or_404(id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    return jsonify(survey.serialize())

@api.route('/surveys', methods=['GET'])
@token_required
def get_surveys(current_user):
    surveys = Survey.query.filter_by(creator_id=current_user.id).all()
    return jsonify([survey.serialize() for survey in surveys]), 200

@api.route('/surveys/<int:id>', methods=['PUT'])
@token_required
def update_survey(current_user, id):
    survey = Survey.query.get_or_404(id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    survey.title = data.get('title', survey.title)
    survey.description = data.get('description', survey.description)
    survey.is_public = data.get('is_public', survey.is_public)
    survey.status = data.get('status', survey.status)
    db.session.commit()
    return jsonify(survey.serialize())

@api.route('/surveys/<int:id>', methods=['DELETE'])
@token_required
def delete_survey(current_user, id):
    survey = Survey.query.get_or_404(id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(survey)
    db.session.commit()
    return jsonify({'message': 'Survey deleted'}), 200

# Question Endpoints
@api.route('/questions', methods=['POST'])
@token_required
def create_question(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    survey = Survey.query.get_or_404(data['survey_id'])
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    new_question = Question(
        survey_id=data['survey_id'],
        question_text=data['question_text'],
        question_type=data['question_type'],
        order=data.get('order'),
        required=data.get('required', True)
    )
    db.session.add(new_question)
    db.session.commit()

    return jsonify({"message": "Question created successfully"}), 201

@api.route('/questions/<int:id>', methods=['GET'])
@token_required
def get_question(current_user, id):
    question = Question.query.get_or_404(id)
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    return jsonify(question.serialize())

@api.route('/questions', methods=['GET'])
@token_required
def get_questions(current_user):
    questions = Question.query.join(Survey).filter(Survey.creator_id == current_user.id).all()
    return jsonify([question.serialize() for question in questions]), 200

@api.route('/questions/<int:id>', methods=['PUT'])
@token_required
def update_question(current_user, id):
    question = Question.query.get_or_404(id)
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    question.question_text = data.get('question_text', question.question_text)
    question.question_type = data.get('question_type', question.question_type)
    question.required = data.get('required', question.required)
    db.session.commit()
    return jsonify(question.serialize())

@api.route('/questions/<int:id>', methods=['DELETE'])
@token_required
def delete_question(current_user, id):
    question = Question.query.get_or_404(id)
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(question)
    db.session.commit()
    return jsonify({'message': 'Question deleted'}), 200

# Option Endpoints
@api.route('/options', methods=['POST'])
@token_required
def create_option(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    question = Question.query.get_or_404(data['question_id'])
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    new_option = Option(
        question_id=data['question_id'],
        option_text=data['option_text'],
        order=data.get('order')
    )
    db.session.add(new_option)
    db.session.commit()

    return jsonify({"message": "Option created successfully"}), 201

@api.route('/options/<int:id>', methods=['GET'])
@token_required
def get_option(current_user, id):
    option = Option.query.get_or_404(id)
    question = Question.query.get_or_404(option.question_id)
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    return jsonify(option.serialize())

@api.route('/options', methods=['GET'])
@token_required
def get_options(current_user):
    options = Option.query.join(Question).join(Survey).filter(Survey.creator_id == current_user.id).all()
    return jsonify([option.serialize() for option in options]), 200

@api.route('/options/<int:id>', methods=['PUT'])
@token_required
def update_option(current_user, id):
    option = Option.query.get_or_404(id)
    question = Question.query.get_or_404(option.question_id)
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.get_json()
    option.option_text = data.get('option_text', option.option_text)
    db.session.commit()
    return jsonify(option.serialize())

@api.route('/options/<int:id>', methods=['DELETE'])
@token_required
def delete_option(current_user, id):
    option = Option.query.get_or_404(id)
    question = Question.query.get_or_404(option.question_id)
    survey = Survey.query.get_or_404(question.survey_id)
    if survey.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(option)
    db.session.commit()
    return jsonify({'message': 'Option deleted'}), 200







# from flask import Blueprint, request, jsonify
# from api.models import db, User, Survey, Question, Option, Vote, Invitation

# api = Blueprint('api', __name__)

# # User Endpoints
# @api.route('/users', methods=['POST'])              #### FUNCIONANDO
# def create_user():
#     if request.method == 'POST':
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided"}), 400

#         # Aquí debes incluir lógica para validar y crear un nuevo usuario
#         new_user = User(email=data['email'], password_hash=data['password'], full_name=data['full_name'])
#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({"message": "User created successfully"}), 201





# @api.route('/users/<int:id>', methods=['GET'])   #### FUNCIONANDO
# def get_user(id):
#     user = User.query.get_or_404(id)
#     return jsonify(user.serialize())

# @api.route('/users', methods=['GET'])  #### FUNCIONANDO
# def get_users():
#     users = User.query.all()
#     return jsonify([{"id":user.id, "full_name": user.full_name, "email": user.email, "created_at": user.created_at, "is_active": user.is_active } for user in users]), 200      #### CON ESTA SALEN LAS RUTAS EN EL PREVISUALIZADOR HACER PARA TODOS LOS GETS 

# @api.route('/users/<int:id>', methods=['PUT'])
# def update_user(id):
#     user = User.query.get_or_404(id)
#     data = request.get_json()
#     user.email = data.get('email', user.email)
#     user.full_name = data.get('full_name', user.full_name)
#     user.is_active = data.get('is_active', user.is_active)
#     user.password_hash = data.get('password', user.password_hash)
#     db.session.commit()
#     return jsonify(user.serialize())

# @api.route('/users/<int:id>', methods=['DELETE'])
# def delete_user(id):
#     user = User.query.get_or_404(id)
#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({'message': 'User deleted'}), 200

# @api.route('/hello', methods=['GET'])
# def hello_world():
#     return jsonify({"message": "Hello from Flask!"}), 200

# # (Resto de los endpoints de surveys, questions, options, votes, invitations)




# # """
# # This module takes care of starting the API Server, Loading the DB and Adding the endpoints
# # """
# # from flask import Flask, request, jsonify, url_for, Blueprint
# # from api.models import db, User
# # from api.utils import generate_sitemap, APIException
# # from flask_cors import CORS

# # api = Blueprint('api', __name__)

# # # Allow CORS requests to this API
# # CORS(api)


# # @api.route('/hello', methods=['POST', 'GET'])
# # def handle_hello():

# #     response_body = {
# #         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
# #     }

# #     return jsonify(response_body), 200
