from flask import Blueprint, request, jsonify
from models import Repence, db, QCM

qcm_bp = Blueprint('qcm', __name__)


@qcm_bp.route('/qcm/add/<int:idTexte>', methods=['POST'])
def add_qcm(idTexte):
    data = request.get_json()
    try:
        qcm = QCM(
            idTexte=idTexte,
            question=data['question'],
            choix=data['choix'],  # doit être une liste dans le JSON
            reponse=data['reponse']
        )
        db.session.add(qcm)
        db.session.commit()
        return jsonify({'message': 'QCM ajouté avec succès.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

    

@qcm_bp.route('/qcm/<int:idTexte>', methods=['GET'])
def get_qcm_by_text(idTexte):
    qcm_list = QCM.query.filter_by(idTexte=idTexte).all()
    return jsonify([qcm.to_dict() for qcm in qcm_list])


@qcm_bp.route('/repence', methods=['POST'])
def enregistrer_reponse():
    try:
        data = request.json
        print("Données reçues:", data)  # Log pour vérifier ce qui arrive

        id_qcm = data['idQCM']
        reponse_etudiant = data['reponseEtudiant']

        qcm = QCM.query.filter_by(idQCM=id_qcm).first()
        if not qcm:
            return jsonify({"erreur": "Question QCM introuvable"}), 404

        note = 10 if qcm.reponse == reponse_etudiant else 0

        nouvelle_repence = Repence(
            idQCM=id_qcm,
            reponseEtudiant=reponse_etudiant,
            evaluationNoteIA=str(note),
            evaluationJustificationIA="Réponse correcte" if note == 10 else "Réponse incorrecte"
        )

        db.session.add(nouvelle_repence)
        db.session.commit()

        return jsonify({
            "message": "Réponse enregistrée",
            "idRepence": nouvelle_repence.idRepence,
            "note": note
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"erreur": str(e)}), 500
