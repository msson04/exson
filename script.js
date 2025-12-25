document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     Smooth Scroll (Nav)
  ============================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

      window.scrollTo({
        top: target.offsetTop - 90,
        behavior: "smooth"
      });

      document.querySelector(".nav")?.classList.remove("open");
    });
  });

  /* =============================
     Scroll Animation
  ============================= */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".fade-up, .fade-in").forEach(el => observer.observe(el));

  /* =============================
     Header Shrink
  ============================= */
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("shrink", window.scrollY > 60);
  });

  /* =============================
     Mobile Nav Toggle
  ============================= */
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  toggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  /* =============================
     Copy to Clipboard
  ============================= */
  document.querySelectorAll("[data-copy]").forEach(el => {
    el.addEventListener("click", () => {
      const text = el.dataset.copy;

      navigator.clipboard.writeText(text).then(() => {
        showToast("복사되었습니다");
      });
    });
  });

  /* =============================
     Toast
  ============================= */
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
