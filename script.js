const welcome = document.getElementById("welcome");
const mainContent = document.getElementById("mainContent");
const startBtn = document.getElementById("startBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const letterBtn = document.getElementById("letterBtn");
const envelope = document.getElementById("envelope");
const surpriseBtn = document.getElementById("surpriseBtn");
const videoBox = document.getElementById("videoBox");
const celebrateBtn = document.getElementById("celebrateBtn");

let musicPlaying = false;

// ---------- START WEBSITE ----------
startBtn.addEventListener("click", async () => {
  welcome.style.opacity = "0";
  welcome.style.transition = "opacity .8s ease";

  setTimeout(() => {
    welcome.classList.add("hidden");
    mainContent.classList.remove("hidden");
    musicToggle.classList.remove("hidden");
  }, 800);

  try {
    bgMusic.volume = 0.35;
    await bgMusic.play();
    musicPlaying = true;
    musicToggle.textContent = "🔊";
  } catch (e) {
    musicPlaying = false;
    musicToggle.textContent = "🔇";
  }

  launchConfetti(180);
});

// ---------- MUSIC CONTROL ----------
musicToggle.addEventListener("click", async () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    musicToggle.textContent = "🔇";
  } else {
    try {
      await bgMusic.play();
      musicPlaying = true;
      musicToggle.textContent = "🔊";
    } catch (e) {}
  }
});

// ---------- BIRTHDAY COUNTDOWN ----------
// CHANGE THESE VALUES TO YOUR BHAIYA'S BIRTHDAY
const birthdayMonth = 9; // 1 = January, 12 = December
const birthdayDay = 11;

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  let birthday = new Date(year, birthdayMonth - 1, birthdayDay, 0, 0, 0);

  const isBirthdayToday =
    now.getMonth() === birthdayMonth - 1 &&
    now.getDate() === birthdayDay;

  if (isBirthdayToday) return birthday;

  if (now > birthday) {
    birthday = new Date(year + 1, birthdayMonth - 1, birthdayDay, 0, 0, 0);
  }

  return birthday;
}

function updateCountdown() {
  const now = new Date();
  const countdown = document.getElementById("countdown");
  const birthdayMessage = document.getElementById("birthdayMessage");

  const isBirthdayToday =
    now.getMonth() === birthdayMonth - 1 &&
    now.getDate() === birthdayDay;

  if (isBirthdayToday) {
    countdown.classList.add("hidden");
    birthdayMessage.classList.remove("hidden");
    return;
  }

  countdown.classList.remove("hidden");
  birthdayMessage.classList.add("hidden");

  const target = getNextBirthday();
  const diff = target - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- LETTER ----------
letterBtn.addEventListener("click", () => {
  envelope.classList.toggle("open");
  letterBtn.textContent = envelope.classList.contains("open")
    ? "Close Letter 💌"
    : "Open Letter 💌";
});

// ---------- SURPRISE VIDEO ----------
surpriseBtn.addEventListener("click", () => {
  videoBox.classList.remove("hidden");
  surpriseBtn.classList.add("hidden");

  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    musicToggle.textContent = "🔇";
  }

  videoBox.scrollIntoView({ behavior: "smooth", block: "center" });
  launchConfetti(120);
});

// ---------- FINAL CELEBRATION ----------
celebrateBtn.addEventListener("click", () => {
  launchConfetti(300);
});

// ---------- SIMPLE CONFETTI ----------
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");

let confettiPieces = [];
let animationRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchConfetti(count = 150) {
  const colors = ["#f1c96b", "#ffe6a6", "#ffffff", "#8aa4ff", "#ff8fbd"];

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 7,
      h: 8 + Math.random() * 10,
      speed: 2 + Math.random() * 4,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (-0.08 + Math.random() * 0.16),
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * 2
    });
  }

  if (!animationRunning) {
    animationRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach((p) => {
    p.y += p.speed;
    p.x += Math.sin(p.y * 0.02) * p.sway;
    p.rotation += p.rotationSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 30);

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    animationRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
