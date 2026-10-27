/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const CANCION = "audio/final.mp3";   // ← AQUÍ EL MP3, ej: "audio/final.mp3"
/* ============================================================ */

const $ = (s) => document.querySelector(s);
const audio = $("#audio");
const btnMusica = $("#musica");

/* --- Pétalos que caen --- */
const contenedor = $("#petalos");
for (let k = 0; k < 14; k++) {
  const p = document.createElement("i");
  p.className = "petalo";
  p.style.setProperty("--x", Math.random() * 100 + "vw");
  p.style.setProperty("--s", (8 + Math.random() * 10) + "px");
  p.style.setProperty("--t", (9 + Math.random() * 8) + "s");
  p.style.setProperty("--dl", (-Math.random() * 14) + "s");
  p.style.setProperty("--dx", (Math.random() * 30 - 15) + "vw");
  contenedor.appendChild(p);
}

/* --- Música --- */
if (CANCION) {
  audio.src = CANCION;
  audio.loop = true;
  btnMusica.hidden = false;

  const actualizar = () => btnMusica.classList.toggle("off", audio.paused);
  audio.addEventListener("play", actualizar);
  audio.addEventListener("pause", actualizar);

  btnMusica.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });

  // Intento de autoplay; si el navegador lo bloquea, arranca con el primer toque
  const arrancar = (e) => {
    if (e && e.target.closest && e.target.closest("#musica")) return;
    audio.play().then(() => {
      window.removeEventListener("pointerdown", arrancar);
      window.removeEventListener("keydown", arrancar);
    }).catch(() => {});
  };
  audio.play().catch(() => {
    actualizar();
    window.addEventListener("pointerdown", arrancar);
    window.addEventListener("keydown", arrancar);
  });
}