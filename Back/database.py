from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

# Modèle de la table Eleve
class Eleve(db.Model):
    __tablename__ = 'eleve'
    idEleve = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False)
    prenom = db.Column(db.String(50), nullable=False)
    dateNaissance = db.Column(db.Date, nullable=False)
    niveauScolaire = db.Column(db.String(50), nullable=False)
    niveauTest = db.Column(db.String(50), nullable=False)
    cne = db.Column(db.String(50), nullable=False)
    

    def __init__(self, nom, prenom, dateNaissance, niveauScolaire, niveauTest,cne):
        self.nom = nom
        self.prenom = prenom
        self.dateNaissance = dateNaissance
        self.niveauScolaire = niveauScolaire
        self.niveauTest = niveauTest
        self.cne = cne

