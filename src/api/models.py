from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(80), unique=False, nullable=False)
#     is_active = db.Column(db.Boolean(), unique=False, nullable=False)

#     def __repr__(self):
#         return f'<User {self.email}>'

#     def serialize(self):
#         return {
#             "id": self.id,
#             "email": self.email,
#             # do not serialize the password, its a security breach
#         }
    

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

    def __repr__(self):
        return f'<User {self.email}>'


class Survey(db.Model):
    __tablename__ = 'surveys'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    is_public = db.Column(db.Boolean, default=True)

    status = db.Column(db.Enum('draft', 'active', 'closed', name='status'))
    type = db.Column(db.Enum('survey', 'poll', name='type'), nullable=False)

    questions = db.relationship('Question', backref='survey', lazy=True)
    votes = db.relationship('Vote', backref='survey', lazy=True)  # Relación corregida
    invitations = db.relationship('Invitation', backref='survey', lazy=True)

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

    def __repr__(self):
        return f'<Question {self.question_text}>'


class Option(db.Model):
    __tablename__ = 'options'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    option_text = db.Column(db.String, nullable=False)
    order = db.Column(db.Integer)

    votes = db.relationship('Vote', backref='option', lazy=True)

    def __repr__(self):
        return f'<Option {self.option_text}>'


class Vote(db.Model):
    __tablename__ = 'votes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)  # Nueva clave foránea para Survey
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('options.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Vote by User {self.user_id} on Question {self.question_id}>'


class Invitation(db.Model):
    __tablename__ = 'invitations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String, unique=True, nullable=False)
    expires_at = db.Column(db.DateTime)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Invitation {self.token} for Survey {self.survey_id}>'


