import React, { useEffect, useState } from 'react';
import { useEleveAuthContext } from '../../contexts/EleveAuthContext.js';
import { useQuestionsOuvertes } from '../../hooks/useQuestionsOuvertes.js';

const QuestionsOuvertesPage = ({ idTexte, onBackToTexte, onBackToQCM }) => {
  const { user } = useEleveAuthContext();
  const { questions, loading, error, fetchQuestionsOuvertes, submitAnswer, clearError } = useQuestionsOuvertes();
  
  // États pour la gestion des questions ouvertes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  // Charger les questions au montage du composant
  useEffect(() => {
    if (idTexte) {
      fetchQuestionsOuvertes(idTexte);
    }
  }, [idTexte, fetchQuestionsOuvertes]);

  // Soumettre la réponse de l'étudiant
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Veuillez écrire votre réponse');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setSubmitting(true);

    try {
      const result = await submitAnswer(currentQuestion.idQO, userAnswer.trim());
      
      setFeedback(result.feedbackStructure);
      setUserAnswers(prev => [...prev, {
        questionIndex: currentQuestionIndex,
        question: currentQuestion.question,
        userAnswer: userAnswer.trim(),
        feedback: result.feedbackStructure
      }]);
      
      setCompletedQuestions(prev => prev + 1);
      setShowFeedback(true);

    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la réponse:', err);
      alert('Erreur lors de l\'enregistrement de la réponse: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Passer à la question suivante
  const handleNextQuestion = () => {
    setShowFeedback(false);
    setUserAnswer('');
    setFeedback(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Recommencer les questions ouvertes
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    setCompletedQuestions(0);
    setUserAnswers([]);
    clearError();
  };

  // Rendu des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="questions-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Chargement des questions ouvertes...</h2>
        <div style={{ fontSize: '24px', margin: '20px 0' }}>⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questions-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ Erreur</h2>
        <p style={{ color: 'red', margin: '20px 0' }}>{error}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => fetchQuestionsOuvertes(idTexte)}
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
      <div className="questions-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>📝 Aucune question ouverte disponible</h2>
        <p>Il n'y a pas encore de questions ouvertes pour ce texte.</p>
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
  const isQuestionsCompleted = completedQuestions === questions.length;

  return (
    <div className="questions-container" style={{ 
      maxWidth: '900px', 
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
        <h1 style={{ margin: 0, color: '#495057' }}>📝 Questions Ouvertes</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {onBackToQCM && (
            <button
              onClick={onBackToQCM}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Retour au QCM
            </button>
          )}
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
            Complétées: {completedQuestions}/{questions.length}
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

      {/* Questions terminées */}
      {isQuestionsCompleted ? (
        <div style={{ 
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px solid #28a745'
        }}>
          <h2 style={{ color: '#28a745', fontSize: '28px', marginBottom: '20px' }}>
            🎉 Questions Ouvertes Terminées !
          </h2>
          <div style={{ fontSize: '18px', marginBottom: '30px', color: '#6c757d' }}>
            Toutes les questions ont été complétées avec succès.
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
              🔄 Recommencer les questions
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
              textAlign: 'right',
              direction: 'rtl'
            }}>
              {currentQuestion.question}
            </h3>

            {/* Zone de réponse */}
            <div style={{ marginBottom: '25px' }}>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
                placeholder="اكتب إجابتك هنا... (Write your answer here...)"
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'Arial, sans-serif',
                  textAlign: 'right',
                  direction: 'rtl'
                }}
              />
            </div>

            {/* Bouton de soumission */}
            {!showFeedback && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || submitting}
                style={{
                  backgroundColor: userAnswer.trim() && !submitting ? '#007bff' : '#9E9E9E',
                  color: 'white',
                  padding: '15px 30px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: userAnswer.trim() && !submitting ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {submitting ? '⏳ Envoi en cours...' : '✅ Envoyer ma réponse'}
              </button>
            )}
          </div>

          {/* Feedback de l'IA */}
          {showFeedback && feedback && (
            <div style={{ 
              padding: '25px',
              borderRadius: '10px',
              backgroundColor: '#f8f9fa',
              border: '2px solid #007bff',
              marginBottom: '20px'
            }}>
              <h4 style={{ 
                color: '#007bff',
                marginBottom: '20px',
                fontSize: '18px'
              }}>
                📋 Évaluation de votre réponse
              </h4>
              
              {/* Note */}
              {feedback.evaluation_note && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Note: </strong>
                  <span style={{ 
                    color: '#28a745', 
                    fontSize: '18px', 
                    fontWeight: 'bold' 
                  }}>
                    {feedback.evaluation_note}
                  </span>
                </div>
              )}

              {/* Justification */}
              {feedback.justification_evaluation && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Justification:</strong>
                  <p style={{ 
                    marginTop: '5px',
                    textAlign: 'right',
                    direction: 'rtl',
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #dee2e6'
                  }}>
                    {feedback.justification_evaluation}
                  </p>
                </div>
              )}

              {/* Réponse corrigée */}
              {feedback.reponse_corrigee && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Réponse suggérée:</strong>
                  <p style={{ 
                    marginTop: '5px',
                    textAlign: 'right',
                    direction: 'rtl',
                    backgroundColor: '#e8f5e8',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #28a745'
                  }}>
                    {feedback.reponse_corrigee}
                  </p>
                </div>
              )}

              {/* Erreurs détectées */}
              {feedback.erreurs_detectees && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Erreurs détectées:</strong>
                  <p style={{ 
                    marginTop: '5px',
                    textAlign: 'right',
                    direction: 'rtl',
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #dc3545'
                  }}>
                    {feedback.erreurs_detectees}
                  </p>
                </div>
              )}

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
                  fontWeight: 'bold',
                  marginTop: '15px'
                }}
              >
                {isLastQuestion ? '🏁 Voir le résumé final' : '➡️ Question suivante'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionsOuvertesPage;