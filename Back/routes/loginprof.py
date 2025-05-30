from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from models import Professeur

# Créer un Blueprint pour le login du professeur
login_professeur_bp = Blueprint('login_professeur', __name__)

# Définir la route correctement avec le blueprint
@login_professeur_bp.route('/loginprof', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    prof = Professeur.query.filter_by(email=email).first()
    if prof and prof.check_password(password):
        return jsonify({"message": "Connexion réussie", "professeur": prof.to_dict()})
    else:
        return jsonify({"message": "Email ou mot de passe incorrect"}), 401
