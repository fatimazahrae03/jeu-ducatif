import React, { useEffect, useState } from 'react';
import { useEleveAuthContext } from '../../contexts/EleveAuthContext.js';
import { useQCM } from '../../hooks/useQCM.js'; // Importez votre hook

const QCMPage = ({ idTexte, onBackToTexte }) => {
  const { user } = useEleveAuthContext();
  const { questions, loading, error, fetchQCM, submitAnswer, clearError } = useQCM();
  
  // États pour la gestion du QCM
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Pour stocker toutes les réponses

  // Charger les questions QCM au montage du composant
  useEffect(() => {
    if (idTexte) {
      fetchQCM(idTexte);
    }
  }, [idTexte, fetchQCM]);

  // Soumettre la réponse de l'étudiant
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      alert('Veuillez sélectionner une réponse');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setSubmitting(true);

    try {
      // Enregistrer la réponse en caractères arabes dans la base de données
      await submitAnswer(
        currentQuestion.idQCM,
        user?.id || 1,
        selectedAnswer // selectedAnswer contient déjà le caractère arabe (أ, ب, ج, د)
      );

      // Vérifier si la réponse est correcte
      const correct = currentQuestion.reponse === selectedAnswer;
      setIsCorrect(correct);
      
      if (correct) {
        setScore(prevScore => prevScore + 1);
      }
      
      // Stocker la réponse de l'utilisateur
      setUserAnswers(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        selectedAnswer,
        correctAnswer: currentQuestion.reponse,
        isCorrect: correct
      }]);
      
      setCompletedQuestions(prev => prev + 1);
      setShowResult(true);

    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la réponse:', err);
      alert('Erreur lors de l\'enregistrement de la réponse: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Passer à la question suivante
  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Recommencer le QCM
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setCompletedQuestions(0);
    setUserAnswers([]);
    clearError();
  };

  // Rendu des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="qcm-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Chargement des questions QCM...</h2>
        <div style={{ fontSize: '24px', margin: '20px 0' }}>⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="qcm-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Erreur</h2>
        <p style={{ color: 'red', margin: '20px 0' }}>{error}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => fetchQCM(idTexte)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 Réessayer
          </button>
          <button
            onClick={onBackToTexte}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Retour au texte
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="qcm-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>📝 Aucune question disponible</h2>
        <p>Il n'y a pas encore de questions QCM pour ce texte.</p>
        <button
          onClick={onBackToTexte}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Retour au texte
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isQCMCompleted = completedQuestions === questions.length;

  // Fonction pour formater les choix avec les caractères arabes
  const formatChoices = (choix) => {
    const arabicLetters = ['أ', 'ب', 'ج', 'د']; // Caractères arabes à utiliser
    
    if (Array.isArray(choix)) {
      return choix.map((choice, index) => {
        // Extraire le texte en supprimant l'ancien préfixe s'il existe
        let text = choice;
        
        // Si le choix contient déjà un format "lettre. texte", extraire seulement le texte
        if (choice.includes('. ')) {
          const parts = choice.split('. ');
          text = parts.slice(1).join('. '); // Prendre tout après le premier ". "
        }
        
        // Utiliser les caractères arabes
        const arabicLetter = arabicLetters[index] || arabicLetters[0];
        
        return { 
          letter: arabicLetter, 
          text: text 
        };
      });
    }
    return [];
  };

  return (
    <div className="qcm-container" style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* En-tête */}
      <div style={{ 
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0, color: '#495057' }}>📝 QCM - Questions à choix multiples</h1>
        <button
          onClick={onBackToTexte}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Retour au texte
        </button>
      </div>

      {/* Barre de progression */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold' }}>
            Question {currentQuestionIndex + 1} sur {questions.length}
          </span>
          <span style={{ color: '#28a745', fontWeight: 'bold' }}>
            Score: {score}/{completedQuestions}
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#007bff',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* QCM terminé */}
      {isQCMCompleted ? (
        <div style={{ 
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px solid #28a745'
        }}>
          <h2 style={{ color: '#28a745', fontSize: '28px', marginBottom: '20px' }}>
            🎉 QCM Terminé !
          </h2>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>
            Score final: <strong style={{ color: '#28a745' }}>{score}/{questions.length}</strong>
          </div>
          <div style={{ fontSize: '18px', marginBottom: '30px', color: '#6c757d' }}>
            Pourcentage de réussite: {Math.round((score / questions.length) * 100)}%
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={handleRestart}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🔄 Recommencer le QCM
            </button>
            <button
              onClick={onBackToTexte}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ✅ Retour au texte
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Question actuelle */}
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              marginBottom: '25px',
              color: '#495057',
              fontSize: '20px',
              lineHeight: '1.5',
              textAlign: 'right' // Pour l'arabe
            }}>
              {currentQuestion.question}
            </h3>

            {/* Options de réponse */}
            <div style={{ marginBottom: '25px' }}>
              {formatChoices(currentQuestion.choix).map((choice) => (
                <label
                  key={choice.letter}
                  style={{
                    display: 'block',
                    marginBottom: '15px',
                    padding: '15px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedAnswer === choice.letter ? '#e3f2fd' : '#ffffff',
                    borderColor: selectedAnswer === choice.letter ? '#2196f3' : '#e9ecef',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={choice.letter}
                    checked={selectedAnswer === choice.letter}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    disabled={showResult}
                    style={{ marginLeft: '12px', transform: 'scale(1.2)' }}
                  />
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}>
                    {choice.letter}. {choice.text}
                  </span>
                </label>
              ))}
            </div>

            {/* Bouton de soumission */}
            {!showResult && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || submitting}
                style={{
                  backgroundColor: selectedAnswer && !submitting ? '#007bff' : '#9E9E9E',
                  color: 'white',
                  padding: '15px 30px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selectedAnswer && !submitting ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {submitting ? '⏳ Envoi en cours...' : '✅ Valider ma réponse'}
              </button>
            )}
          </div>

          {/* Résultat de la question */}
          {showResult && (
            <div style={{ 
              padding: '25px',
              borderRadius: '10px',
              backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
              border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
              marginBottom: '20px'
            }}>
              <h4 style={{ 
                color: isCorrect ? '#155724' : '#721c24',
                marginBottom: '15px',
                fontSize: '18px'
              }}>
                {isCorrect ? '✅ Bonne réponse !' : '❌ Réponse incorrecte'}
              </h4>
              
              <p style={{ 
                color: isCorrect ? '#155724' : '#721c24',
                marginBottom: '15px',
                fontSize: '16px',
                textAlign: 'right',
                direction: 'rtl'
              }}>
                {isCorrect 
                  ? 'أحسنت! لقد اخترت الإجابة الصحيحة.'
                  : `الإجابة الصحيحة كانت: ${currentQuestion.reponse}`
                }
              </p>

              <button
                onClick={handleNextQuestion}
                style={{
                  backgroundColor: isLastQuestion ? '#28a745' : '#007bff',
                  color: 'white',
                  padding: '12px 25px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {isLastQuestion ? '🏁 Voir les résultats finaux' : '➡️ Question suivante'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QCMPage;