# routes/texte.py
from flask import Blueprint, request, jsonify
from models import db, Texte
from models import db, NiveauL



texte_bp = Blueprint('texte', __name__, url_prefix='/texte')

@texte_bp.route('/add', methods=['POST'])
def add_texte():
    try:
        data = request.get_json()

        niveauC = data.get('niveauC')
        niveauL_str = data.get('niveauL')
        texteContent = data.get('texteContent')

        # Validation basique
        if not all([niveauC, niveauL_str, texteContent]):
            return jsonify({'error': 'Champs manquants'}), 400

        # Vérification que niveauL est bien A, B ou C
        try:
            niveauL_enum = NiveauL[niveauL_str]
        except KeyError:
            return jsonify({'error': 'niveauL doit être A, B ou C'}), 400

        nouveau_texte = Texte(niveauC=niveauC, niveauL=niveauL_enum, texteContent=texteContent)
        db.session.add(nouveau_texte)
        db.session.commit()

        return jsonify({'message': 'Texte ajouté avec succès'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@texte_bp.route('/niveauC/<niveauC>', methods=['GET'])
def get_textes_by_niveauC(niveauC):
    try:
        textes = Texte.query.filter_by(niveauC=niveauC).all()

        result = []
        for texte in textes:
            result.append({
                'idTexte': texte.idTexte,
                'niveauC': texte.niveauC,
                'niveauL': texte.niveauL.name,
                'texteContent': texte.texteContent
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@texte_bp.route('/<int:idTexte>', methods=['GET'])
def get_texte_by_id(idTexte):
    try:
        texte = Texte.query.get(idTexte)

        if not texte:
            return jsonify({'error': 'Texte non trouvé'}), 404

        result = {
            'idTexte': texte.idTexte,
            'niveauC': texte.niveauC,
            'niveauL': texte.niveauL.name,  # en supposant que c’est une Enum
            'texteContent': texte.texteContent
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ajoutez ces endpoints à votre fichier backend existant

@texte_bp.route('/<int:idTexte>', methods=['PUT'])
def update_texte(idTexte):
    try:
        data = request.get_json()
        
        texte = Texte.query.get(idTexte)
        if not texte:
            return jsonify({'error': 'Texte non trouvé'}), 404
        
        # Mise à jour des champs si fournis
        if 'niveauC' in data:
            texte.niveauC = data['niveauC']
        
        if 'niveauL' in data:
            try:
                texte.niveauL = NiveauL[data['niveauL']]
            except KeyError:
                return jsonify({'error': 'niveauL doit être A, B ou C'}), 400
        
        if 'texteContent' in data:
            texte.texteContent = data['texteContent']
        
        db.session.commit()
        
        return jsonify({'message': 'Texte modifié avec succès'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@texte_bp.route('/<int:idTexte>', methods=['DELETE'])
def delete_texte(idTexte):
    try:
        texte = Texte.query.get(idTexte)
        if not texte:
            return jsonify({'error': 'Texte non trouvé'}), 404
        
        db.session.delete(texte)
        db.session.commit()
        
        return jsonify({'message': 'Texte supprimé avec succès'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@texte_bp.route('/all', methods=['GET'])
def get_all_textes():
    try:
        textes = Texte.query.all()
        
        result = []
        for texte in textes:
            result.append({
                'idTexte': texte.idTexte,
                'niveauC': texte.niveauC,
                'niveauL': texte.niveauL.name,
                'texteContent': texte.texteContent
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500