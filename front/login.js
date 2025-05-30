async function login() {
  const cne = document.getElementById('cne').value.trim();
  const dateNaissance = document.getElementById('dateNaissance').value;
  const message = document.getElementById('message');

  try {
    const res = await fetch('http://127.0.0.1:5000/eleve/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cne, dateNaissance }),
    });

    console.log("[DEBUG] HTTP Status:", res.status);
    console.log("[DEBUG] Response Headers:", [...res.headers.entries()]);
    const raw = await res.text();
    console.log("[DEBUG] Raw Text Response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("[DEBUG] JSON parse error:", err);
      message.style.color = 'red';
      message.textContent = 'Réponse invalide du serveur';
      return;
    }

    console.log("[DEBUG] Parsed JSON:", data);

    if (res.ok) {
      message.style.color = 'green';
      message.textContent = 'Connexion réussie!';
      localStorage.setItem('eleve', JSON.stringify(data.eleve));
      setTimeout(() => window.location.href = 'texte.html', 1000);
    } else {
      message.style.color = 'red';
      message.textContent = data.error || 'Erreur inconnue';
    }
  } catch (err) {
    console.error("[DEBUG] FETCH ERROR:", err);
    message.style.color = 'red';
    message.textContent = 'Erreur réseau ou serveur';
  }
}




// Simple Three.js animation (sphère pulsante)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg') });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const geometry = new THREE.SphereGeometry(1.5, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x6699ff, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
