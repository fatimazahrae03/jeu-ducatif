from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from models import Eleve, Texte, db, Recorder

UPLOAD_FOLDER = 'uploads/audio'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
recorder_bp = Blueprint('recorder', __name__, url_prefix='/recorder')


@recorder_bp.route('/upload', methods=['POST'])

def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'Fichier audio manquant'}), 400

    file = request.files['audio']
    eleve_id = request.form.get('eleve_id')
    texte_id = request.form.get('texte_id')

    if not eleve_id or not texte_id:
        return jsonify({'error': 'ID élève ou ID texte manquant'}), 400

    eleve = Eleve.query.get(int(eleve_id))
    if not eleve:
        return jsonify({'error': 'Élève non trouvé'}), 404

    texte = Texte.query.get(int(texte_id))
    if not texte:
        return jsonify({'error': 'Texte introuvable'}), 404

    # Enregistrer l'audio
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Créer un enregistrement avec l'ID du texte reçu
    recorder = Recorder(id_eleve=int(eleve_id), id_texte=int(texte_id), file_path=filepath)
    db.session.add(recorder)
    db.session.commit()

    return jsonify({'message': 'Audio enregistré avec succès', 'path': filepath}), 200
