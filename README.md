
# **SurveyHub**

🎯 **SurveyHub** es una plataforma moderna y eficiente para crear, compartir, y gestionar encuestas públicas y privadas. Diseñada con un enfoque en la simplicidad y funcionalidad, permite a los usuarios interactuar en cada etapa del ciclo de vida de una encuesta, desde la creación hasta la visualización de resultados.

![SurveyHub Banner](https://placehold.co/1200x300?text=SurveyHub+Your+Survey+Solution) <!-- Puedes sustituirlo por un banner más atractivo -->

---

## 🚀 **Características Principales**

- 📋 **Crear Encuestas**: Diseña encuestas públicas o privadas con opciones de selección múltiple o única.
- 🔑 **Autenticación Segura**: Registro e inicio de sesión para gestionar encuestas personalizadas.
- ✅ **Participación de Usuarios**: Permite a los participantes votar en tiempo real.
- 📊 **Resultados Claros**: Visualiza los resultados una vez que la encuesta se cierra, con gráficos claros y dinámicos.
- 🌐 **Interfaz Intuitiva**: Diseñada para ser amigable en cualquier dispositivo.

---

## 🖥️ **Demo en Video**

¡Explora SurveyHub en acción con estos videos rápidos que destacan cada paso! 👇

1. **Landing Page**: 
   > Presentación inicial de SurveyHub, donde descubrirás cómo comenzar con nuestras encuestas.
   ![Landing Page](https://github.com/Alerugg/SurveyHUB-ProyectoFinal/blob/8be4b7d3d3e464dfc4670bd2a467c72188dcfbf2/VideoSurveyHUB/LandingPage.gif)

2. **Registro e Inicio de Sesión**: 
   > Aprende cómo registrarte y gestionar tu cuenta de manera segura.
   ![Register and Login](https://placehold.co/600x400?text=Register+and+Login+Video)

3. **Crear una Encuesta**: 
   > Diseña tus propias encuestas con opciones personalizables.
   ![Create Survey](https://placehold.co/600x400?text=Create+Survey+Video)

4. **Votar en una Encuesta**: 
   > Descubre cómo participar en encuestas de forma rápida y sencilla.
   ![Vote in Survey](https://placehold.co/600x400?text=Vote+in+Survey+Video)

5. **Resultados de Encuestas Cerradas**: 
   > Visualiza los resultados y análisis de las encuestas finalizadas.
   ![Survey Results](https://placehold.co/600x400?text=Survey+Results+Video)

> **Nota**: Sustituye las URLs de los videos por los enlaces reales.

---

## 🛠️ **Tecnologías Utilizadas**

| Frontend  | Backend  | Base de Datos | Herramientas Adicionales |
|-----------|----------|---------------|--------------------------|
| React.js  | Flask    | PostgreSQL    | JWT para autenticación  |
| HTML5     | Python   | SQLAlchemy    | Bootstrap y CSS3        |
| CSS3      | REST API |               | Render para despliegue  |

---

## 📖 **Cómo Ejecutar el Proyecto Localmente**

### 1️⃣ **Requisitos Previos**
- Node.js y npm instalados.
- Python 3.8+.
- PostgreSQL configurado localmente.
- Pipenv instalado para gestionar dependencias del backend.

### 2️⃣ **Instalación**
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/surveyhub.git
   cd surveyhub
   ```

2. Instala las dependencias del frontend:
   ```bash
   cd src/front
   npm install
   ```

3. Instala las dependencias del backend:
   ```bash
   cd ../api
   pipenv install
   ```

### 3️⃣ **Configuración**
- Configura las variables de entorno en un archivo `.env` para el backend:
  ```env
  FLASK_APP=app.py
  FLASK_ENV=development
  DATABASE_URL=postgresql://usuario:contraseña@localhost/surveyhub
  JWT_SECRET_KEY=tu_secreto
  ```

### 4️⃣ **Ejecución**
1. Inicia el backend:
   ```bash
   cd src/api
   pipenv run start
   ```

2. Inicia el frontend:
   ```bash
   cd src/front
   npm run start
   ```

### 5️⃣ **Accede a la Aplicación**
- Abre [https://proyecto-final-repo-final.onrender.com] en tu navegador para ver SurveyHub en acción.

---

## 📂 **Estructura del Proyecto**

```plaintext
surveyhub/
├── .devcontainer/   # Configuración de entorno de desarrollo
├── docs/            # Documentación del proyecto
├── migrations/      # Migraciones de base de datos
├── node_modules/    # Dependencias de npm
├── public/          # Archivos públicos del frontend
├── src/             # Código fuente principal
│   ├── api/         # Backend en Flask
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── commands.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── scheduler.py
│   │   └── utils.py
│   ├── front/       # Frontend en React
│   │   ├── img/     # Imágenes del frontend
│   │   ├── js/      # Código JavaScript principal
│   │   │   ├── component/ # Componentes reutilizables
│   │   │   ├── pages/     # Páginas principales
│   │   │   ├── store/     # Contexto y lógica de estado
│   │   │   └── styles/    # Estilos CSS
├── app.py           # Entrada principal del backend
├── wsgi.py          # Archivo WSGI para despliegue
├── .env.example     # Ejemplo de configuración de entorno
└── README.md        # Este archivo
```

---

## 🌟 **Contribuciones**

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar SurveyHub, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-tuidea`).
3. Realiza tus cambios y súbelos (`git push origin feature-tuidea`).
4. Abre un pull request.

---

## 🛡️ **Licencia**

¡Úsalo y mejóralo libremente!

---

## 🤝 **Contacto**

¿Tienes preguntas o sugerencias? ¡Contáctame!

- **Correo Electrónico:** [alejandro.ruggeri.l@gmail.com]
- **LinkedIn:** [www.linkedin.com/in/aleruggeril]
- **GitHub:** [https://github.com/Alerugg]

---
