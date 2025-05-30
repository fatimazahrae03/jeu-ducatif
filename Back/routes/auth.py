from flask import Blueprint, request, jsonify
from models import db, Admin

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    admin = Admin.query.filter_by(username=username, password=password).first()

    if admin:
        return jsonify({'success': True, 'message': 'Connexion réussie'})
    else:
        return jsonify({'success': False, 'error': 'Nom d’utilisateur ou mot de passe invalide'}), 401
