import React, { useEffect, useState } from 'react';
import { useEleveTexteContext } from '../../contexts/EleveTexteContext';
import { useEleveAuthContext } from '../../contexts/EleveAuthContext.js';
import QCMPage from './QCMPage'; // Importez le composant QCM

const EleveTexteDisplay = ({ onNavigateToQCM }) => {
  const { user } = useEleveAuthContext();
  const { texte, loading, error, fetchTexte, clearError } = useEleveTexteContext();

  // États pour l'upload de fichier audio
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // État pour la navigation vers QCM
  const [showQCM, setShowQCM] = useState(false);
  const [currentIdTexte, setCurrentIdTexte] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetchTexte(user.id);
    }
  }, [user, fetchTexte]);

  // Fonction pour gérer la navigation vers QCM avec vérifications
  const handleQCMNavigation = () => {
    if (!texte) {
      alert('Aucun texte disponible. Impossible d\'accéder aux QCM.');
      return;
    }
    

    // Vérifier que le texte contient un ID
    const textId = (typeof texte === 'object' && (texte.idTexte || texte.id)) || null;
    if (!textId) {
      alert('ID du texte non trouvé. Impossible d\'accéder aux QCM.');
      return;
    }

    // Naviguer vers la page QCM
    setCurrentIdTexte(textId);
    setShowQCM(true);

    // Si onNavigateToQCM est fourni par le parent, l'utiliser aussi
    if (onNavigateToQCM && typeof onNavigateToQCM === 'function') {
      onNavigateToQCM();
    }
  };

  // Fonction pour revenir à l'affichage du texte
  const handleBackToTexte = () => {
    setShowQCM(false);
    setCurrentIdTexte(null);
  };

  // Fonction pour gérer la sélection d'un fichier audio
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
      setUploadSuccess(null);
    } else {
      setSelectedFile(null);
    }
  };

  // Fonction pour envoyer le fichier audio au serveur
  const uploadAudio = async () => {
    if (!selectedFile || !user || !texte) {
      setUploadError('Données manquantes pour l\'upload (fichier, utilisateur ou texte).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();

      // Déterminer l'idTexte selon la structure de votre objet texte
      let idTexte;
      if (typeof texte === 'object' && texte.idTexte) {
        idTexte = texte.idTexte;
      } else if (typeof texte === 'object' && texte.id) {
        idTexte = texte.id;
      } else {
        console.warn('idTexte non trouvé dans l\'objet texte, utilisant la valeur par défaut (1).');
        idTexte = 1;
      }

      formData.append('file', selectedFile, selectedFile.name);
      formData.append('id_eleve', user.id.toString());
      formData.append('idTexte', idTexte.toString());

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';

      const response = await fetch(`${API_BASE_URL}/uploadd`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }

      setUploadSuccess('Audio envoyé et transcrit avec succès !');
      setSelectedFile(null);

      if (data.transcription) {
        console.log('Transcription:', data.transcription);
      }

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setUploadError(error.message || 'Erreur lors de l\'envoi de l\'audio');
    } finally {
      setIsUploading(false);
    }
  };

  // Si on doit afficher la page QCM
  if (showQCM && currentIdTexte) {
    return (
      <QCMPage 
        idTexte={currentIdTexte} 
        onBackToTexte={handleBackToTexte}
      />
    );
  }

  if (loading) {
    return (
      <div className="texte-loading">
        <p>Chargement du texte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="texte-error">
        <p>Erreur: {error}</p>
        <button onClick={clearError}>Fermer</button>
        <button onClick={() => user && fetchTexte(user.id)}>
          Réessayer
        </button>
      </div>
    );
  }

  if (!texte) {
    return (
      <div className="no-texte">
        <p>Aucun texte disponible pour cet élève.</p>
        <button onClick={() => user && fetchTexte(user.id)}>
          Charger le texte
        </button>
      </div>
    );
  }

  return (
    <div className="texte-display">
      <h3>Texte de l'élève</h3>

      {/* Section QCM avec navigation améliorée */}
      <div className="qcm-section" style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ marginBottom: '10px', color: '#495057' }}>
          📝 Exercices QCM
        </h4>
        <p style={{ marginBottom: '15px', color: '#6c757d', fontSize: '14px' }}>
          Testez vos connaissances avec nos questionnaires interactifs basés sur ce texte
        </p>
        
        {/* Affichage conditionnel du bouton selon la disponibilité du texte */}
        {texte && (typeof texte === 'object' && (texte.idTexte || texte.id)) ? (
          <button
            onClick={handleQCMNavigation}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            🚀 Accéder aux QCM
          </button>
        ) : (
          <button
            disabled
            style={{
              backgroundColor: '#9E9E9E',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'not-allowed',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ❌ QCM non disponible
          </button>
        )}
        
        {/* Message d'information si le texte n'a pas d'ID valide */}
        {texte && !(typeof texte === 'object' && (texte.idTexte || texte.id)) && (
          <p style={{ marginTop: '10px', color: '#dc3545', fontSize: '12px' }}>
            ⚠️ ID du texte manquant - Les QCM ne peuvent pas être chargés
          </p>
        )}
      </div>

      <div className="texte-content">
        {typeof texte === 'string' ? (
          <p>{texte}</p>
        ) : (
          <div>
            {texte.titre && <h4>{texte.titre}</h4>}
            {texte.contenu && <p>{texte.contenu}</p>}
            {texte.dateCreation && (
              <small>Créé le: {new Date(texte.dateCreation).toLocaleDateString()}</small>
            )}
            {/* Debug info en mode développement */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '10px', padding: '5px', backgroundColor: '#e9ecef', fontSize: '12px' }}>
                <strong>Debug:</strong> ID Texte = {texte.idTexte || texte.id || 'Non défini'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section d'upload audio */}
      <div className="audio-upload-section" style={{ 
        marginTop: '20px', 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '5px' 
      }}>
        <h4>Uploader un fichier audio</h4>

        {uploadError && (
          <div className="upload-error" style={{ color: 'red', marginBottom: '10px' }}>
            <p>Erreur: {uploadError}</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="upload-success" style={{ color: 'green', marginBottom: '10px' }}>
            <p>{uploadSuccess}</p>
          </div>
        )}

        <div className="upload-controls">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="audio-upload-input"
          />
          <label
            htmlFor="audio-upload-input"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
              display: 'inline-block',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            📁 Choisir un fichier audio
          </label>

          {selectedFile && (
            <p style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>
              Fichier sélectionné: <strong>{selectedFile.name}</strong>
            </p>
          )}

          {selectedFile && !isUploading && (
            <>
              <button
                onClick={uploadAudio}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  marginTop: '15px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                📤 Envoyer l'audio
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '15px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                ❌ Annuler la sélection
              </button>
            </>
          )}

          {isUploading && (
            <button
              disabled
              style={{
                backgroundColor: '#9E9E9E',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'not-allowed'
              }}
            >
              ⏳ Envoi en cours...
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => user && fetchTexte(user.id)}
        style={{ marginTop: '15px' }}
      >
        Actualiser
      </button>
    </div>
  );
};

export default EleveTexteDisplay;