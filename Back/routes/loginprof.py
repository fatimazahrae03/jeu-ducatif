from flask import Blueprint, jsonify, request
from models import Professeur

login_professeur_bp = Blueprint('login_professeur', __name__)

@login_professeur_bp.route('/loginprof', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    prof = Professeur.query.filter_by(email=email).first()
    
    if prof and prof.password == password:
        return jsonify({"message": "Connexion réussie", "professeur": prof.to_dict()})
    else:
        return jsonify({"message": "Email ou mot de passe incorrect"}), 401
