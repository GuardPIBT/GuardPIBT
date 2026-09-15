(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
    }
  };

  const header = qs("[data-site-header]");
  const nav = qs("[data-site-nav]");
  const navToggle = qs("[data-nav-toggle]");

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
    document.body.classList.remove("nav-open");
    refreshIcons();
  };

  navToggle?.addEventListener("click", () => {
    const opening = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", opening);
    navToggle.setAttribute("aria-expanded", String(opening));
    navToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    navToggle.innerHTML = `<i data-lucide="${opening ? "x" : "menu"}" aria-hidden="true"></i>`;
    document.body.classList.toggle("nav-open", opening);
    refreshIcons();
  });

  qsa("a[href^='#']", nav || document).forEach((link) => link.addEventListener("click", closeNav));

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const heroVideo = qs("#hero-video");
  const videoToggle = qs("[data-video-toggle]");
  const updateVideoButton = () => {
    if (!heroVideo || !videoToggle) return;
    const paused = heroVideo.paused;
    videoToggle.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    videoToggle.setAttribute("title", paused ? "Play video" : "Pause video");
    videoToggle.innerHTML = `<i data-lucide="${paused ? "play" : "pause"}" aria-hidden="true"></i>`;
    refreshIcons();
  };

  videoToggle?.addEventListener("click", async () => {
    if (!heroVideo) return;
    if (heroVideo.paused) {
      try {
        await heroVideo.play();
      } catch (_) {
        return;
      }
    } else {
      heroVideo.pause();
    }
    updateVideoButton();
  });
  heroVideo?.addEventListener("play", updateVideoButton);
  heroVideo?.addEventListener("pause", updateVideoButton);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo?.pause();
  }

  const millionViews = {
    global: {
      src: "assets/million-global.webp",
      alt: "One-million-agent global 3D state with a marked local region.",
      caption: "Exact global state; every cyan point is one occupied agent voxel."
    },
    local: {
      src: "assets/million-local.webp",
      alt: "Local one-million-agent slice with hummingbird meshes and exact next-step direction markers.",
      caption: "Representative z-layer: 346 of 347 visible agents move at the next exact step."
    }
  };

  qsa("[data-million-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = millionViews[button.dataset.millionView];
      if (!view) return;
      qsa("[data-million-view]").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
      const image = qs("#million-image");
      const caption = qs("#million-caption");
      const imageButton = image?.closest("[data-lightbox-src]");
      if (image) {
        image.src = view.src;
        image.alt = view.alt;
      }
      if (caption) caption.textContent = view.caption;
      if (imageButton) {
        imageButton.dataset.lightboxSrc = view.src;
        imageButton.dataset.lightboxAlt = view.alt;
        imageButton.setAttribute("aria-label", `Open ${button.dataset.millionView} visualization`);
      }
    });
  });

  const activateResultTab = (target) => {
    qsa("[data-result-tab]").forEach((button) => {
      const selected = button.dataset.resultTab === target;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    qsa("[data-result-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.resultPanel !== target;
    });
  };

  qsa("[data-result-tab]").forEach((button, index, buttons) => {
    button.addEventListener("click", () => activateResultTab(button.dataset.resultTab));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;
      buttons[nextIndex].focus();
      activateResultTab(buttons[nextIndex].dataset.resultTab);
    });
  });

  const lightbox = qs("[data-lightbox]");
  const lightboxImage = qs("[data-lightbox-image]");
  let lightboxTrigger = null;

  qsa("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxTrigger = button;
      lightboxImage.src = button.dataset.lightboxSrc;
      lightboxImage.alt = button.dataset.lightboxAlt || "Expanded research figure";
      lightbox.showModal();
    });
  });

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
    lightboxImage.removeAttribute("src");
    lightboxTrigger?.focus();
  };

  qs("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  const reveals = qsa(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) document.body.classList.add("motion-ready");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = qsa("main section[id]");
  const navLinks = qsa(".site-nav a[href^='#']");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const year = qs("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  refreshIcons();
})();
