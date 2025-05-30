from flask import Blueprint, request, jsonify
from models import db, Eleve
from datetime import datetime

students_bp = Blueprint('students', __name__)

@students_bp.route('/add_student', methods=['POST'])
def add_student():
    data = request.get_json()
    
    try:
        cne = data['cne']  # <- Nouveau champ requis
        nom = data['nom']
        prenom = data['prenom']
        dateNaissance = datetime.strptime(data['dateNaissance'], "%Y-%m-%d")
        niveauScolaire = data['niveauScolaire']
        niveauTest = data['niveauTest']

        # Vérifie si le CNE existe déjà
        if Eleve.query.filter_by(cne=cne).first():
            return jsonify({'success': False, 'message': 'Ce CNE existe déjà'}), 409

        new_eleve = Eleve(
            cne=cne,
            nom=nom,
            prenom=prenom,
            dateNaissance=dateNaissance,
            niveauScolaire=niveauScolaire,
            niveauTest=niveauTest
        )

        db.session.add(new_eleve)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Élève ajouté avec succès'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400
@students_bp.route('/students', methods=['GET'])
def get_students():
    try:
        students = Eleve.query.all()
        students_list = [s.to_dict() for s in students]
        return jsonify({'success': True, 'eleves': students_list}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    
@students_bp.route('/delete_student/<int:id>', methods=['DELETE'])
def delete_student(id):
    try:
        student = Eleve.query.get(id)
        if not student:
            return jsonify({'success': False, 'message': 'Élève non trouvé'}), 404

        db.session.delete(student)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Élève supprimé avec succès'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    
@students_bp.route('/update_student/<int:id>', methods=['PUT'])
def update_student(id):
    data = request.get_json()
    try:
        student = Eleve.query.get(id)
        if not student:
            return jsonify({'success': False, 'message': 'Élève non trouvé'}), 404

        student.nom = data.get('nom', student.nom)
        student.prenom = data.get('prenom', student.prenom)
        student.cne = data.get('cne', student.cne)
        student.dateNaissance = datetime.strptime(data['dateNaissance'], "%Y-%m-%d") if 'dateNaissance' in data else student.dateNaissance
        student.niveauScolaire = data.get('niveauScolaire', student.niveauScolaire)
        student.niveauTest = data.get('niveauTest', student.niveauTest)

        db.session.commit()
        return jsonify({'success': True, 'message': 'Élève modifié avec succès'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

