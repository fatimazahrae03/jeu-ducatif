from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.students import students_bp
from routes.professeurs import prof_bp
from routes.loginprof import login_professeur_bp
from routes.texte import texte_bp
from routes.questionouvert import question_ouvert_bp
from routes.qcm import qcm_bp
from routes.loginelev import eleve_bp
from routes.testeeleve import elevetest_bp
from routes.recorde import recorder_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])
app.config.from_object(Config)

# Initialiser la base de données avec l'application
db.init_app(app)

# Enregistrer les blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(students_bp)
app.register_blueprint(prof_bp)
app.register_blueprint(login_professeur_bp)
app.register_blueprint(texte_bp)
app.register_blueprint(question_ouvert_bp)
app.register_blueprint(qcm_bp)
app.register_blueprint(eleve_bp)
app.register_blueprint(elevetest_bp)
app.register_blueprint(recorder_bp)



if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)

from flask import send_from_directory

@app.route('/login')
def login_page():
    return send_from_directory('public', 'login.html')

@app.route('/<path:filename>')
def public_files(filename):
    return send_from_directory('public', filename)

@app.route('/texte')
def texte_page():
    return send_from_directory('public', 'texte.html')