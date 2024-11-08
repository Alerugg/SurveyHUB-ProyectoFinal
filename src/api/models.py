from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    surveys_created = db.relationship('Survey', backref='creator', lazy=True)
    votes = db.relationship('Vote', backref='user', lazy=True)
    invitations = db.relationship('Invitation', backref='user', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email, 
            "full_name": self.full_name,
            "created_at": self.created_at,
            "is_active": self.is_active,
        }

    def __repr__(self):
        return f'<User {self.email}>'

class Survey(db.Model):
    __tablename__ = 'surveys'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    is_public = db.Column(db.Boolean, default=True)

    status = db.Column(db.Enum('draft', 'active', 'closed', name='status'), nullable=False)
    type = db.Column(db.Enum('survey', 'poll', name='type'), nullable=False)

    questions = db.relationship('Question', backref='survey', lazy=True)
    votes = db.relationship('Vote', backref='survey', lazy=True)
    invitations = db.relationship('Invitation', backref='survey', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "creator_id": self.creator_id,
            "title": self.title,
            "description": self.description,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "is_public": self.is_public,
            "status": self.status,
            "type": self.type,
            "questions": [question.serialize() for question in self.questions],
        }

    def __repr__(self):
        return f'<Survey {self.title}>'

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    question_text = db.Column(db.String, nullable=False)
    question_type = db.Column(db.Enum('yes_no', 'multiple_choice', 'open_ended', 'scale', name='question_type'), nullable=False)
    order = db.Column(db.Integer)
    required = db.Column(db.Boolean, default=True)

    options = db.relationship('Option', backref='question', lazy=True)
    votes = db.relationship('Vote', backref='question', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "survey_id": self.survey_id,
            "question_text": self.question_text,
            "question_type": self.question_type,
            "order": self.order,
            "required": self.required,
            "options": [option.serialize() for option in self.options],
        }

    def __repr__(self):
        return f'<Question {self.question_text}>'

class Option(db.Model):
    __tablename__ = 'options'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    option_text = db.Column(db.String, nullable=False)
    order = db.Column(db.Integer)

    votes = db.relationship('Vote', backref='option', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "question_id": self.question_id,
            "option_text": self.option_text,
            "order": self.order,
        }

    def __repr__(self):
        return f'<Option {self.option_text}>'

class Vote(db.Model):
    __tablename__ = 'votes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('options.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "survey_id": self.survey_id,
            "question_id": self.question_id,
            "option_id": self.option_id,
            "created_at": self.created_at,
        }

    def __repr__(self):
        return f'<Vote by User {self.user_id} on Question {self.question_id}>'

class Invitation(db.Model):
    __tablename__ = 'invitations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String, unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    used = db.Column(db.Boolean, default=False)

    def __init__(self, survey_id, user_id, token):
        self.survey_id = survey_id
        self.user_id = user_id
        self.token = token
        survey = Survey.query.get(survey_id)
        if survey:
            self.created_at = survey.start_date if survey.start_date else datetime.utcnow()
            self.expires_at = survey.end_date if survey.end_date else datetime.utcnow()

    def serialize(self):
        return {
            "id": self.id,
            "survey_id": self.survey_id,
            "user_id": self.user_id,
            "token": self.token,
            "expires_at": self.expires_at,
            "created_at": self.created_at,
            "used": self.used,
        }

    def __repr__(self):
        return f'<Invitation {self.token} for Survey {self.survey_id}>'