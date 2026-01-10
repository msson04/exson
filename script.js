document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     BASIC ELEMENTS
  =============================== */
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = document.querySelectorAll("section");
  const hero = document.querySelector(".hero");

  /* ===============================
     FADE-IN / FADE-UP ANIMATION
  =============================== */
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.15 });

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".fade-in, .fade-up")
      .forEach(el => el.classList.add("show"));
  }

  document.querySelectorAll(".fade-in, .fade-up").forEach(el => {
    fadeObserver.observe(el);
  });

  /* ===============================
     SMOOTH SCROLL (NAV)
  =============================== */
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

      // 모바일 메뉴 닫기
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ===============================
     HEADER SHRINK + NAV ACTIVE
  =============================== */
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    // Header shrink
    header.classList.toggle("shrink", scrollY > 80);

    // Active nav
    let activeSet = false;

    sections.forEach(section => {
      const top = section.offsetTop - header.offsetHeight - 20;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove("active"));
        document
          .querySelector(`.nav a[href="#${id}"]`)
          ?.classList.add("active");
        activeSet = true;
      }
    });

    // Hero 영역 기본 active
    if (!activeSet && hero && scrollY < hero.offsetHeight) {
      navLinks.forEach(l => l.classList.remove("active"));
      document
        .querySelector('.nav a[href="#about"]')
        ?.classList.add("active");
    }
  });

  /* ===============================
     MOBILE MENU TOGGLE
  =============================== */
  menuBtn?.addEventListener("click", e => {
    e.stopPropagation();
    nav.classList.toggle("open");

    // 배경 스크롤 방지
    document.body.style.overflow =
      nav.classList.contains("open") ? "hidden" : "";
  });

  // 메뉴 밖 클릭 시 닫기
  document.addEventListener("click", e => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  /* ===============================
     COPY TO CLIPBOARD + TOAST
  =============================== */
  document.querySelectorAll("[data-copy]").forEach(el => {
    el.addEventListener("click", () => {
      navigator.clipboard.writeText(el.dataset.copy);
      showToast("복사되었습니다");
    });
  });

  function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

});

