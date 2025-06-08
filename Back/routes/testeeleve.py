from flask import Blueprint, jsonify
from flask_cors import cross_origin
from models import Eleve, Texte

elevetest_bp = Blueprint('eleve', __name__)


@elevetest_bp.route('/texteeleve/<int:id_eleve>', methods=['GET'])
@cross_origin(origins='http://localhost:3000') 
def get_texte_pour_eleve(id_eleve):
    eleve = Eleve.query.get(id_eleve)
    print(f"ID reçu pour l'élève : {id_eleve}")
    if not eleve:
        return jsonify({'error': 'Élève non trouvé'}), 404

    texte = Texte.query.filter_by(niveauC=int(eleve.niveauTest), niveauL='A').first()
    if not texte:
        return jsonify({'error': 'Texte introuvable'}), 404

    return jsonify({
        'idTexte': texte.idTexte,
        'texte': texte.texteContent
    }), 200

