from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from models import db, Eleve, Historique


eleve_bp = Blueprint('log', __name__)

# Fonction utilitaire pour ajouter les en-têtes CORS

def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@eleve_bp.route('/eleve/login', methods=['POST', 'OPTIONS'])
def eleve_login():
    print("Route login appelée")

    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight successful'})
        return add_cors_headers(response), 200

    try:
        print("Tentative de récupération des données JSON...")
        data = request.get_json(force=True)
        print(f"Données reçues: {data}")

        if not data:
            return jsonify({'error': 'لا توجد بيانات مرسلة'}), 400

        cne = data.get('cne', '').strip()
        date_naissance_str = data.get('dateNaissance', '').strip()

        if not cne or not date_naissance_str:
            return jsonify({'error': 'CNE وتاريخ الميلاد مطلوبان'}), 400

        try:
            date_naissance = datetime.strptime(date_naissance_str, '%Y-%m-%d').date()
            eleve = Eleve.query.filter_by(cne=cne, dateNaissance=date_naissance).first()

            if eleve:
                # ➕ Créer un historique par défaut à chaque connexion
                historique = Historique(idEleve=eleve.idEleve, type="test")
                db.session.add(historique)
                db.session.commit()

                response_data = {
                    'message': 'Connexion réussie',
                    'eleve': eleve.to_dict(),
                    'hasHistorique': True  # ✅ Toujours vrai puisque on vient d'en créer un
                }

                return add_cors_headers(jsonify(response_data)), 200
            else:
                return add_cors_headers(jsonify({'error': 'CNE أو تاريخ الميلاد غير صحيح'})), 401

        except ValueError as ve:
            return add_cors_headers(jsonify({'error': 'تنسيق التاريخ غير صحيح. استخدم YYYY-MM-DD'})), 400

    except Exception as e:
        import traceback
        traceback.print_exc()
        return add_cors_headers(jsonify({'error': f'خطأ في الخادم: {str(e)}'})), 500


@eleve_bp.route('/test-eleve', methods=['GET', 'OPTIONS'])
def test_eleve():
    if request.method == 'OPTIONS':
        return '', 200
    response = jsonify({'message': 'Route élève fonctionne', 'status': 'OK'})
    return response, 200
