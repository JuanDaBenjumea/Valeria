/* ============================================================
   CONFIGURACIÓN: aquí van el MP3 y la portada de cada canción
   ============================================================ */
const canciones = [
  {
    titulo: "Doma",
    artista: "Jósean Log",
    audio:   "audio/1.mp3",  // ← AQUÍ EL MP3, ej: "audio/cancion1.mp3"
    portada: "img/1.jpg"   // ← AQUÍ LA PORTADA, ej: "img/portada1.jpg"
  },
  {
    titulo: "Viento",
    artista: "Caifanes",
    audio:   "audio/2.mp3",  // ← AQUÍ EL MP3, ej: "audio/cancion2.mp3"
    portada: "img/3.jpg"   // ← AQUÍ LA PORTADA, ej: "img/portada2.jpg"
  },
  {
    titulo: "Entra en mi vida",
    artista: "Sin Bandera",
    audio:   "audio/3.mp3",  // ← AQUÍ EL MP3, ej: "audio/cancion3.mp3"
    portada: "img/2.jpg"   // ← AQUÍ LA PORTADA, ej: "img/portada3.jpg"
  },
  {
    titulo: "Más que tu amigo",
    artista: "Marco Antonio Solís",
    audio:   "audio/4.mp3",  // ← AQUÍ EL MP3, ej: "audio/cancion4.mp3"
    portada: "img/4.jpg"   // ← AQUÍ LA PORTADA, ej: "img/portada4.jpg"
  }
];

const DURACION = 30;              // segundos por canción
const PAGINA_FINAL = "final.html"; // a dónde lleva "adelantar" en la canción 4

/* ============================================================ */

const $ = (s) => document.querySelector(s);
const audio  = $("#audio");
const player = $("#player");
const btnPrev = $("#prev"), btnPlay = $("#play"), btnNext = $("#next");
const cover = $("#cover");
const dots = [...document.querySelectorAll(".dots i")];

// Crear las escenas de fondo desde la plantilla
const stage = $(".stage");
const tpl = $("#tpl-scene");
canciones.forEach((_, n) => {
  const s = document.createElement("div");
  s.className = "scene s" + n;
  s.appendChild(tpl.content.cloneNode(true));
  stage.appendChild(s);
});
const scenes = [...document.querySelectorAll(".scene")];

let i = 0;          // canción actual
let t = 0;          // segundos transcurridos en la canción actual
let playing = false;
let last = performance.now();
let lastSec = -1;

const fmt = (s) => {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

function tieneAudio() {
  return !!audio.getAttribute("src");
}

function setPlaying(v) {
  playing = v;
  player.dataset.playing = String(v);
  if (!tieneAudio()) return;
  if (v) {
    audio.play().catch(() => {
      playing = false;
      player.dataset.playing = "false";
    });
  } else {
    audio.pause();
  }
}

function cargar(n) {
  i = n;
  t = 0;
  lastSec = -1;
  const c = canciones[i];

  document.body.dataset.scene = i;
  scenes.forEach((s, k) => s.classList.toggle("active", k === i));
  dots.forEach((d, k) => d.classList.toggle("on", k <= i));

  $("#titulo").textContent = c.titulo;
  $("#artista").textContent = c.artista;

  if (c.portada) { cover.src = c.portada; cover.hidden = false; }
  else { cover.removeAttribute("src"); cover.hidden = true; }

  if (c.audio) { audio.src = c.audio; }
  else { audio.removeAttribute("src"); audio.load(); }

  // Estados de los botones
  btnPrev.disabled = (i === 0);   // canción 1: retroceder inactivo
  btnNext.disabled = false;       // siempre activo (en la 4 va a otra página)
  btnPlay.disabled = false;

  if (playing && tieneAudio()) {
    audio.play().catch(() => setPlaying(false));
  }
}

function siguiente() {
  if (i === canciones.length - 1) {
    window.location.href = PAGINA_FINAL;
  } else {
    cargar(i + 1);
  }
}

function anterior() {
  if (i > 0) cargar(i - 1);
}

btnNext.addEventListener("click", siguiente);
btnPrev.addEventListener("click", anterior);
btnPlay.addEventListener("click", () => setPlaying(!playing));

// Pausar si la pestaña se oculta, para mantener audio y reloj sincronizados
document.addEventListener("visibilitychange", () => {
  if (document.hidden && playing) setPlaying(false);
  last = performance.now();
});

// Reloj principal
function tick(now) {
  const dt = (now - last) / 1000;
  last = now;

  if (playing) {
    t += dt;
    if (t >= DURACION) siguiente();
  }

  $("#fill").style.width = Math.min(100, (t / DURACION) * 100) + "%";
  const sec = Math.floor(t);
  if (sec !== lastSec) {
    lastSec = sec;
    $("#t-act").textContent = fmt(t);
    $("#t-rest").textContent = "-" + fmt(DURACION - t);
  }
  requestAnimationFrame(tick);
}

// Inicio
cargar(0);
if (tieneAudio()) {
  audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
} else {
  setPlaying(true); // sin MP3 corre solo el reloj
}
requestAnimationFrame(tick);