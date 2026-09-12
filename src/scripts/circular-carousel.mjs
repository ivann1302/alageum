export const wrapCarouselIndex = (index, direction, itemCount) => {
  if (itemCount <= 0) return 0;
  return (index + direction + itemCount) % itemCount;
};

const initializeCircularCarousel = (carousel) => {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const hint = carousel.querySelector("[data-carousel-hint]");
  const items = Array.from(carousel.querySelectorAll("[data-carousel-item]"));
  if (!(viewport instanceof HTMLElement) || !(previous instanceof HTMLButtonElement) || !(next instanceof HTMLButtonElement) || !items.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 640px)");
  let touchStartX = null;
  let touchStartIndex = 0;

  const closestIndex = (scrollLeft = viewport.scrollLeft) => items.reduce((closest, item, index) => {
    if (!(item instanceof HTMLElement)) return closest;
    const closestItem = items[closest];
    if (!(closestItem instanceof HTMLElement)) return index;
    return Math.abs(item.offsetLeft - scrollLeft) < Math.abs(closestItem.offsetLeft - scrollLeft) ? index : closest;
  }, 0);

  const lastReachableIndex = () => closestIndex(viewport.scrollWidth - viewport.clientWidth);

  const goTo = (index) => {
    const item = items[index];
    if (!(item instanceof HTMLElement)) return;
    viewport.scrollTo({
      left: item.offsetLeft,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  const move = (direction) => {
    const current = closestIndex();
    const last = lastReachableIndex();
    const nextIndex = direction > 0 && current >= last
      ? 0
      : direction < 0 && current <= 0
        ? last
        : wrapCarouselIndex(current, direction, items.length);
    goTo(nextIndex);
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  viewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  });

  viewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
    touchStartIndex = closestIndex();
  }, { passive: true });

  viewport.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    const last = lastReachableIndex();
    if (distance < -48 && touchStartIndex >= last) goTo(0);
    if (distance > 48 && touchStartIndex <= 0) goTo(last);
    touchStartX = null;
  }, { passive: true });

  if (hint instanceof HTMLElement && "IntersectionObserver" in window) {
    viewport.addEventListener("scroll", () => {
      if (mobile.matches && viewport.scrollLeft > 4) hint.classList.add("is-dismissed");
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      hint.classList.add("is-visible");
      observer.disconnect();
    });
    observer.observe(hint);
  }
};

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-circular-carousel]").forEach(initializeCircularCarousel);
}
