document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     FADE ANIMATION
  =============================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade-up, .fade-in").forEach(el => {
    observer.observe(el);
  });

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
     SMOOTH SCROLL
  =============================== */
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      const y = target.offsetTop - header.offsetHeight - 10;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });

      nav.classList.remove("open");
    });
  });

  /* ===============================
     HEADER SHRINK + NAV ACTIVE
  =============================== */
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    header.classList.toggle("shrink", scrollY > 80);

    let activeSet = false;

    sections.forEach(section => {
      const top = section.offsetTop - header.offsetHeight - 20;
      const bottom = top + section.offsetHeight;
      const id = section.id;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove("active"));
        document.querySelector(`.nav a[href="#${id}"]`)?.classList.add("active");
        activeSet = true;
      }
    });

    if (!activeSet && scrollY < hero.offsetHeight) {
      navLinks.forEach(l => l.classList.remove("active"));
      document.querySelector('.nav a[href="#about"]')?.classList.add("active");
    }
  });

  /* ===============================
     MOBILE MENU
  =============================== */
  menuBtn?.addEventListener("click", () => {
    nav.classList.toggle("open");
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
