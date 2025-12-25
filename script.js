/* ===============================
   FADE-IN / FADE-UP ANIMATION
================================ */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.25,
    rootMargin: "0px 0px -60px 0px"
  }
);

document.querySelectorAll(".fade-up, .fade-in").forEach(el => {
  observer.observe(el);
});

/* ===============================
   BASIC ELEMENTS
================================ */
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = document.querySelectorAll("section");
const hero = document.querySelector(".hero");

/* ===============================
   SMOOTH NAV SCROLL
================================ */
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      header.offsetHeight -
      10;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    /* 모바일 메뉴 UX 개선 */
    setTimeout(() => {
      nav.classList.remove("open");
    }, 300);
  });
});

/* ===============================
   HEADER SHRINK + NAV ACTIVE
================================ */
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  /* Header shrink */
  if (scrollY > 80) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }

  /* Active nav */
  let isActiveSet = false;

  sections.forEach(section => {
    const top = section.offsetTop - header.offsetHeight - 20;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(
        `.nav a[href="#${id}"]`
      );
      if (activeLink) activeLink.classList.add("active");
      isActiveSet = true;
    }
  });

  /* Hero 영역 기본 active 처리 */
  if (!isActiveSet && scrollY < hero.offsetHeight) {
    navLinks.forEach(link => link.classList.remove("active"));
    document
      .querySelector('.nav a[href="#about"]')
      ?.classList.add("active");
  }
});

/* ===============================
   MOBILE MENU TOGGLE
================================ */
menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});
