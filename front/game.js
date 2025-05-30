class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
        // Charger des assets si besoin
    }

    create() {
        // Créer un formulaire HTML au-dessus du canvas Phaser
        const loginForm = document.createElement('div');
        loginForm.style.position = 'absolute';
        loginForm.style.top = '50px';
        loginForm.style.left = '50%';
        loginForm.style.transform = 'translateX(-50%)';
        loginForm.style.backgroundColor = 'rgba(255,255,255,0.8)';
        loginForm.style.padding = '20px';
        loginForm.style.borderRadius = '8px';
        loginForm.style.textAlign = 'center';
        loginForm.innerHTML = `
            <h2>Connexion Élève</h2>
            <input id="cne" placeholder="CNE" type="text" /><br/><br/>
            <input id="dateNaissance" placeholder="Date de naissance (YYYY-MM-DD)" type="date" /><br/><br/>
            <button id="loginBtn">Se connecter</button>
            <p id="message" style="color:red;"></p>
        `;
        document.body.appendChild(loginForm);

        const btn = document.getElementById('loginBtn');
        const message = document.getElementById('message');

        btn.addEventListener('click', () => {
            const cne = document.getElementById('cne').value.trim();
            const dateNaissance = document.getElementById('dateNaissance').value.trim();

            if (!cne || !dateNaissance) {
                message.textContent = 'Veuillez remplir tous les champs.';
                return;
            }

            fetch('http://127.0.0.1:5000/eleve/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cne: cne,
                    dateNaissance: dateNaissance
                })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Erreur ' + res.status);
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                if (data.message === 'Connexion réussie') {
                    window.location.href = 'texte.html';
                } else if (data.error) {
                    message.textContent = data.error;
                } else {
                    message.textContent = 'Erreur inconnue';
                }
            })
            .catch(err => {
                console.error('Erreur réseau :', err);
                message.textContent = 'Erreur réseau, veuillez réessayer.';
            });
        });
    }
}

// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [LoginScene]
};

const game = new Phaser.Game(config);
