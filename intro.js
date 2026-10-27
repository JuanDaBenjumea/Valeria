/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const CANCION  = "audio/intro.mp3";            // ← AQUÍ EL MP3, ej: "audio/intro.mp3"
const SEGUNDOS = 30;            // cuánto suena antes de saltar solo
const DESTINO  = "wrapped.html";
const VELOCIDAD = 55;           // ms por letra (mensaje de ~15 s)

const MENSAJE =
  "Explicarte qué pasó por mi cabeza cuando te vi por primera vez, por qué me pareces tan linda, " +
  "y responder esas preguntas que quizás te estés haciendo, siento que se queda corto para expresar la " +
  "química que despertaste en mí, por eso quiero contártelo a través de 4 canciones " +
  "que se quedaron dando vueltas en mi cabeza desde aquella primera cita contigo";
/* ============================================================ */

const $ = (s) => document.querySelector(s);
const audio = $("#audio");

/* --- Mensaje que se va generando --- */
const typed = $("#typed");
const rest  = $("#rest");
const msg   = $(".msg");
let n = 0;
rest.textContent = MENSAJE;

const escritura = setInterval(() => {
  n++;
  typed.textContent = MENSAJE.slice(0, n);
  rest.textContent  = MENSAJE.slice(n);
  if (n >= MENSAJE.length) {
    clearInterval(escritura);
    msg.classList.add("fin");
  }
}, VELOCIDAD);

/* --- Canción + salto automático a los 40 s --- */
let cuentaIniciada = false;
function iniciarCuenta() {
  if (cuentaIniciada) return;
  cuentaIniciada = true;
  setTimeout(() => { window.location.href = DESTINO; }, SEGUNDOS * 1000);
}

if (CANCION) {
  audio.src = CANCION;
  audio.play().then(iniciarCuenta).catch(() => {
    // El navegador bloqueó el autoplay: arranca con el primer toque o tecla
    const arrancar = () => audio.play().then(iniciarCuenta).catch(() => {});
    window.addEventListener("pointerdown", arrancar, { once: true });
    window.addEventListener("keydown", arrancar, { once: true });
  });
} else {
  iniciarCuenta(); // sin MP3 configurado, los 40 s corren igual
}