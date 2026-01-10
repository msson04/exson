document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav a");
  const fadeEls = document.querySelectorAll(".fade-up, .fade-in");
  const copyTargets = document.querySelectorAll("[data-copy]");

  /* ===============================
     HEADER SHRINK ON SCROLL
  =============================== */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("shrink");
    } else {
      header.classList.remove("shrink");
    }
  });

  /* ===============================
     MOBILE NAV TOGGLE
  =============================== */
  menuToggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
    document.body.style.overflow = nav.classList.contains("open")
      ? "hidden"
      : "";
  });

  /* ===============================
     NAV LINK CLICK → ALWAYS CLOSE
     (페이지 이동 포함)
  =============================== */
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ===============================
     FORCE NAV CLOSED ON PAGE LOAD
     (모바일 Safari 핵심)
  =============================== */
  nav.classList.remove("open");
  document.body.style.overflow = "";

  /* ===============================
     RESIZE SAFETY (ROTATION 대응)
  =============================== */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  /* ===============================
     SCROLL FADE ANIMATION
  =============================== */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeEls.forEach(el => observer.observe(el));

  /* ===============================
     COPY TO CLIPBOARD + TOAST
  =============================== */
  copyTargets.forEach(el => {
    el.addEventListener("click", () => {
      const text = el.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        showToast("복사되었습니다 👍");
      });
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
    }, 1800);
  }
});
