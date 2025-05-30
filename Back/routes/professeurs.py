from flask import Blueprint, request, jsonify
from models import db, Professeur
from werkzeug.security import generate_password_hash

prof_bp = Blueprint('professeurs', __name__)

@prof_bp.route('/add_prof', methods=['POST'])
def add_prof():
    data = request.get_json()
    try:
        nom = data['nom']
        prenom = data['prenom']
        email = data['email']
        password = generate_password_hash(data['password'])  # hash du mot de passe

        if Professeur.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email déjà utilisé'}), 409

        prof = Professeur(nom, prenom, email, password)
        db.session.add(prof)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Professeur ajouté'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
    
@prof_bp.route('/professeurs', methods=['GET'])
def get_professeurs():
    profs = Professeur.query.all()
    data = [p.to_dict() for p in profs]  # Utilise directement la méthode to_dict()
    return jsonify({"success": True, "professeurs": data})

@prof_bp.route('/delete_prof/<int:id>', methods=['DELETE'])
def delete_professeur(id):
    print(f"ID reçu : {id}")  # Assure-toi que l'ID est bien reçu côté serveur
    prof = Professeur.query.get(id)
    if not prof:
        return jsonify({'success': False, 'message': 'Professeur introuvable'}), 404
    db.session.delete(prof)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Professeur supprimé'})

