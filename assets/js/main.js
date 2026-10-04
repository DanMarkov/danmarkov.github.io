/* Topbar clock (GNOME style) */
const topbarClock = document.getElementById("topbar-clock");

function updateClockFull() {
  if (!topbarClock) return;
  const now = new Date();
  const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  topbarClock.textContent =
    days[now.getDay()] + " " + hh + ":" + mm;
}

updateClockFull();
setInterval(updateClockFull, 15000);

/* Dark / light theme toggle */
const themeToggle = document.getElementById("theme-toggle");

function setThemeIcon() {
  if (!themeToggle) return;
  const isDark = document.body.classList.contains("dark");
  themeToggle.innerHTML = isDark
    ? '<i class="ri-sun-line"></i>'
    : '<i class="ri-moon-line"></i>';
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  setThemeIcon();
  showToast(
    document.body.classList.contains("dark")
      ? '<span class="t-blue">тема:</span> тёмная (GNOME dark)'
      : '<span class="t-blue">тема:</span> светлая (adwaita)'
  );
});
setThemeIcon();

/* Toast notifications */
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(html) {
  if (!toast) return;
  toast.innerHTML = html;
  toast.classList.add("toast--visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 3200);
}

/* Draggable windows */
document.querySelectorAll(".window--draggable").forEach((win) => {
  const titlebar = win.querySelector(".window__titlebar");
  if (!titlebar) return;

  let startX = 0,
    startY = 0,
    startLeft = 0,
    startTop = 0,
    dragging = false;

  function bringToFront() {
    document
      .querySelectorAll(".window--draggable")
      .forEach((w) => (w.style.zIndex = ""));
    win.style.zIndex = 20;
  }

  function onDown(e) {
    if (e.target.closest(".traffic-light")) return;
    dragging = true;
    win.classList.add("window--dragging");
    bringToFront();
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;
    const rect = win.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    win.style.left = startLeft + "px";
    win.style.top = startTop + "px";
    win.style.width = rect.width + "px";
    win.style.position = "fixed";
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const point = e.touches ? e.touches[0] : e;
    let dx = point.clientX - startX;
    let dy = point.clientY - startY;
    const rect = win.getBoundingClientRect();
    dx = Math.min(Math.max(dx, 8 - startLeft), window.innerWidth - 8 - rect.width - startLeft);
    dy = Math.min(Math.max(dy, 52 - startTop), window.innerHeight - 52 - rect.height - startTop);
    win.style.left = startLeft + dx + "px";
    win.style.top = startTop + dy + "px";
    if (e.cancelable) e.preventDefault();
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    win.classList.remove("window--dragging");
  }

  titlebar.addEventListener("mousedown", onDown);
  titlebar.addEventListener("touchstart", onDown, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("mouseup", onUp);
  document.addEventListener("touchend", onUp);
});

/* Traffic lights: minimize / close / maximize */
document.querySelectorAll(".traffic-light").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const win = btn.closest(".window");
    if (!win) return;
    const action = btn.dataset.action;

    if (action === "close") {
      win.style.transition = "opacity 0.35s, transform 0.35s";
      win.style.opacity = "0";
      win.style.transform = "scale(0.9)";
      showToast(
        '<span class="t-green">✔</span> окно закрыто — но страница-то живая'
      );
      setTimeout(() => {
        win.style.display = "none";
        win.style.transition = "";
        win.style.opacity = "";
        win.style.transform = "";
      }, 380);
    }

    if (action === "min") {
      win.style.transition = "transform 0.3s, opacity 0.3s";
      win.style.transform = "scale(0.05) translateY(60vh)";
      win.style.opacity = "0";
      showToast('<span class="t-yellow">⌘</span> окно свернуто… на самом деле нет');
      setTimeout(() => {
        win.style.transform = "";
        win.style.opacity = "1";
        setTimeout(() => (win.style.transition = ""), 320);
      }, 900);
    }

    if (action === "max") {
      win.classList.toggle("window--maximized");
      if (win.classList.contains("window--maximized")) {
        win.style.position = "fixed";
        win.style.left = "1rem";
        win.style.top = "5.4rem";
        win.style.width = "calc(100vw - 2rem)";
        win.style.zIndex = 20;
      } else {
        win.style.position = "";
        win.style.left = "";
        win.style.top = "";
        win.style.width = "";
        win.style.zIndex = "";
      }
    }
  });
});

/* Dock navigation */
const dockItems = document.querySelectorAll(".dock__item[data-section]");

dockItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = document.getElementById(item.dataset.section);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      showToast(
        '<span class="t-blue">→</span> ' + item.getAttribute("title")
      );
    }
  });
});

/* Arch logo toast */
const archLogo = document.getElementById("arch-logo");

if (archLogo) {
  archLogo.addEventListener("click", () => {
    showToast("I use Arch, <span class='t-green'>btw</span> 🐧");
  });
}

/* Interactive terminal with neofetch */
const terminalBody = document.getElementById("terminal-body");

const ARCH_LOGO = [
  "                  -`                 ",
  "                 .o+`               ",
  "                `ooo/               ",
  "               `+oooo:              ",
  "              `+oooooo:             ",
  "              -+oooooo+:            ",
  "            `/:-:++oooo+:           ",
  "           `/++++/+++++++:          ",
  "          `/++++############:        ",
  "         ./++++++++++++++++-`        ",
  "        ./o++++++++++++++++++/`      ",
  "       .o+ooooooooooooooooo-`       ",
  "      `++o-.``oooooooooooo-`        ",
  "     ./:  .--++++++++++++++-.`      ",
  "    `+oooommmmmmmmmmmmmmmmmmmmm-`   ",
  "  ./ooommmmmmmmmmmmmmmmmmmmmmmm`-   ",
  " ./oooooooooooooooooooooooooooo-`  ",
];

const NEOFETCH_LINES = [
  { text: "danil@irkutsk", cls: "t-green", delay: 100 },
  { text: "----------------", cls: "t-green", delay: 100 },
  { text: "OS: Arch Linux x86_64 (btw)", cls: "", delay: 120 },
  { text: "Host: Даниил Марков — БГУ, Иркутск", cls: "", delay: 120 },
  { text: "Kernel: frontend-junior 40+.repo", cls: "", delay: 120 },
  { text: "Shell: человек-оркестр", cls: "", delay: 120 },
  { text: "DE: macOS × GNOME (лучшее из двух)", cls: "t-blue", delay: 120 },
  { text: "Uptime: с первого «Hello, World»", cls: "", delay: 120 },
  { text: "Packages: JS, HTML, CSS, Git, Linux", cls: "", delay: 120 },
  { text: "Resolution: экология × искусство", cls: "", delay: 120 },
  { text: "Memory: БГУ «Менеджмент» + сцена", cls: "t-yellow", delay: 120 },
];

function typeTerminal() {
  if (!terminalBody) return;
  let logoRow = 0;
  let infoRow = 0;
  const rows = Math.max(ARCH_LOGO.length, NEOFETCH_LINES.length + 2);

  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push({ logo: ARCH_LOGO[i] || "", info: NEOFETCH_LINES[i] || null });
  }

  let html = "";
  let currentRow = 0;

  function nextRow() {
    if (currentRow >= grid.length) {
      html +=
        '<div><span class="t-green">danil@irkutsk</span><span class="t-dim">:~$</span> <span class="terminal__cursor"></span></div>';
      terminalBody.innerHTML = html;
      return;
    }
    const row = grid[currentRow];
    const logoHtml = row.logo
      ? '<span class="t-blue">' + row.logo + "</span>"
      : "";
    let infoHtml = "";
    if (row.info) {
      infoHtml = "<span class='" + row.info.cls + "'>" + row.info.text + "</span>";
    }
    html += "<div>" + logoHtml + infoHtml + "</div>";
    terminalBody.innerHTML = html;
    currentRow++;
    setTimeout(nextRow, row.info ? row.info.delay : 60);
  }

  const intro = "$ neofetch\n";
  html = '<div><span class="t-green">danil@irkutsk</span><span class="t-dim">:~$</span> neofetch</div>';
  terminalBody.innerHTML = html;
  setTimeout(nextRow, 500);
}

const terminalWindow = document.getElementById("terminal-window");

if (terminalWindow) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeTerminal();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(terminalWindow);
}

/* Konami-style easter egg: печатаем "arch" */
let typedBuffer = "";

document.addEventListener("keydown", (e) => {
  if (!e.key || e.key.length !== 1) return;
  typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-4);
  if (typedBuffer === "arch") {
    showToast("I use Arch, <span class='t-green'>btw</span> 🐧 — ты нашёл пасхалку!");
    typedBuffer = "";
  }
});

/* ScrollReveal animations */
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    duration: 800,
    distance: "24px",
    delay: 100,
    reset: false,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });

  sr.reveal("#hero-window", { origin: "left" });
  sr.reveal("#photo-window, #terminal-window", { origin: "right", interval: 150 });

  sr.reveal(
    ".about__card, .fact, .skills__group, .project__card, .science__item, .experience__item, .achievements__card, .interests__block, .footer__grid > div",
    {
      interval: 100,
    }
  );
}
