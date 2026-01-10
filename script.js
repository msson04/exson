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
  const mobileBoardBtn = document.querySelector(".mobile-board-btn");

  /* ===============================
     FADE-IN / FADE-UP ANIMATION
  =============================== */
  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".fade-in, .fade-up").forEach(el => {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback
    document.querySelectorAll(".fade-in, .fade-up").forEach(el => {
      el.classList.add("show");
    });
  }

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
      menuBtn?.setAttribute("aria-expanded", "false");

      if (mobileBoardBtn) {
        mobileBoardBtn.style.display = "";
      }
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
      const id = section.id;

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(l => l.classList.remove("active"));
        document
          .querySelector(`.nav a[href="#${id}"]`)
          ?.classList.add("active");
        activeSet = true;
      }
    });

    // Hero 기본 active
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

    const isOpen = nav.classList.toggle("open");
    document.body.style.overflow = isOpen ? "hidden" : "";
    menuBtn.setAttribute("aria-expanded", String(isOpen));

    // 메뉴 열리면 플로팅 버튼 숨김
    if (mobileBoardBtn) {
      mobileBoardBtn.style.display = isOpen ? "none" : "";
    }
  });

  // 메뉴 외부 클릭 시 닫기
  document.addEventListener("click", e => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      nav.classList.remove("open");
      document.body.style.overflow = "";
      menuBtn?.setAttribute("aria-expanded", "false");

      if (mobileBoardBtn) {
        mobileBoardBtn.style.display = "";
      }
    }
  });

  /* ===============================
     MOBILE FLOAT BUTTON SCROLL UX
  =============================== */
  let lastScrollY = window.scrollY;

  if (mobileBoardBtn) {
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // 아래로 스크롤
        mobileBoardBtn.style.transform = "translateY(80px)";
        mobileBoardBtn.style.opacity = "0";
      } else {
        // 위로 스크롤
        mobileBoardBtn.style.transform = "translateY(0)";
        mobileBoardBtn.style.opacity = "1";
      }

      lastScrollY = currentScrollY;
    });
  }

  /* ===============================
     COPY TO CLIPBOARD + TOAST
  =============================== */
  document.querySelectorAll("[data-copy]").forEach(el => {
    const handler = () => {
      navigator.clipboard.writeText(el.dataset.copy);
      showToast("복사되었습니다");
    };

    el.addEventListener("click", handler);
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
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
