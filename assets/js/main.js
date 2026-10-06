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

/* Resizable windows (bottom-right corner handle) */
document.querySelectorAll(".window__resize").forEach((handle) => {
  const win = handle.closest(".window");
  if (!win) return;
  const MIN_W = 280;
  const MIN_H = 180;
  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;

  function onDown(e) {
    resizing = true;
    win.classList.add("window--resizing");
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;
    const rect = win.getBoundingClientRect();
    startW = rect.width;
    startH = rect.height;
    win.style.width = startW + "px";
    e.preventDefault();
  }

  function onMove(e) {
    if (!resizing) return;
    const point = e.touches ? e.touches[0] : e;
    const maxW = Math.max(MIN_W, window.innerWidth - 16);
    const maxH = Math.max(MIN_H, window.innerHeight - 60);
    const w = Math.min(Math.max(startW + (point.clientX - startX), MIN_W), maxW);
    const h = Math.min(Math.max(startH + (point.clientY - startY), MIN_H), maxH);
    win.style.width = w + "px";
    win.style.height = h + "px";
    if (e.cancelable) e.preventDefault();
  }

  function onUp() {
    if (!resizing) return;
    resizing = false;
    win.classList.remove("window--resizing");
  }

  handle.addEventListener("mousedown", onDown);
  handle.addEventListener("touchstart", onDown, { passive: false });
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

const TERMINAL_USER = "Daniil@bgu";
const NEOFETCH_LINES = [
  { text: "Daniil@bgu", cls: "t-green", delay: 100 },
  { text: "-----------", cls: "t-green", delay: 100 },
  { text: "OS: Arch Linux x86_64 (btw)", cls: "", delay: 130 },
  { text: "Host: БГУ, Иркутск — менеджмент", cls: "", delay: 130 },
  { text: "Kernel: идея → команда → результат", cls: "t-blue", delay: 130 },
  { text: "Uptime: 4-е место «Зелёный свет», Москва 2026", cls: "t-yellow", delay: 130 },
  { text: "Packages: 40+ repo · копирайтинг · SMM", cls: "", delay: 130 },
  { text: "Shell: сцена · импровизация · презентации", cls: "", delay: 130 },
  { text: "Languages: русский · English B2+ · français", cls: "", delay: 130 },
  { text: "Цель: команда БГУ на «ЯрпИР» и «Лучник»", cls: "t-green", delay: 130 },
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
        '<div class="terminal__input-line"><span class="t-green">' + TERMINAL_USER + '</span><span class="t-dim">:~$</span> <span class="terminal__input" id="terminal-input" contenteditable="true" spellcheck="false"></span><span class="terminal__cursor"></span></div>';
      terminalBody.innerHTML = html;
      initTerminalShell();
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
  html = '<div><span class="t-green">' + TERMINAL_USER + '</span><span class="t-dim">:~$</span> cat resume.txt</div>';
  terminalBody.innerHTML = html;
  setTimeout(nextRow, 500);
}

/* Interactive terminal shell */
function initTerminalShell() {
  const input = document.getElementById("terminal-input");
  if (!input || !terminalBody) return;
  const history = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () =>
      "доступные команды: <span class='t-green'>help</span>, <span class='t-green'>whoami</span>, <span class='t-green'>neofetch</span>, <span class='t-green'>ls</span>, <span class='t-green'>cat</span>, <span class='t-green'>uname</span>, <span class='t-green'>uptime</span>, <span class='t-green'>echo</span>, <span class='t-green'>sudo</span>, <span class='t-green'>clear</span>",
    whoami: () => "Daniil Markov — копирайтер · SMM · автор проектов · человек сцены",
    neofetch: () => {
      setTimeout(typeTerminal, 50);
      return "";
    },
    ls: () =>
      "resume.txt  projects/  gachapon.space/  homyagochi/  олимпиады/  сцена/",
    cat: (args) => {
      if (args[0] === "resume.txt")
        return "Даниил Марков, БГУ. Запускаю проекты, пишу тексты, выхожу на сцену. 40+ репозиториев, WooCommerce-магазин, «Хомягочи» — 4-е место на «Зелёном свете».";
      if (args[0] === "homyagochi.txt")
        return "«Хомягочи» — интерактивный тамагочи для цифровой грамотности. Автор и руководитель. 4-е место, «Зелёный свет», Москва 2026.";
      if (!args[0]) return "cat: укажите файл, например: cat resume.txt";
      return "cat: «" + args[0] + "»: нет такого файла";
    },
    uname: () => "Arch Linux x86_64 — идея без команды это just идея, btw",
    uptime: () =>
      "идея → команда → финал → результат. 4-е место «Зелёный свет», скоро — второй заход, спокойнее и сильнее",
    echo: (args) => args.join(" ") || "",
    sudo: (args) =>
      args.length
        ? "Даниил не в секции sudoers. Об инциденте будет доложено. 😉"
        : "usage: sudo <команда>",
    clear: () => {
      terminalBody.innerHTML = "";
      newPrompt();
      return null;
    },
  };

  function newPrompt() {
    const line = document.createElement("div");
    line.className = "terminal__input-line";
    line.innerHTML =
      '<span class="t-green">' + TERMINAL_USER + '</span><span class="t-dim">:~$</span> <span class="terminal__input" id="terminal-input" contenteditable="true" spellcheck="false"></span><span class="terminal__cursor"></span>';
    terminalBody.appendChild(line);
    const newInput = line.querySelector("#terminal-input");
    bindInput(newInput);
    newInput.focus();
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function print(html) {
    const out = document.createElement("div");
    out.innerHTML = html || "&nbsp;";
    terminalBody.insertBefore(out, inputLine());
  }

  function inputLine() {
    return terminalBody.querySelector(".terminal__input-line:last-child");
  }

  function runCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const handler = COMMANDS[cmd];
    if (!handler) {
      print("bash: «" + cmd + "»: команда не найдена. Введите <span class='t-green'>help</span>");
      return;
    }
    const result = handler(args);
    if (result) print(result);
  }

  function bindInput(inp) {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = inp.textContent;
        const promptLine = inp.parentElement;
        promptLine.classList.remove("terminal__input-line");
        inp.removeAttribute("contenteditable");
        inp.removeAttribute("id");
        const echo = document.createElement("span");
        echo.textContent = " " + value;
        promptLine.appendChild(echo);
        inp.remove();
        promptLine.querySelector(".terminal__cursor")?.remove();
        if (value.trim()) {
          history.unshift(value);
          runCommand(value);
        }
        newPrompt();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          inp.textContent = history[historyIndex];
        }
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          inp.textContent = history[historyIndex];
        } else {
          historyIndex = -1;
          inp.textContent = "";
        }
      }
    });
    inp.addEventListener("click", () => inp.focus());
  }

  bindInput(input);
  terminalBody.addEventListener("click", () => {
    const cur = document.getElementById("terminal-input");
    if (cur) cur.focus();
  });
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
