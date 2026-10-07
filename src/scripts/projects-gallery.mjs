export const wrapGalleryIndex = (index, direction, itemCount) => {
  if (itemCount <= 0) return 0;
  return (index + direction + itemCount) % itemCount;
};

export const setActivePhoto = (projectCase, nextIndex) => {
  const photos = Array.from(projectCase.querySelectorAll("[data-project-photo]"));
  const thumbnails = Array.from(
    projectCase.querySelectorAll("[data-project-thumbnail]"),
  );

  if (!photos.length) return;

  const activeIndex = wrapGalleryIndex(nextIndex, 0, photos.length);
  projectCase.dataset.activePhoto = String(activeIndex);

  photos.forEach((photo, index) => {
    photo.hidden = index !== activeIndex;
  });

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.setAttribute("aria-pressed", String(index === activeIndex));
  });

};

const initializeProjectsGallery = (gallery) => {
  const tabsContainer = gallery.querySelector("[data-project-tabs]");
  const tabs = Array.from(gallery.querySelectorAll("[data-project-tab]"));
  const projectCases = Array.from(
    gallery.querySelectorAll("[data-project-case]"),
  );

  if (!(tabsContainer instanceof HTMLElement) || !tabs.length || !projectCases.length) {
    return;
  }

  gallery.dataset.enhanced = "";
  tabsContainer.hidden = false;
  const mobileLayout = window.matchMedia("(max-width: 640px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const selectProject = (nextIndex, moveFocus = false) => {
    const activeIndex = wrapGalleryIndex(nextIndex, 0, projectCases.length);

    tabs.forEach((tab, index) => {
      const isActive = index === activeIndex;
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive && moveFocus && tab instanceof HTMLElement) tab.focus();
    });

    projectCases.forEach((projectCase, index) => {
      projectCase.hidden = index !== activeIndex;
    });

    const activeCase = projectCases[activeIndex];
    const currentPhoto = Number(activeCase?.dataset.activePhoto ?? 0);
    if (activeCase instanceof HTMLElement) setActivePhoto(activeCase, currentPhoto);

    const activeTab = tabs[activeIndex];
    if (mobileLayout.matches && activeTab instanceof HTMLElement) {
      tabsContainer.scrollTo({
        left: activeTab.offsetLeft - (tabsContainer.clientWidth - activeTab.offsetWidth) / 2,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    }
  };

  mobileLayout.addEventListener("change", () => {
    selectProject(tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectProject(index));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      selectProject(
        wrapGalleryIndex(index, event.key === "ArrowRight" ? 1 : -1, tabs.length),
        true,
      );
    });
  });

  projectCases.forEach((projectCase) => {
    const photos = projectCase.querySelectorAll("[data-project-photo]");
    const previous = projectCase.querySelector("[data-project-photo-prev]");
    const next = projectCase.querySelector("[data-project-photo-next]");

    projectCase.querySelectorAll("[data-project-thumbnail]").forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => setActivePhoto(projectCase, index));
    });

    previous?.addEventListener("click", () => {
      const currentIndex = Number(projectCase.dataset.activePhoto ?? 0);
      setActivePhoto(
        projectCase,
        wrapGalleryIndex(currentIndex, -1, photos.length),
      );
    });

    next?.addEventListener("click", () => {
      const currentIndex = Number(projectCase.dataset.activePhoto ?? 0);
      setActivePhoto(
        projectCase,
        wrapGalleryIndex(currentIndex, 1, photos.length),
      );
    });

    setActivePhoto(projectCase, 0);
  });

  selectProject(0);
};

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-projects-gallery]").forEach(initializeProjectsGallery);
}
