from flask import Blueprint, request, jsonify
from models import db, QuestionOuvert

question_ouvert_bp = Blueprint('question_ouvert', __name__)

# ➕ Ajouter une question ouverte
@question_ouvert_bp.route('/questionouvert/add/<int:idTexte>', methods=['POST'])
def add_question_ouvert(idTexte):
    data = request.get_json()
    try:
        question = QuestionOuvert(
            idTexte=idTexte,
            question=data['question'],
            niveau=data['niveau']
        )
        db.session.add(question)
        db.session.commit()
        return jsonify({'message': 'Question ajoutée avec succès.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@question_ouvert_bp.route('/questionouvert/<int:idTexte>', methods=['GET'])
def get_questions_by_text(idTexte):
    questions = QuestionOuvert.query.filter_by(idTexte=idTexte).all()  # ✅ corrigé ici
    return jsonify([q.to_dict() for q in questions])
