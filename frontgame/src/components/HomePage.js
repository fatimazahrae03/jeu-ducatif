import React, { useEffect, useRef, useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa'; // From Font Awesome

const HomePage = ({ onRoleSelect }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [hoveredRole, setHoveredRole] = useState(null);

  const roles = [
    {
      id: 'eleve',
      title: 'Élève',
      icon: <FaUserGraduate />, // Replaced emoji with FaUserGraduate icon component
      description: 'Explorez vos cours et relevez des défis passionnants',
      bgColor: '#667eea',
      borderColor: '#667eea',
      textColor: '#667eea',
      gradientFrom: '#667eea',
      gradientTo: '#764ba2'
    },
    {
      id: 'prof',
      title: 'Professeur',
      icon: <FaChalkboardTeacher />, // Replaced emoji with FaChalkboardTeacher icon component
      description: 'Créez et gérez vos contenus pédagogiques',
      bgColor: '#f093fb',
      borderColor: '#f093fb',
      textColor: '#f093fb',
      gradientFrom: '#f093fb',
      gradientTo: '#f5576c'
    },
    {
      id: 'admin',
      title: 'Administrateur',
      icon: <FaUserShield />, // Replaced emoji with FaUserShield icon component
      description: 'Contrôlez et optimisez votre plateforme',
      bgColor: '#4facfe',
      borderColor: '#4facfe',
      textColor: '#4facfe',
      gradientFrom: '#4facfe',
      gradientTo: '#00f2fe'
    }
  ];


  useEffect(() => {
    // Configuration Phaser pour les effets de fond
    const initPhaser = async () => {
      if (typeof window !== 'undefined' && gameRef.current && !phaserGameRef.current) {
        // Simulation d'un import Phaser (vous devrez ajouter Phaser via CDN)
        const gameConfig = {
          type: 'WEBGL', // Phaser.WEBGL
          width: window.innerWidth,
          height: window.innerHeight,
          parent: gameRef.current,
          transparent: true,
          scene: {
            preload: preload,
            create: create,
            update: update
          },
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { y: 0 },
              debug: false
            }
          }
        };

        // Création du jeu Phaser (nécessite Phaser.js)
        // phaserGameRef.current = new Phaser.Game(gameConfig);
        
        // Simulation des particules avec Canvas natif pour la démo
        createCanvasParticles();
      }
    };

    initPhaser();

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Fonctions Phaser simulées
  function preload() {
    // Ici vous chargeriez vos assets
    // this.load.image('particle', 'assets/particle.png');
  }

  function create() {
    // Création des particules et effets
    // const particles = this.add.particles('particle');
    // const emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 0.5, end: 0 },
    //   blendMode: 'ADD'
    // });
  }

  function update() {
    // Logique de mise à jour
  }

  // Simulation de particules avec Canvas (en attendant Phaser)
  const createCanvasParticles = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    if (gameRef.current) {
      gameRef.current.appendChild(canvas);
    }

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  return (
    <>
      {/* Arrière-plan Phaser */}
      <div 
        ref={gameRef}
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: 0 }}
      ></div>

      {/* Contenu principal avec Bootstrap */}
      <div className="min-vh-100 d-flex flex-column position-relative" style={{ zIndex: 2 }}>
        {/* Arrière-plan avec gradient Bootstrap */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
            opacity: 0.9
          }}
        ></div>
        
        <div className="container-fluid flex-grow-1 d-flex flex-column justify-content-center align-items-center position-relative p-4">
          {/* En-tête animé */}
          <div className="text-center mb-5 animate__animated animate__fadeInDown">
            <h1 className="display-1 fw-bold text-white mb-4 position-relative">
              <span style={{ color: '#667eea' }}>Bien</span>
              <span style={{ color: '#f093fb' }}>ven</span>
              <span style={{ color: '#4facfe' }}>ue</span>
              <div className="position-absolute top-100 start-50 translate-middle-x mt-2">
                <div style={{
                  width: '100px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea, #f093fb, #4facfe)',
                  borderRadius: '2px'
                }}></div>
              </div>
            </h1>
            <p className="lead text-light fs-3 animate__animated animate__fadeInUp animate__delay-1s">
              Choisissez votre profil et commencez l'aventure
            </p>
          </div>

          {/* Cartes de rôles avec Bootstrap */}
          <div className="row g-4 w-100 justify-content-center" style={{ maxWidth: '1200px' }}>
            {roles.map((role, index) => (
              <div 
                key={role.id} 
                className="col-12 col-md-6 col-lg-4 animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div 
                  className={`card h-100 border-3 shadow-lg position-relative overflow-hidden`}
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    borderColor: role.borderColor
                  }}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  onClick={() => onRoleSelect(role.id)}
                >
                  {/* Effet de survol */}
                  <div 
                    className={`position-absolute top-0 start-0 w-100 h-100 opacity-10 transition-opacity`}
                    style={{ 
                      backgroundColor: role.bgColor,
                      opacity: hoveredRole === role.id ? 0.2 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  ></div>

                  <div className="card-body text-center p-4 position-relative">
                    {/* Icône avec animation */}
                    <div 
                      className="mb-4"
                      style={{
                        fontSize: '4rem',
                        transform: hoveredRole === role.id ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {role.icon}
                    </div>

                    {/* Titre */}
                    <h3 className={`card-title h2 fw-bold mb-3`} style={{ color: role.textColor }}>
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="card-text text-muted fs-5 mb-4">
                      {role.description}
                    </p>

                    {/* Bouton d'action */}
                    <button 
                      className={`btn btn-lg w-100 fw-semibold text-white shadow-sm position-relative overflow-hidden`}
                      style={{
                        background: `linear-gradient(135deg, ${role.gradientFrom}, ${role.gradientTo})`,
                        border: 'none',
                        transform: hoveredRole === role.id ? 'translateY(-2px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        Commencer
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                      </span>
                      
                      {/* Effet de brillance */}
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-0"
                        style={{
                          opacity: hoveredRole === role.id ? 0.1 : 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      ></div>
                    </button>
                  </div>

                  {/* Badges décoratifs */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <div 
                      className={`badge opacity-75`}
                      style={{ backgroundColor: role.bgColor, color: 'white' }}
                    >
                      {role.id === 'eleve' ? 'Apprendre' : 
                       role.id === 'prof' ? 'Enseigner' : 'Gérer'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer avec stats de jeu */}
          <div className="mt-5 text-center">
            <div className="row g-3 justify-content-center">
              <div className="col-auto">
                <div 
                  className="badge fs-6 p-3"
                  style={{ backgroundColor: 'rgba(102, 126, 234, 0.2)', color: '#667eea' }}
                >
                  <i className="bi bi-people me-2"></i>
                  1000+ Joueurs
                </div>
              </div>
              <div className="col-auto">
                <div 
                  className="badge fs-6 p-3"
                  style={{ backgroundColor: 'rgba(240, 147, 251, 0.2)', color: '#f093fb' }}
                >
                  <i className="bi bi-trophy me-2"></i>
                  500+ Défis
                </div>
              </div>
              <div className="col-auto">
                <div 
                  className="badge fs-6 p-3"
                  style={{ backgroundColor: 'rgba(79, 172, 254, 0.2)', color: '#4facfe' }}
                >
                  <i className="bi bi-star me-2"></i>
                  100% Gratuit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
        
        .card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 1rem 2rem rgba(0,0,0,0.2) !important;
        }
        
        .btn:hover {
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
        }
        
        .animate__delay-1s {
          animation-delay: 1s;
        }
        
        @media (max-width: 768px) {
          .display-1 {
            font-size: 3rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;