from flask import Flask, Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Survey, Question, Option
import jwt
import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS  # Importa CORS

# Inicializa la aplicación de Flask
app = Flask(__name__)

# Habilita CORS para todo el dominio de tu frontend (ajusta la URL si es necesario)
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite solicitudes de cualquier origen

# Aquí va el resto de la configuración y rutas

api = Blueprint('api', __name__)

SECRET_KEY = 'Alex_Daniela_Jhow_Angela'

# Estos seran los Endpoints de Users

# User Endpoints
@api.route('/users', methods=['POST'])
def create_user():
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Verifica si el email está registrado o no
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        # Esto Hashea la contraseña usando SHA256
        password_hash = generate_password_hash(data['password'], method='pbkdf2:sha256')

        # Crear el nuevo usuario
        new_user = User(email=data['email'], password_hash=password_hash, full_name=data['full_name'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

@api.route('/login', methods=['POST'])
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

# Survey Endpoints
@api.route('/surveys', methods=['POST'])
@jwt_required()
def create_survey():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    title = data.get('title')
    description = data.get('description')
    user_id = get_jwt_identity()

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    new_survey = Survey(title=title, description=description, user_id=user_id)
    db.session.add(new_survey)
    db.session.commit()

    return jsonify({"message": "Survey created successfully", "survey_id": new_survey.id}), 201

@api.route('/surveys', methods=['GET'])
def get_surveys():
    surveys = Survey.query.all()
    surveys_data = [{"id": survey.id, "title": survey.title, "description": survey.description} for survey in surveys]
    return jsonify(surveys_data)

@api.route('/surveys/<int:id>', methods=['GET'])
def get_survey(id):
    survey = Survey.query.get(id)
    if not survey:
        return jsonify({"error": "Survey not found"}), 404
    return jsonify({
        "id": survey.id,
        "title": survey.title,
        "description": survey.description
    })

@api.route('/surveys/<int:id>/questions', methods=['POST'])
@jwt_required()
def add_question_to_survey(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    question_text = data.get('question_text')
    if not question_text:
        return jsonify({"error": "Question text is required"}), 400

    survey = Survey.query.get(id)
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    user_id = get_jwt_identity()
    if survey.user_id != user_id:
        return jsonify({"error": "You are not authorized to add questions to this survey"}), 403

    new_question = Question(question_text=question_text, survey_id=id)
    db.session.add(new_question)
    db.session.commit()

    return jsonify({"message": "Question added successfully", "question_id": new_question.id}), 201

@api.route('/surveys/<int:survey_id>/questions', methods=['GET'])
def get_questions_for_survey(survey_id):
    survey = Survey.query.get(survey_id)
    if not survey:
        return jsonify({"error": "Survey not found"}), 404

    questions = Question.query.filter_by(survey_id=survey_id).all()
    questions_data = [{"id": question.id, "question_text": question.question_text} for question in questions]
    return jsonify(questions_data)

@api.route('/questions/<int:id>/options', methods=['POST'])
@jwt_required()
def add_option_to_question(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    option_text = data.get('option_text')
    if not option_text:
        return jsonify({"error": "Option text is required"}), 400

    question = Question.query.get(id)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    new_option = Option(option_text=option_text, question_id=id)
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
