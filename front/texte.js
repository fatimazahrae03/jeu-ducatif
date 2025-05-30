/**
 * Application de lecture de textes éducatifs
 * Gestion de l'enregistrement audio et de la synthèse vocale
 */

class ReadingApp {
  constructor() {
    // Variables d'état
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.currentAudio = null;
    this.recordedBlob = null;
    this.currentStudentId = null;
    this.currentTextId = null;
    this.isUploading = false;

    // Configuration de l'API
    this.API_BASE_URL = 'http://127.0.0.1:5000';
    this.UPLOAD_API_URL = 'http://127.0.0.1:5005/upload';
    

    // Éléments DOM
    this.elements = {};
    
    // Initialisation
    this.init();
  }

  /**
   * Initialisation de l'application
   */
  init() {
    this.bindElements();
    this.bindEvents();
    this.loadTextData();
  }

  /**
   * Liaison des éléments DOM
   */
  bindElements() {
    this.elements = {
      container: document.getElementById('textes-container'),
      recordBtn: document.getElementById('record-btn'),
      listenBtn: document.getElementById('listen-btn'),
      submitBtn: document.getElementById('submit-btn'),
      newRecordingBtn: document.getElementById('new-recording-btn'),
      audioPlayer: document.getElementById('audio-player'),
      recordedAudio: document.getElementById('recorded-audio'),
      statusMessage: document.getElementById('status-message'),
      recordIcon: document.getElementById('record-icon'),
      recordText: document.getElementById('record-text'),
      listenIcon: document.getElementById('listen-icon'),
      listenText: document.getElementById('listen-text'),
      submitIcon: document.getElementById('submit-icon'),
      submitText: document.getElementById('submit-text')
    };
  }

  /**
   * Liaison des événements
   */
  bindEvents() {
    // Événements des boutons
    this.elements.recordBtn.addEventListener('click', () => this.toggleRecording());
    this.elements.listenBtn.addEventListener('click', () => this.toggleTextToSpeech());
    this.elements.submitBtn.addEventListener('click', () => this.submitAudio());
    this.elements.newRecordingBtn.addEventListener('click', () => this.startNewRecording());

    // Désactiver les boutons au début
    this.elements.recordBtn.disabled = true;
    this.elements.listenBtn.disabled = true;
  }

  /**
   * Chargement des données de texte depuis l'API
   */
  async loadTextData() {
    try {
      // Récupérer les données de l'étudiant depuis localStorage
      const eleveData = this.getStudentData();
      if (!eleveData.id) {
        this.showError('لم يتم العثور على معرف الطالب. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }

      this.currentStudentId = eleveData.id;
      console.log('Student ID:', this.currentStudentId);

      // Récupérer le texte depuis le serveur
      const response = await fetch(`${this.API_BASE_URL}/texteeleve/${this.currentStudentId}`);
      const texteData = await response.json();

      console.log('Text data received:', texteData);

      if (texteData.error) {
        this.showError(texteData.error);
        return;
      }

      // Stocker l'ID du texte
      this.currentTextId = texteData.idTexte || texteData.id || texteData.textId;
      console.log('Current Text ID:', this.currentTextId);

      // Afficher le texte
      this.displayText(texteData);

      // Activer les boutons
      this.elements.recordBtn.disabled = false;
      this.elements.listenBtn.disabled = false;

    } catch (error) {
      console.error('خطأ في تحميل النص:', error);
      this.showError('خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
    }
  }

  /**
   * Récupération des données de l'étudiant
   */
  getStudentData() {
    const eleveData = JSON.parse(localStorage.getItem('eleve')) || {};
    console.log('Student data:', eleveData);
    return eleveData;
  }

  /**
   * Affichage du texte dans le conteneur
   */
  displayText(texteData) {
    const textContent = texteData.texte || texteData.texteContent || texteData.text;
    
    this.elements.container.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; color: #98FB98; font-size: 16px;">
        📚 النص المخصص للطالب رقم ${this.currentStudentId} - النص رقم ${this.currentTextId}
      </div>
      <div style="font-size: 24px; line-height: 2;">
        ${textContent}
      </div>
    `;
  }

  /**
   * Basculer l'enregistrement audio
   */
  async toggleRecording() {
    if (!this.isRecording) {
      await this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  /**
   * Démarrer l'enregistrement
   */
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.handleRecordingComplete(stream);
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      // Mise à jour de l'interface
      this.updateRecordingUI(true);
      this.showStatus('جاري التسجيل... 🎤', 'info');

    } catch (error) {
      console.error('خطأ في الوصول للميكروفون:', error);
      this.showStatus('خطأ في الوصول للميكروفون. يرجى التحقق من الأذونات.', 'error');
    }
  }

  /**
   * Arrêter l'enregistrement
   */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.updateRecordingUI(false);
    }
  }

  async convertWavToOgg(wavBlob) {
 const { createFFmpeg, fetchFile } = FFmpeg; // Pas window.FFmpeg

  
  const ffmpeg = createFFmpeg({ log: false });
  await ffmpeg.load();

  const wavFilename = 'input.wav';
  const oggFilename = 'output.ogg';

  ffmpeg.FS('writeFile', wavFilename, await fetchFile(wavBlob));

  await ffmpeg.run('-i', wavFilename, '-c:a', 'libvorbis', oggFilename);

  const oggData = ffmpeg.FS('readFile', oggFilename);
  const oggBlob = new Blob([oggData.buffer], { type: 'audio/ogg' });

  return oggBlob;
}

  /**
   * Gérer la fin de l'enregistrement
   */
 async handleRecordingComplete(stream) {
    const wavBlob = new Blob(this.audioChunks, { type: 'audio/wav' });

    try {
      this.recordedBlob = wavBlob;

      const audioUrl = URL.createObjectURL(this.recordedBlob);
      this.elements.recordedAudio.src = audioUrl;
      this.elements.audioPlayer.style.display = 'block';

      this.showStatus('✅ تم تسجيل الصوت بنجاح بصيغة WAV!', 'success');
    } catch (err) {
      console.error('Erreur lors de la gestion de l audio WAV:', err);
      this.showStatus('⚠️ فشل معالجة تسجيل WAV.', 'error');
    }

    stream.getTracks().forEach(track => track.stop());
  }

  /**
   * Mise à jour de l'interface d'enregistrement
   */
  updateRecordingUI(isRecording) {
    if (isRecording) {
      this.elements.recordBtn.classList.add('recording');
      this.elements.recordIcon.textContent = '⏹️';
      this.elements.recordText.textContent = 'إيقاف التسجيل';
    } else {
      this.elements.recordBtn.classList.remove('recording');
      this.elements.recordIcon.textContent = '🎤';
      this.elements.recordText.textContent = 'تسجيل الصوت';
    }
  }

  /**
   * Basculer la synthèse vocale
   */
  toggleTextToSpeech() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.stopTextToSpeech();
    } else {
      this.startTextToSpeech();
    }
  }

  /**
   * Démarrer la synthèse vocale
   */
  startTextToSpeech() {
    const textContent = this.elements.container.textContent;
    
    if (!('speechSynthesis' in window)) {
      this.showStatus('متصفحك لا يدعم قراءة النصوص صوتياً', 'error');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textContent);
    utterance.lang = 'ar-SA'; // Langue arabe
    utterance.rate = 0.8; // Vitesse plus lente pour une meilleure compréhension
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      this.updateTextToSpeechUI(true);
      this.showStatus('جاري قراءة النص... 🔊', 'info');
    };
    
    utterance.onend = () => {
      this.updateTextToSpeechUI(false);
      this.showStatus('انتهت قراءة النص ✅', 'success');
    };
    
    utterance.onerror = () => {
      this.updateTextToSpeechUI(false);
      this.showStatus('خطأ في قراءة النص. المتصفح قد لا يدعم اللغة العربية.', 'error');
    };
    
    speechSynthesis.speak(utterance);
  }

  /**
   * Arrêter la synthèse vocale
   */
  stopTextToSpeech() {
    speechSynthesis.cancel();
    this.updateTextToSpeechUI(false);
    this.showStatus('تم إيقاف التشغيل', 'info');
  }

  /**
   * Mise à jour de l'interface de synthèse vocale
   */
  updateTextToSpeechUI(isPlaying) {
    if (isPlaying) {
      this.elements.listenBtn.classList.add('playing');
      this.elements.listenIcon.textContent = '⏸️';
      this.elements.listenText.textContent = 'إيقاف القراءة';
    } else {
      this.elements.listenBtn.classList.remove('playing');
      this.elements.listenIcon.textContent = '🔊';
      this.elements.listenText.textContent = 'استمع للنص';
    }
  }

  /**
   * Soumettre l'audio pour analyse
   */
  async submitAudio() {
    if (!this.recordedBlob || this.isUploading) {
      return;
    }

    if (!this.currentStudentId || !this.currentTextId) {
      this.showStatus('❌ معلومات الطالب أو النص غير متوفرة', 'error');
      console.error('Missing data - Student ID:', this.currentStudentId, 'Text ID:', this.currentTextId);
      return;
    }

    this.isUploading = true;
    this.updateSubmitUI(true);

    try {
      const formData = this.createFormData();
      
      console.log('Sending data:', {
        student_id: this.currentStudentId,
        text_id: this.currentTextId,
        file_size: this.recordedBlob.size
      });

      this.showStatus('🚀 جاري إرسال التسجيل للتحليل...', 'info');

      const response = await fetch(this.UPLOAD_API_URL, {
        method: 'POST',
        body: formData
      });

      await this.handleSubmitResponse(response);

    } catch (error) {
      console.error('خطأ في إرسال الملف:', error);
      this.showStatus('❌ خطأ في الشبكة. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
      this.isUploading = false;
      this.updateSubmitUI(false);
    }
  }

  /**
   * Créer les données du formulaire
   */
  createFormData() {
  const formData = new FormData();
  const ext = this.recordedBlob.type === 'audio/ogg' ? 'ogg' : 'wav';
  const audioFile = new File(
    [this.recordedBlob],
    `audio_${this.currentStudentId}_${Date.now()}.${ext}`,
    { type: this.recordedBlob.type }
  );

  formData.append('file', audioFile);
  formData.append('id_eleve', String(this.currentStudentId));
  formData.append('text_id', String(this.currentTextId));
  return formData;
}

  /**
   * Gérer la réponse de soumission
   */
  async handleSubmitResponse(response) {
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Server response:', result);

    if (result.success) {
      this.handleSuccessfulSubmission(result);
    } else {
      this.handleFailedSubmission(result);
    }
  }

  /**
   * Gérer une soumission réussie
   */
  handleSuccessfulSubmission(result) {
    this.showStatus('✅ تم إرسال التسجيل بنجاح! جاري التوجيه لصفحة النتائج...', 'success');
    
    // Stocker les données de résultat pour la page de résultats
    const analysisResult = {
      record_id: result.record_id,
      transcription: result.transcription,
      quality_analysis: result.quality_analysis,
      pronunciation_corrections: result.pronunciation_corrections,
      student_id: this.currentStudentId,
      text_id: this.currentTextId,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('analysisResult', JSON.stringify(analysisResult));

    // Redirection vers la page de résultats après 2 secondes
    setTimeout(() => {
      window.location.href = 'results.html';
    }, 2000);
  }

  /**
   * Gérer une soumission échouée
   */
  handleFailedSubmission(result) {
    this.showStatus(`❌ خطأ في التحليل: ${result.message || result.error}`, 'error');
    
    // Si problèmes de qualité, afficher les détails
    if (result.errors && result.errors.length > 0) {
      const errorDetails = result.errors.join(', ');
      this.showStatus(`❌ مشاكل في جودة الصوت: ${errorDetails}`, 'error');
    }
  }

  /**
   * Mise à jour de l'interface de soumission
   */
  updateSubmitUI(isUploading) {
    if (isUploading) {
      this.elements.submitBtn.classList.add('uploading');
      this.elements.submitIcon.textContent = '⏳';
      this.elements.submitText.textContent = 'جاري الإرسال...';
      this.elements.submitBtn.disabled = true;
    } else {
      this.elements.submitBtn.classList.remove('uploading');
      this.elements.submitIcon.textContent = '📤';
      this.elements.submitText.textContent = 'إرسال للتحليل';
      this.elements.submitBtn.disabled = false;
    }
  }

  /**
   * Démarrer un nouvel enregistrement
   */
  startNewRecording() {
    // Masquer le lecteur audio
    this.elements.audioPlayer.style.display = 'none';
    
    // Réinitialiser le blob enregistré
    this.recordedBlob = null;
    
    // Vider l'élément audio
    this.elements.recordedAudio.src = '';
    
    this.showStatus('يمكنك الآن إجراء تسجيل جديد 🎤', 'info');
  }

  /**
   * Afficher un message d'erreur
   */
  showError(message) {
    this.elements.container.innerHTML = `<div class="error">❌ ${message}</div>`;
  }

  /**
   * Afficher des messages de statut
   */
  showStatus(message, type) {
    const statusEl = this.elements.statusMessage;
    statusEl.textContent = message;
    statusEl.className = `status-message status-${type}`;
    statusEl.style.display = 'block';
    
    // Masquer après 4 secondes pour success/info (sauf pour les erreurs)
    if (type !== 'error') {
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 4000);
    }
  }
}

// Configuration et utilitaires
const AppConfig = {
  API_ENDPOINTS: {
    TEXT_DATA: '/texteeleve',
    UPLOAD: '/upload'
  },
  
  SPEECH_CONFIG: {
    LANGUAGE: 'ar-SA',
    RATE: 0.8,
    PITCH: 1
  },
  
  AUDIO_CONFIG: {
    TYPE: 'audio/wav',
    CONSTRAINTS: { audio: true }
  },
  
  TIMEOUTS: {
    STATUS_HIDE: 4000,
    REDIRECT: 2000
  }
};

// Utilitaires pour la gestion des données
const DataUtils = {
  /**
   * Valider les données de l'étudiant
   */
  validateStudentData(studentData) {
    return studentData && studentData.id && !isNaN(studentData.id);
  },

  /**
   * Valider les données du texte
   */
  validateTextData(textData) {
    return textData && !textData.error && (textData.texte || textData.texteContent || textData.text);
  },

  /**
   * Extraire l'ID du texte depuis différents formats de réponse
   */
  extractTextId(textData) {
    return textData.idTexte || textData.id || textData.textId;
  },

  /**
   * Extraire le contenu du texte depuis différents formats de réponse
   */
  extractTextContent(textData) {
    return textData.texte || textData.texteContent || textData.text;
  }
};

// Gestionnaire d'erreurs
const ErrorHandler = {
  /**
   * Gérer les erreurs d'API
   */
  handleApiError(error, context = '') {
    console.error(`Erreur API ${context}:`, error);
    
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'خطأ في الشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
    }
    
    if (error.status === 404) {
      return 'الصفحة أو البيانات المطلوبة غير موجودة.';
    }
    
    if (error.status === 500) {
      return 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
    }
    
    return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
  },

  /**
   * Gérer les erreurs de médias
   */
  handleMediaError(error) {
    console.error('خطأ في الوسائط:', error);
    
    if (error.name === 'NotAllowedError') {
      return 'تم رفض الإذن للوصول إلى الميكروفون. يرجى السماح بالوصول والمحاولة مرة أخرى.';
    }
    
    if (error.name === 'NotFoundError') {
      return 'لم يتم العثور على ميكروفون. يرجى التحقق من توصيل ميكروفون والمحاولة مرة أخرى.';
    }
    
    return 'خطأ في الوصول للميكروفون. يرجى التحقق من الأذونات والأجهزة.';
  }
};

// Gestionnaire de validation
const ValidationHelper = {
  /**
   * Valider les données avant soumission
   */
  validateSubmissionData(studentId, textId, audioBlob) {
    const errors = [];
    
    if (!studentId) {
      errors.push('معرف الطالب غير موجود');
    }
    
    if (!textId) {
      errors.push('معرف النص غير موجود');
    }
    
    if (!audioBlob) {
      errors.push('لا يوجد تسجيل صوتي');
    }
    
    if (audioBlob && audioBlob.size === 0) {
      errors.push('التسجيل الصوتي فارغ');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Valider qualité l'audio
   */
  validateAudioQuality(audioBlob) {
    const minSize = 1000; // 1KB minimum
    const maxSize = 10 * 1024 * 1024; // 10MB maximum
    
    if (audioBlob.size < minSize) {
      return {
        isValid: false,
        error: 'التسجيل قصير جداً'
      };
    }
    
    if (audioBlob.size > maxSize) {
      return {
        isValid: false,
        error: 'التسجيل كبير جداً'
      };
    }
    
    return { isValid: true };
  }
};

// Gestionnaire d'événements personnalisés
const EventManager = {
  events: {},

  /**
   * S'abonner à un événement
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },

  /**
   * Déclencher un événement
   */
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
};

// Initialisation de l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  window.readingApp = new ReadingApp();
});

// Gestion des erreurs non capturées
window.addEventListener('error', (event) => {
  console.error('Erreur non capturée:', event.error);
});

// Gestion des promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesse rejetée non gérée:', event.reason);
});