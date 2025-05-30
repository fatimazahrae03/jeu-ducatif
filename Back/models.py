from datetime import datetime
import enum
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Une seule instance de db
db = SQLAlchemy()

class Eleve(db.Model):
    __tablename__ = 'eleve'
    idEleve = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cne = db.Column(db.String(20), unique=True, nullable=False)
    nom = db.Column(db.String(50), nullable=False)
    prenom = db.Column(db.String(50), nullable=False)
    dateNaissance = db.Column(db.Date, nullable=False)
    niveauScolaire = db.Column(db.String(50), nullable=False)
    niveauTest = db.Column(db.String(50), nullable=False)

    def __init__(self, cne, nom, prenom, dateNaissance, niveauScolaire, niveauTest):
        self.cne = cne
        self.nom = nom
        self.prenom = prenom
        self.dateNaissance = dateNaissance
        self.niveauScolaire = niveauScolaire
        self.niveauTest = niveauTest

    def to_dict(self):
        return {
            'id': self.idEleve,
            'cne': self.cne,
            'nom': self.nom,
            'prenom': self.prenom,
            'dateNaissance': self.dateNaissance.strftime("%Y-%m-%d"),
            'niveauScolaire': self.niveauScolaire,
            'niveauTest': self.niveauTest
        }


class Recorder(db.Model):
    __tablename__ = 'recorder'
    id = db.Column(db.Integer, primary_key=True)
    id_eleve = db.Column(db.Integer, nullable=False)
    id_texte = db.Column(db.Integer, nullable=False)  # Ajout de l'ID du texte
    file_path = db.Column(db.String(255), nullable=False)
    date_enregistrement = db.Column(db.DateTime, default=datetime.utcnow)


class Admin(db.Model):
    __tablename__ = 'admin'
    idAdmin = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)  # Le champ pour le nom d'utilisateur
    prenom = db.Column(db.String(50), nullable=False)  # Le prénom de l'admin
    password = db.Column(db.String(100), nullable=False)  # Le mot de passe de l'admin

    def __init__(self, username, prenom, password):
        self.username = username
        self.prenom = prenom
        self.password = password

    def to_dict(self):
        return {
            'idAdmin': self.idAdmin,
            'username': self.username,
            'prenom': self.prenom
        }



class Professeur(db.Model):
    __tablename__ = 'professeur'
    IdProf = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(50), nullable=False)
    prenom = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)  # contiendra le mot de passe haché

    def __init__(self, nom, prenom, email, password):
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.set_password(password)  # on ne stocke jamais le mot de passe en clair

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'IdProf': self.IdProf,
            'nom': self.nom,
            'prenom': self.prenom,
            'email': self.email
        }

    
class NiveauL(enum.Enum):
    A = 'A'
    B = 'B'
    C = 'C'

class Texte(db.Model):
    __tablename__ = 'texte'

    idTexte = db.Column(db.Integer, primary_key=True)
    niveauC = db.Column(db.Integer, nullable=False)  # NiveauC comme entier
    niveauL = db.Column(db.Enum(NiveauL), nullable=False)  # NiveauL comme ENUM
    texteContent = db.Column(db.Text, nullable=False)

    def __init__(self, niveauC, niveauL, texteContent):
        self.niveauC = niveauC
        self.niveauL = niveauL
        self.texteContent = texteContent

class QuestionOuvert(db.Model):
    __tablename__ = 'questionouvert'

    idQO = db.Column(db.Integer, primary_key=True)
    idTexte = db.Column(db.Integer, db.ForeignKey('texte.idTexte'), nullable=False)
    question = db.Column(db.Text, nullable=False)  # ✅ corrigé ici
    niveau = db.Column(db.Integer, nullable=False)

    def __init__(self, idTexte, question, niveau):
        self.idTexte = idTexte
        self.question = question
        self.niveau = niveau

    def to_dict(self):
        return {
            'idQO': self.idQO,
            'idTexte': self.idTexte,
            'question': self.question,
            'niveau': self.niveau
        }
    

import json

class QCM(db.Model):
    __tablename__ = 'qcm'

    idQCM = db.Column(db.Integer, primary_key=True)
    idTexte = db.Column(db.Integer, db.ForeignKey('texte.idTexte'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    choix = db.Column(db.Text, nullable=False)  # Stocké sous forme de JSON (liste de choix)
    reponse = db.Column(db.String(1), nullable=False)  # Par exemple 'A', 'B', 'C' ou 'D'
    

    def __init__(self, idTexte, question, choix, reponse):
        self.idTexte = idTexte
        self.question = question
        self.choix = json.dumps(choix)  # On stocke la liste comme JSON
        self.reponse = reponse
       

    def to_dict(self):
        return {
            'idQCM': self.idQCM,
            'idTexte': self.idTexte,
            'question': self.question,
            'choix': json.loads(self.choix),
            'reponse': self.reponse
            
        }


class Historique(db.Model):
    __tablename__ = 'historique'

    idHys = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idEleve = db.Column(db.Integer, db.ForeignKey('eleve.idEleve'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    dure = db.Column(db.Integer, nullable=True)  # ou Float selon ton usage
    scoreLecture = db.Column(db.Float, nullable=True)
    scoreQCM = db.Column(db.Float, nullable=True)
    scoreQO = db.Column(db.Float, nullable=True)

    eleve = db.relationship('Eleve', backref=db.backref('historiques', lazy=True))

    def __init__(self, idEleve, type, dure=None, scoreLecture=None, scoreQCM=None, scoreQO=None):
       self.idEleve = idEleve
       self.type = type
       self.dure = dure
       self.scoreLecture = scoreLecture
       self.scoreQCM = scoreQCM
       self.scoreQO = scoreQO

    def to_dict(self):
        return {
            'idHys': self.idHys,
            'idEleve': self.idEleve,
            'type': self.type,
            'dure': self.dure,
            'scoreLecture': self.scoreLecture,
            'scoreQCM': self.scoreQCM,
            'scoreQO': self.scoreQO
        }
 

class Repence(db.Model):
    __tablename__ = 'repence'

    idRepence = db.Column(db.Integer, primary_key=True)
    idQCM = db.Column(db.Integer, db.ForeignKey('qcm.idQCM'), nullable=False)
    reponseEtudiant = db.Column(db.Text, nullable=False)
    evaluationNoteIA = db.Column(db.String(10), nullable=True)  # corrigé ici
    evaluationJustificationIA = db.Column(db.Text, nullable=True)

    def __init__(self, idQCM, reponseEtudiant, evaluationNoteIA=None, evaluationJustificationIA=None):  # corrigé ici
        self.idQCM = idQCM
        self.reponseEtudiant = reponseEtudiant
        self.evaluationNoteIA = evaluationNoteIA  # corrigé ici
        self.evaluationJustificationIA = evaluationJustificationIA

