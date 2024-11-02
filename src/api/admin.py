from flask_admin import Admin
import os
from flask_admin.contrib.sqla import ModelView
from .models import db, User, Survey, Question, Option, Vote, Invitation

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Personaliza la vista de User para excluir columnas no deseadas
    class UserAdmin(ModelView):
        form_excluded_columns = ['surveys_created', 'votes', 'invitations']

    # Personaliza la vista de Survey para excluir relaciones no deseadas
    class SurveyAdmin(ModelView):
        form_excluded_columns = ['questions', 'votes', 'invitations']

    # Personaliza la vista de Question para excluir relaciones no deseadas
    class QuestionAdmin(ModelView):
        form_excluded_columns = ['options', 'votes']

    # Personaliza la vista de Option para excluir relaciones no deseadas
    class OptionAdmin(ModelView):
        form_excluded_columns = ['votes']

    # Añadir las vistas al administrador
    admin.add_view(UserAdmin(User, db.session))
    admin.add_view(SurveyAdmin(Survey, db.session))
    admin.add_view(QuestionAdmin(Question, db.session))
    admin.add_view(OptionAdmin(Option, db.session))
    admin.add_view(ModelView(Vote, db.session))
    admin.add_view(ModelView(Invitation, db.session))