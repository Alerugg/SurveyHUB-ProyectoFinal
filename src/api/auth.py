from functools import wraps
from flask import request, jsonify
from jose import jwt
from datetime import datetime, timedelta
import requests
import os

jwks_cache = None
cache_expiry = None

AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
API_AUDIENCE = os.getenv('API_AUDIENCE')
ALGORITHMS = ["RS256"]

# Obtener la clave pública de Auth0 para validar el token (con caching)
def get_jwks():
    global jwks_cache, cache_expiry
    if jwks_cache is None or datetime.now() > cache_expiry:
        # Realizar la solicitud a Auth0 para obtener las claves públicas
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks_cache = requests.get(jwks_url).json()
        cache_expiry = datetime.now() + timedelta(hours=1)  # Expira en 1 hora
    return jwks_cache

def verify_jwt(token):
    try:
        # Obtener la clave pública
        jwks = get_jwks()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}

        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }

        if not rsa_key:
            raise Exception("Unable to find appropriate key.")

        # Decodificar el JWT
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload

    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.JWTClaimsError:
        raise Exception("Incorrect claims, please check the audience and issuer")
    except jwt.JWTError as e:
        raise Exception(f"JWT error: {str(e)}")
    except Exception as e:
        raise Exception(f"Unable to parse authentication token: {str(e)}")


# Decorador para requerir autenticación
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Obtener el encabezado de autorización
        auth = request.headers.get("Authorization", None)
        if not auth:
            return jsonify({"error": "Authorization header is expected"}), 401

        parts = auth.split()
        if parts[0].lower() != "bearer":
            return jsonify({"error": "Authorization header must start with Bearer"}), 401
        elif len(parts) == 1:
            return jsonify({"error": "Token not found"}), 401
        elif len(parts) > 2:
            return jsonify({"error": "Authorization header must be Bearer token"}), 401

        token = parts[1]
        try:
            # Verificar el JWT
            payload = verify_jwt(token)
        except Exception as e:
            return jsonify({"error": "Invalid or expired token", "message": str(e)}), 401

        # Continuar con la ejecución de la función protegida
        return f(*args, **kwargs)
    
    return decorated
