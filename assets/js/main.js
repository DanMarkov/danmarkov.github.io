const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navItem = document.querySelectorAll(".nav__item"),
  header = document.getElementById("header");

// open and close menu
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

// close the menu when the user clicks the nav links
navItem.forEach((item) => {
  item.addEventListener("click", () => {
    if (navMenu.classList.contains("nav__menu--open")) {
      navMenu.classList.remove("nav__menu--open");
    }
    changeIcon();
  });
});

// Change nav toggle icon
function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
  } else {
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }
}

// taskbar clock
const footerClock = document.getElementById("footer-clock");

function updateClock() {
  if (!footerClock) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  footerClock.innerHTML =
    '<i class="ri-time-line"></i> ' + hh + ":" + mm;
}

updateClock();
setInterval(updateClock, 30000);

// header scroll animation
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

// XP startup sound (synthesized fanfare, WebAudio)
function playStartupSound() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();

  const notes = [
    { freq: 293.66, start: 0, dur: 0.9, type: "triangle", gain: 0.16 },
    { freq: 440.0, start: 0.35, dur: 0.9, type: "sine", gain: 0.14 },
    { freq: 587.33, start: 0.6, dur: 1.0, type: "triangle", gain: 0.12 },
    { freq: 880.0, start: 0.9, dur: 1.4, type: "sine", gain: 0.1 },
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = n.type;
    osc.frequency.value = n.freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + n.start);
    gain.gain.linearRampToValueAtTime(n.gain, ctx.currentTime + n.start + 0.08);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + n.start + n.dur
    );
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + n.start);
    osc.stop(ctx.currentTime + n.start + n.dur + 0.1);
  });
}

// browser autoplay policy: play after the first user interaction
let startupPlayed = false;
["pointerdown", "keydown", "touchstart"].forEach((evt) => {
  document.addEventListener(evt, function playOnce() {
    if (startupPlayed) return;
    startupPlayed = true;
    playStartupSound();
    ["pointerdown", "keydown", "touchstart"].forEach((e) =>
      document.removeEventListener(e, playOnce)
    );
  });
});

// draggable XP windows
document.querySelectorAll(".xp-window--draggable").forEach((win) => {
  const titlebar = win.querySelector(".xp-titlebar");
  if (!titlebar) return;

  win.style.position = "relative";
  let startX = 0,
    startY = 0,
    startLeft = 0,
    startTop = 0,
    dragging = false;

  function bringToFront() {
    document
      .querySelectorAll(".xp-window--draggable")
      .forEach((w) => (w.style.zIndex = ""));
    win.style.zIndex = 5;
  }

  function onDown(e) {
    if (e.target.closest(".xp-titlebar-btn")) return;
    dragging = true;
    win.classList.add("xp-window--dragging");
    bringToFront();
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;
    const rect = win.getBoundingClientRect();
    const parentRect = win.parentElement.getBoundingClientRect();
    startLeft = rect.left - parentRect.left;
    startTop = rect.top - parentRect.top;
    win.style.left = startLeft + "px";
    win.style.top = startTop + "px";
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const point = e.touches ? e.touches[0] : e;
    let dx = point.clientX - startX;
    let dy = point.clientY - startY;
    const parent = win.parentElement.getBoundingClientRect();
    const rect = win.getBoundingClientRect();
    const maxLeft = Math.max(parent.width - rect.width, rect.width * -0.5);
    const maxTop = Math.max(parent.height - rect.height, rect.height * -0.5);
    dx = Math.min(Math.max(dx, -startLeft - rect.width * 0.5), maxLeft - startLeft);
    dy = Math.min(Math.max(dy, -startTop - rect.height * 0.5), maxTop - startTop);
    win.style.left = startLeft + dx + "px";
    win.style.top = startTop + dy + "px";
    if (e.cancelable) e.preventDefault();
  }

  function onUp() {
    dragging = false;
    win.classList.remove("xp-window--dragging");
  }

  titlebar.addEventListener("mousedown", onDown);
  titlebar.addEventListener("touchstart", onDown, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("mouseup", onUp);
  document.addEventListener("touchend", onUp);
});

// BSOD easter egg on close buttons
const bsod = document.getElementById("bsod");
const bsodProgress = document.getElementById("bsod-progress");
let bsodTimer = null;

document.querySelectorAll(".xp-titlebar-btn--close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!bsod) return;
    bsod.classList.add("bsod--visible");
    document.body.style.overflow = "hidden";

    let progress = 0;
    if (bsodTimer) clearInterval(bsodTimer);
    bsodTimer = setInterval(() => {
      progress = Math.min(progress + Math.ceil(Math.random() * 7), 100);
      if (bsodProgress) {
        bsodProgress.textContent = "Выполнено: " + progress + "%";
      }
      if (progress >= 100) clearInterval(bsodTimer);
    }, 350);
  });
});

if (bsod) {
  bsod.addEventListener("click", () => {
    bsod.classList.remove("bsod--visible");
    document.body.style.overflow = "";
    if (bsodTimer) clearInterval(bsodTimer);
    if (bsodProgress) bsodProgress.textContent = "Выполнено: 0%";
  });
}

// ScrollReveal animations
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    duration: 900,
    distance: "30px",
    delay: 150,
    reset: false,
    easing: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  });

  sr.reveal(".hero__content-window", { origin: "left" });
  sr.reveal(".hero__card", { origin: "right", delay: 250 });

  sr.reveal(
    ".about__card, .about__fact, .skills__group, .project__card, .science__item, .experience__item, .achievements__card, .interests__block, .footer__content",
    {
      interval: 120,
    }
  );
}
