# Proyecto Flask API

Este proyecto es una aplicación web construida con Flask y SQLAlchemy que incluye una API REST, un panel de administración y una base de datos relacional. Utiliza `pipenv` para la gestión de dependencias y `Flask-Migrate` para el control de versiones de la base de datos.

## Estructura del Proyecto

- `app.py`: Archivo principal de la aplicación Flask.
- `api/`: Contiene los módulos de la aplicación (rutas, modelos, administración, etc.).
- `Pipfile` y `Pipfile.lock`: Archivos de dependencias para el entorno de Python.
- `package.json`: Archivo de dependencias de Node.js para ejecutar scripts de frontend (si aplica).

## Requisitos Previos

- Python 3.10
- Node.js (si se utiliza la parte de frontend)
- `pipenv` para la gestión del entorno virtual

## Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <URL-del-repositorio>
   cd <nombre-del-repositorio>
Instalar dependencias de Python:

bash
Copiar código
pipenv install
Activar el entorno virtual:

bash
Copiar código
pipenv shell
Instalar dependencias de Node.js (si aplica):

bash
Copiar código
npm install
Configurar el archivo .env (si es necesario): Crea un archivo .env en el directorio raíz y agrega las variables de entorno necesarias, como la configuración de la base de datos.

Ejemplo:

env
Copiar código
FLASK_APP=src/app.py
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
Comandos Útiles
Para Ejecutar la Aplicación
Ejecutar la API Flask:

bash
Copiar código
pipenv run start
Ejecutar el frontend (si aplica):

bash
Copiar código
npm run start
Comandos de Base de Datos
Inicializar la carpeta de migraciones:

bash
Copiar código
flask db init
Crear una nueva migración:

bash
Copiar código
flask db migrate -m "Descripción de la migración"
Aplicar las migraciones:

bash
Copiar código
flask db upgrade
Revertir una migración:

bash
Copiar código
flask db downgrade
Comandos Personalizados
Insertar datos de prueba:
bash
Copiar código
flask insert-test-users 5
Solución de Problemas
ImportError: No module named 'modulo'
Asegúrate de instalar todas las dependencias listadas en el Pipfile ejecutando:

bash
Copiar código
pipenv install
Errores de configuración de base de datos
Verifica que tu DATABASE_URL esté correctamente configurada en tu archivo .env.

Créditos
Este proyecto fue desarrollado por [Tu Nombre] y utiliza herramientas como Flask, SQLAlchemy, y Flask-Admin para la administración de la base de datos.


