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
