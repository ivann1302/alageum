const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      const original = element.textContent ?? "";
      const number = original.match(/[\d\s]+/);
      if (!number) continue;
      const target = Number(number[0].replace(/\s/g, ""));
      if (!Number.isFinite(target)) continue;
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        if (progress === 1 || reducedMotion.matches) {
          element.textContent = original;
          return;
        }
        const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
        element.textContent = original.replace(number[0], value.toLocaleString("ru-RU"));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });

  document.querySelectorAll("[data-count-up]").forEach((element) => observer.observe(element));
}
