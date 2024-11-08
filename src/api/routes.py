from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Survey, Question, Option
import jwt
import datetime

api = Blueprint('api', __name__)

SECRET_KEY = 'your_secret_key_here'  # Debes reemplazar esto por una clave secreta segura

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

        # Hashear la contraseña usando SHA256
        password_hash = generate_password_hash(data['password'], method='pbkdf2:sha256')

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

        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@api.route('/users/<int:id>', methods=['GET'])  #### FUNCIONANDO
def get_user(id):
    user = User.query.get_or_404(id)
    user_data = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "created_at": user.created_at,
        "is_active": user.is_active
    }
    return jsonify(user_data)

@api.route('/users', methods=['GET'])  #### FUNCIONANDO
def get_users():
    users = User.query.all()
    users_list = [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at,
            "is_active": user.is_active
        } for user in users
    ]
    return jsonify(users_list), 200

@api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.email = data.get('email', user.email)
    user.full_name = data.get('full_name', user.full_name)
    user.is_active = data.get('is_active', user.is_active)
    user.password_hash = generate_password_hash(data.get('password', user.password_hash), method='pbkdf2:sha256')
    db.session.commit()
    return jsonify({
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "created_at": user.created_at,
        "is_active": user.is_active
    })

@api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'}), 200

# Survey Endpoints
@api.route('/surveys', methods=['POST'])
def create_survey():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    new_survey = Survey(
        creator_id=data['creator_id'],
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
def get_survey(id):
    survey = Survey.query.get_or_404(id)
    survey_data = {
        "id": survey.id,
        "creator_id": survey.creator_id,
        "title": survey.title,
        "description": survey.description,
        "start_date": survey.start_date,
        "end_date": survey.end_date,
        "is_public": survey.is_public,
        "status": survey.status,
        "type": survey.type
    }
    return jsonify(survey_data)

@api.route('/surveys', methods=['GET'])
def get_surveys():
    surveys = Survey.query.all()
    return jsonify([survey.serialize() for survey in surveys]), 200

@api.route('/surveys/<int:id>', methods=['PUT'])
def update_survey(id):
    survey = Survey.query.get_or_404(id)
    data = request.get_json()
    survey.title = data.get('title', survey.title)
    survey.description = data.get('description', survey.description)
    survey.is_public = data.get('is_public', survey.is_public)
    survey.status = data.get('status', survey.status)
    db.session.commit()
    return jsonify({
        "id": survey.id,
        "creator_id": survey.creator_id,
        "title": survey.title,
        "description": survey.description,
        "start_date": survey.start_date,
        "end_date": survey.end_date,
        "is_public": survey.is_public,
        "status": survey.status,
        "type": survey.type
    })

@api.route('/surveys/<int:id>', methods=['DELETE'])
def delete_survey(id):
    survey = Survey.query.get_or_404(id)
    db.session.delete(survey)
    db.session.commit()
    return jsonify({'message': 'Survey deleted'}), 200

# Question Endpoints
@api.route('/questions', methods=['POST'])
def create_question():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    survey = Survey.query.get_or_404(data['survey_id'])
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
def get_question(id):
    question = Question.query.get_or_404(id)
    survey = Survey.query.get_or_404(question.survey_id)
    question_data = {
        "id": question.id,
        "survey_id": question.survey_id,
        "question_text": question.question_text,
        "question_type": question.question_type,
        "order": question.order,
        "required": question.required
    }
    return jsonify(question_data)

@api.route('/questions', methods=['GET'])
def get_questions():
    questions = Question.query.all()
    return jsonify([question.serialize() for question in questions]), 200

@api.route('/questions/<int:id>', methods=['PUT'])
def update_question(id):
    question = Question.query.get_or_404(id)
    survey = Survey.query.get_or_404(question.survey_id)
    data = request.get_json()
    question.question_text = data.get('question_text', question.question_text)
    question.question_type = data.get('question_type', question.question_type)
    question.required = data.get('required', question.required)
    db.session.commit()
    return jsonify({
        "id": question.id,
        "survey_id": question.survey_id,
        "question_text": question.question_text,
        "question_type": question.question_type,
        "order": question.order,
        "required": question.required
    })

@api.route('/questions/<int:id>', methods=['DELETE'])
def delete_question(id):
    question = Question.query.get_or_404(id)
    survey = Survey.query.get_or_404(question.survey_id)
    db.session.delete(question)
    db.session.commit()
    return jsonify({'message': 'Question deleted'}), 200

# Option Endpoints
@api.route('/options', methods=['POST'])
def create_option():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    question = Question.query.get_or_404(data['question_id'])
    survey = Survey.query.get_or_404(question.survey_id)
    new_option = Option(
        question_id=data['question_id'],
        option_text=data['option_text'],
        order=data.get('order')
    )
    db.session.add(new_option)
    db.session.commit()

    return jsonify({"message": "Option created successfully"}), 201

@api.route('/options/<int:id>', methods=['GET'])
def get_option(id):
    option = Option.query.get_or_404(id)
    question = Question.query.get_or_404(option.question_id)
    survey = Survey.query.get_or_404(question.survey_id)
    option_data = {
        "id": option.id,
        "question_id": option.question_id,
        "option_text": option.option_text,
        "order": option.order
    }
    return jsonify(option_data)

@api.route('/options', methods=['GET'])
def get_options():
    options = Option.query.all()
    return jsonify([option.serialize() for option in options]), 200

@api.route('/options/<int:id>', methods=['PUT'])
def update_option(id):
    option = Option.query.get_or_404(id)
    question = Question.query.get_or_404(option.question_id)
    survey = Survey.query.get_or_404(question.survey_id)
    data = request.get_json()
    option.option_text = data.get('option_text', option.option_text)
    db.session.commit()
    return jsonify({
        "id": option.id,
        "question_id": option.question_id,
        "option_text": option.option_text,
        "order": option.order
    })

@api.route('/options/<int:id>', methods=['DELETE'])
def delete_option(id):
    option = Option.query.get_or_404(id)
    question = Question.query.get_or_404(option.question_id)
    survey = Survey.query.get_or_404(question.survey_id)
    db.session.delete(option)
    db.session.commit()
    return jsonify({'message': 'Option deleted'}), 200
