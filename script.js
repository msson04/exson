/* ===== FADE-IN / FADE-UP ===== */
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

/* ===== SMOOTH SCROLL ===== */
const header = document.querySelector(".header");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const headerHeight = header.offsetHeight;

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

    nav.classList.remove("open");
  });
});

/* ===== HEADER SHRINK + NAV ACTIVE ===== */
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  /* shrink */
  if (scrollY > 80) header.classList.add("shrink");
  else header.classList.remove("shrink");

  /* active nav */
  sections.forEach(sec => {
    const top = sec.offsetTop - header.offsetHeight - 20;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute("id");

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(a => a.classList.remove("active"));
      const activeLink = document.querySelector(`.nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
});

/* ===== MOBILE MENU ===== */
const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});
