/* Resume page: override terminal with PR-themed neofetch */

(function () {
  const terminalBody = document.getElementById("terminal-body");
  if (!terminalBody) return;

  const LOGO = [
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

  const LINES = [
    { text: "danil@bsu", cls: "t-green", delay: 100 },
    { text: "-------------", cls: "t-green", delay: 100 },
    { text: "OS: медиаспециалист, 2 курс БГУ (btw)", cls: "", delay: 130 },
    { text: "Кафедра: менеджмента, маркетинга и логистики", cls: "", delay: 130 },
    { text: "Роль: копирайтер · SMM · автор проектов", cls: "t-blue", delay: 130 },
    { text: "Кейс: «Хомягочи» — 4-е место, «Зелёный свет»", cls: "t-yellow", delay: 130 },
    { text: "Языки: русский · English B2+ · français", cls: "", delay: 130 },
    { text: "Цель: команда БГУ на «ЯрпИР» и «Лучник»", cls: "t-green", delay: 130 },
    { text: "Uptime: идея → команда → финал → результат", cls: "", delay: 130 },
  ];

  let html =
    '<div><span class="t-green">danil@bsu</span><span class="t-dim">:~$</span> cat resume.txt</div>';
  terminalBody.innerHTML = html;

  const rows = Math.max(LOGO.length, LINES.length);
  let currentRow = 0;

  function nextRow() {
    if (currentRow >= rows) {
      html +=
        '<div><span class="t-green">danil@bsu</span><span class="t-dim">:~$</span> <span class="terminal__cursor"></span></div>';
      terminalBody.innerHTML = html;
      return;
    }
    const logo = LOGO[currentRow] || "";
    const info = LINES[currentRow];
    const logoHtml = logo ? '<span class="t-blue">' + logo + "</span>" : "";
    const infoHtml = info
      ? "<span class='" + info.cls + "'>" + info.text + "</span>"
      : "";
    html += "<div>" + logoHtml + infoHtml + "</div>";
    terminalBody.innerHTML = html;
    currentRow++;
    setTimeout(nextRow, info ? info.delay : 60);
  }

  setTimeout(nextRow, 600);
})();
