const backgrounds = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

if (backgrounds.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layers = backgrounds.map((element) => ({ element, current: 0 }));
  let frame = 0;
  let distance = 0;
  let speed = 0;
  let previousTime = 0;
  let snapToPosition = true;

  const update = (time: number) => {
    frame = 0;
    const elapsed = Math.min(time - previousTime, 64);
    const blend = snapToPosition ? 1 : 1 - Math.exp(-elapsed / 110);
    previousTime = time;
    const viewportHeight = window.innerHeight;
    const positions = layers.map((layer) => {
      const rect = layer.element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewportHeight) return null;
      const offset = (viewportHeight / 2 - rect.top - rect.height / 2) * speed;
      return { layer, target: Math.max(-distance, Math.min(distance, offset)) };
    });
    let moving = false;
    for (const position of positions) {
      if (!position) continue;
      const { layer, target } = position;
      layer.current += (target - layer.current) * blend;
      if (Math.abs(target - layer.current) < 0.1) {
        layer.current = target;
      } else {
        moving = true;
      }
      layer.element.style.setProperty("--parallax-y", `${layer.current.toFixed(2)}px`);
    }
    snapToPosition = false;
    if (moving) frame = requestAnimationFrame(update);
  };

  const schedule = () => {
    if (!reducedMotion.matches && !frame) {
      previousTime = performance.now();
      frame = requestAnimationFrame(update);
    }
  };

  const configure = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    snapToPosition = true;
    const mobile = window.innerWidth <= 640;
    distance = mobile ? 49.725 : 77.35;
    speed = mobile ? 0.1326 : 0.1547;
    for (const layer of layers) {
      if (reducedMotion.matches) {
        layer.current = 0;
        layer.element.style.removeProperty("--parallax-space");
        layer.element.style.removeProperty("--parallax-y");
      } else {
        layer.element.style.setProperty("--parallax-space", `${distance}px`);
      }
    }
    schedule();
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", configure, { passive: true });
  window.addEventListener("pageshow", configure);
  reducedMotion.addEventListener("change", configure);
  configure();
}
