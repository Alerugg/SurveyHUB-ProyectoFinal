from flask import Flask, Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Survey, Question, Option, Vote
import jwt
import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS

# Inicializa la aplicación de Flask
app = Flask(__name__)

# Habilita CORS para todo el dominio de tu frontend (ajusta la URL si es necesario)
CORS(app, resources={r"/*": {"origins": "*"}})

api = Blueprint('api', __name__)

SECRET_KEY = 'your_secret_key_here'  # Debes reemplazar esto por una clave secreta segura

# USERS ENDPOINTS
@api.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    full_name = data.get('full_name', user.full_name)
    email = data.get('email', user.email)

    # Update full_name and email if provided
    user.full_name = full_name
    user.email = email

    db.session.commit()
    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "created_at": user.created_at,
        "is_active": user.is_active
    }), 200

@api.route('/user/update-password', methods=['PUT'])
@jwt_required()
def update_user_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"error": "La nueva contraseña es obligatoria"}), 400

    try:
        # Genera un hash de la nueva contraseña utilizando el método adecuado
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256', salt_length=16)
        user.password_hash = hashed_password  # Asegurarse de actualizar el campo correcto

        db.session.commit()
        return jsonify({"message": "Contraseña actualizada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar la contraseña: {e}")
        return jsonify({"error": "Hubo un error al actualizar la contraseña"}), 500

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
            'sub': user.id,
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token, "user_id": user.id}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@api.route('/users', methods=['GET'])
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

@api.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user = User.query.options(db.joinedload(User.surveys_created)).get_or_404(id)
    user_data = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "created_at": user.created_at,
        "is_active": user.is_active,
        "surveys": [survey.serialize() for survey in user.surveys_created]
    }
    return jsonify(user_data)

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    password_hash = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(email=data['email'], password_hash=password_hash, full_name=data['full_name'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# SURVEYS ENDPOINTS
@api.route('/surveys', methods=['GET'])
def get_surveys():
    surveys = Survey.query.all()
    surveys_list = [
        {
            "id": survey.id,
            "creator_id": survey.creator_id,
            "title": survey.title,
            "description": survey.description,
            "start_date": survey.start_date,
            "end_date": survey.end_date,
            "is_public": survey.is_public,
            "status": survey.status,
            "type": survey.type
        } for survey in surveys
    ]
    return jsonify(surveys_list), 200

@api.route('/surveys/full', methods=['POST'])
@jwt_required()
def create_full_survey():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Crear la encuesta principal
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
        db.session.flush()  # Obtener el ID de la encuesta antes de confirmar

        survey_response = {
            "survey_id": new_survey.id,
            "questions": []
        }

        # Crear las preguntas y opciones asociadas
        for question_data in data.get('questions', []):
            new_question = Question(
                survey_id=new_survey.id,
                question_text=question_data['question_text'],
                question_type=question_data['question_type'],
                order=question_data.get('order'),
                required=question_data.get('required', True)
            )
            db.session.add(new_question)
            db.session.flush()  # Obtener el ID de la pregunta antes de confirmar

            question_response = {
                "question_id": new_question.id,
                "options": []
            }

            # Crear las opciones asociadas a la pregunta
            for option_data in question_data.get('options', []):
                new_option = Option(
                    question_id=new_question.id,
                    option_text=option_data['option_text'],
                    order=option_data.get('order')
                )
                db.session.add(new_option)
                db.session.flush()  # Obtener el ID de la opción antes de confirmar

                question_response["options"].append({
                    "option_id": new_option.id,
                    "option_text": new_option.option_text
                })

            survey_response["questions"].append(question_response)

        db.session.commit()
        return jsonify({"message": "Survey, questions, and options created successfully", "survey": survey_response}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e), "message": "There was an error processing your request."}), 500

@api.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()  # Recupera el ID del usuario del token JWT

    # Validar si el usuario existe y devolver error más explícito
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.serialize()), 200  # Devuelve la información del usuario serializada

# Configura el blueprint y la aplicación
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
     app.run(debug=True)
