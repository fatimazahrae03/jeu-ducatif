import React, { useEffect, useState, useRef } from 'react';
import { useEleveTexteContext } from '../../contexts/EleveTexteContext';
import { useEleveAuthContext } from '../../contexts/EleveAuthContext.js';

const EleveTexteDisplay = () => {
  const { user } = useEleveAuthContext();
  const { texte, loading, error, fetchTexte, clearError } = useEleveTexteContext();
  
  // États pour l'enregistrement audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (user && user.id) {
      fetchTexte(user.id);
    }
  }, [user, fetchTexte]);

  // Fonction pour démarrer l'enregistrement
  const startRecording = async () => {
    try {
      setUploadError(null);
      setUploadSuccess(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Arrêter tous les tracks du stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      setUploadError('Erreur lors de l\'accès au microphone. Vérifiez les permissions.');
    }
  };

  // Fonction pour arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Fonction pour envoyer l'audio au serveur
  const uploadAudio = async () => {
    if (!audioBlob || !user || !texte) {
      setUploadError('Données manquantes pour l\'upload');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      
      // Créer un nom de fichier unique
      const timestamp = new Date().getTime();
      const filename = `recording_${user.id}_${timestamp}.wav`;
      
      formData.append('file', audioBlob, filename);
      formData.append('id_eleve', user.id.toString());
      
      // Déterminer l'idTexte selon la structure de votre objet texte
      let idTexte;
      if (typeof texte === 'object' && texte.idTexte) {
        idTexte = texte.idTexte;
      } else if (typeof texte === 'object' && texte.id) {
        idTexte = texte.id;
      } else {
        // Si c'est juste une string ou structure différente, vous devrez adapter
        idTexte = 1; // valeur par défaut - à adapter selon votre logique
      }
      
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
      setAudioBlob(null); // Reset l'audio blob après upload réussi
      
      // Optionnel : afficher la transcription
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

  // Fonction pour annuler l'enregistrement
  const cancelRecording = () => {
    setAudioBlob(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

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
      </div>
    );
  }

  return (
    <div className="texte-display">
      <h3>Texte de l'élève</h3>
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
          </div>
        )}
      </div>

      {/* Section d'enregistrement audio */}
      <div className="audio-recording-section" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h4>Enregistrement audio</h4>
        
        {/* Messages d'état */}
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

        {/* Boutons d'enregistrement */}
        <div className="recording-controls">
          {!isRecording && !audioBlob && (
            <button 
              onClick={startRecording}
              style={{ 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🎤 Commencer l'enregistrement
            </button>
          )}

          {isRecording && (
            <button 
              onClick={stopRecording}
              style={{ 
                backgroundColor: '#f44336', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              ⏹️ Arrêter l'enregistrement
            </button>
          )}

          {audioBlob && !isUploading && (
            <>
              <button 
                onClick={uploadAudio}
                style={{ 
                  backgroundColor: '#2196F3', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                📤 Envoyer l'audio
              </button>
              <button 
                onClick={cancelRecording}
                style={{ 
                  backgroundColor: '#9E9E9E', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ❌ Annuler
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

        {/* Indicateur d'enregistrement */}
        {isRecording && (
          <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
            🔴 Enregistrement en cours...
          </div>
        )}

        {/* Indicateur d'audio prêt */}
        {audioBlob && (
          <div style={{ marginTop: '10px', color: 'green' }}>
            ✅ Enregistrement prêt à être envoyé
          </div>
        )}
      </div>

      <button 
        onClick={() => fetchTexte(user.id)}
        style={{ marginTop: '15px' }}
      >
        Actualiser
      </button>
    </div>
  );
};

export default EleveTexteDisplay;