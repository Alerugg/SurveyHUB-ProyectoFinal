from dotenv import load_dotenv  # Carga las variables de entorno del archivo .env
import os
from flask import Flask, request, jsonify, url_for, send_from_directory, redirect, session
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS  # Importa CORS
from authlib.integrations.flask_client import OAuth  # Importa Auth0 OAuth
from api.utils import APIException, generate_sitemap
from api.models import db, User, Survey, Question, Option, Vote, Invitation
from api.admin import setup_admin
from api.commands import setup_commands

# Cargar variables de entorno
load_dotenv()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", os.urandom(24))  # Llave segura para la sesión
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Configura CORS para rutas específicas
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Integración de Auth0 con Authlib
oauth = OAuth(app)
auth0 = oauth.register(
    'auth0',
    client_id=os.getenv('AUTH0_CLIENT_ID'),
    client_secret=os.getenv('AUTH0_CLIENT_SECRET'),
    client_kwargs={'scope': 'openid profile email'},
    server_metadata_url=f"https://{os.getenv('AUTH0_DOMAIN')}/.well-known/openid-configuration"
)

# Rutas para autenticación con Auth0
@app.route('/login')
def login():
    return auth0.authorize_redirect(redirect_uri=url_for("callback", _external=True))

@app.route('/callback')
def callback():
    try:
        token = auth0.authorize_access_token()
        user_info = auth0.parse_id_token(token)
        session['user'] = user_info
        return redirect(url_for("sitemap"))
    except Exception as e:
        print(f"Error en callback: {e}")
        return jsonify({"error": "Error en la autenticación"}), 400

@app.route('/logout')
def logout():
    session.clear()
    return redirect(
        f"https://{os.getenv('AUTH0_DOMAIN')}/v2/logout?client_id={os.getenv('AUTH0_CLIENT_ID')}&returnTo={url_for('sitemap', _external=True)}"
    )

# Añadir el admin y comandos
setup_admin(app)
setup_commands(app)

# Importar y registrar el Blueprint de la API
from api.routes import api
app.register_blueprint(api, url_prefix='/api')

# Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Servir archivos estáticos
@app.route('/<path:path>', methods=['GET'])
def serve_file(path):
    if path.startswith("admin"):
        admin_path = path.replace("admin/", "")
        response = send_from_directory(static_file_dir, admin_path)
    else:
        if not os.path.isfile(os.path.join(static_file_dir, path)):
            path = 'index.html'
        response = send_from_directory(static_file_dir, path)

    # Lógica de caché para archivos estáticos
    if path.endswith(('.js', '.css', '.png', '.jpg', '.svg')):
        response.cache_control.max_age = 3600  # Cacheo de 1 hora
    else:
        response.cache_control.max_age = 0  # Evitar caché para archivos dinámicos
    return response

# Ejecutar la app
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=False)  # Cambiar a False en producción

# Hacer la app disponible para WSGI (por ejemplo, con Gunicorn)
application = app
