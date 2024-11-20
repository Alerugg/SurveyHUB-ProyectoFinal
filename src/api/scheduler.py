from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from your_app import app, db
from your_app.models import Survey

# Define la función para actualizar automáticamente el estado de las encuestas
def update_survey_status():
    now = datetime.utcnow()

    # Cambiar encuestas de "draft" a "active"
    draft_surveys = Survey.query.filter(Survey.status == 'draft', Survey.start_date <= now).all()
    for survey in draft_surveys:
        survey.status = 'active'
        db.session.commit()
        print(f'Survey {survey.id} is now active.')

    # Cambiar encuestas de "active" a "closed"
    active_surveys = Survey.query.filter(Survey.status == 'active', Survey.end_date <= now).all()
    for survey in active_surveys:
        survey.status = 'closed'
        db.session.commit()
        print(f'Survey {survey.id} is now closed.')

# Configura APScheduler para que ejecute la función periódicamente
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_survey_status, trigger="interval", minutes=1)
scheduler.start()

# Detener el scheduler cuando se cierre la aplicación
import atexit
atexit.register(lambda: scheduler.shutdown())
