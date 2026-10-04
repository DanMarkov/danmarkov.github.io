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

// header scroll animation
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("header--scroll");
  } else {
    header.classList.remove("header--scroll");
  }
});

// ScrollReveal animations
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    duration: 1000,
    distance: "40px",
    delay: 200,
    reset: false,
    easing: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  });

  sr.reveal(".hero__content");
  sr.reveal(".hero__card", { origin: "right", delay: 350 });

  sr.reveal(
    ".about__card, .about__fact, .skills__group, .project__card, .science__item, .experience__item, .achievements__card, .interests__block, .footer__content",
    {
      interval: 120,
    }
  );
}
