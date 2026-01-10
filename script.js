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
document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     Smooth Scroll (Nav)
  ============================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

document.querySelectorAll(".fade-up, .fade-in").forEach(el => {
  observer.observe(el);
});
      window.scrollTo({
        top: target.offsetTop - 90,
        behavior: "smooth"
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
      document.querySelector(".nav")?.classList.remove("open");
    });
  });

/* ===============================
   SMOOTH NAV SCROLL
================================ */
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
  /* =============================
     Scroll Animation
  ============================= */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.15 });

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
  document.querySelectorAll(".fade-up, .fade-in").forEach(el => observer.observe(el));

    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      header.offsetHeight -
      10;
  /* =============================
     Header Shrink
  ============================= */
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("shrink", window.scrollY > 60);
  });

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  /* =============================
     Mobile Nav Toggle
  ============================= */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

    /* 모바일 메뉴 UX 개선 */
    setTimeout(() => {
      nav.classList.remove("open");
    }, 300);
  toggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
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
  /* =============================
     Copy to Clipboard
  ============================= */
  document.querySelectorAll("[data-copy]").forEach(el => {
    el.addEventListener("click", () => {
      const text = el.dataset.copy;

  /* Active nav */
  let isActiveSet = false;
      navigator.clipboard.writeText(text).then(() => {
        showToast("복사되었습니다");
      });
    });
  });

  sections.forEach(section => {
    const top = section.offsetTop - header.offsetHeight - 20;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");
  /* =============================
     Toast
  ============================= */
  function showToast(message) {
    let toast = document.querySelector(".toast");

    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(
        `.nav a[href="#${id}"]`
      );
      if (activeLink) activeLink.classList.add("active");
      isActiveSet = true;
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
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
    toast.textContent = message;
    toast.classList.add("show");

/* ===============================
   MOBILE MENU TOGGLE
================================ */
menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
