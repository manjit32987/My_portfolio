/* ==========================================================================
   PORTFOLIO SCRIPT - MANJIT CHAKRABORTY
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------------------------
     1. Mobile Menu Show & Hide
     ------------------------------------------------------------------------- */
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close"),
    navLinks = document.querySelectorAll(".nav__link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  if (navClose && navMenu) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  // Remove menu on clicking any link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("show-menu");
    });
  });

  /* -------------------------------------------------------------------------
     2. Static Hero Title (No Animation Loop)
     ------------------------------------------------------------------------- */
  // Title remains crisp, clean and fixed as requested

  /* -------------------------------------------------------------------------
     3. Swiper Projects Carousel
     ------------------------------------------------------------------------- */
  try {
    if (typeof Swiper !== "undefined" && document.querySelector(".projects__swiper")) {
      new Swiper(".projects__swiper", {
        loop: true,
        spaceBetween: 24,
        slidesPerView: "auto",
        grabCursor: true,
        speed: 600,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
      });
    }
  } catch (err) {
    console.warn("Swiper initialization notice:", err);
  }

  /* -------------------------------------------------------------------------
     4. Work Tabs (Experience & Education)
     ------------------------------------------------------------------------- */
  const tabs = document.querySelectorAll("[data-target]"),
    tabContents = document.querySelectorAll("[data-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetSelector = tab.dataset.target,
        targetContent = document.querySelector(targetSelector);

      if (!targetContent) return;

      tabContents.forEach((c) => c.classList.remove("work-active"));
      tabs.forEach((t) => t.classList.remove("work-active"));

      tab.classList.add("work-active");
      targetContent.classList.add("work-active");
    });
  });

  /* -------------------------------------------------------------------------
     5. Services Accordion Expand/Collapse
     ------------------------------------------------------------------------- */
  const serviceButtons = document.querySelectorAll(".services__button");

  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cards = document.querySelectorAll(".services__card");
      const card = btn.closest(".services__card");
      const info = card.querySelector(".services__info");

      const isOpen = card.classList.contains("services__open");

      cards.forEach((c) => {
        c.classList.remove("services__open");
        c.classList.add("services__close");
        const i = c.querySelector(".services__info");
        if (i) i.style.height = "0px";
      });

      if (!isOpen && info) {
        info.style.height = "auto";
        const height = info.scrollHeight + "px";
        card.classList.remove("services__close");
        card.classList.add("services__open");
        info.style.height = height;
      }
    });
  });

  /* -------------------------------------------------------------------------
     6. Infinite Marquee Tickers (Wall of Fame / Testimonials)
     ------------------------------------------------------------------------- */
  const tracks = document.querySelectorAll(".testimonials__content");
  tracks.forEach((track) => {
    const cards = [...track.children];
    for (const card of cards) {
      track.appendChild(card.cloneNode(true));
    }
  });

  /* -------------------------------------------------------------------------
     7. Certificates Filter & Instant Search
     ------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll("[data-cert-filter]"),
    certCards = document.querySelectorAll(".cert__card"),
    certSearch = document.getElementById("certSearch"),
    noCertsFound = document.getElementById("noCertsFound");

  let currentCategory = "all";

  function filterCertificates() {
    const query = certSearch ? certSearch.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    certCards.forEach((card) => {
      const cardCat = card.dataset.category || "";
      const cardKeywords = (card.dataset.keywords || "").toLowerCase();
      const cardTitle = (card.querySelector(".cert__title")?.textContent || "").toLowerCase();
      const cardIssuer = (card.querySelector(".cert__issuer")?.textContent || "").toLowerCase();

      const matchesCat = currentCategory === "all" || cardCat === currentCategory;
      const matchesSearch =
        query === "" ||
        cardKeywords.includes(query) ||
        cardTitle.includes(query) ||
        cardIssuer.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (noCertsFound) {
      noCertsFound.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active-filter"));
      btn.classList.add("active-filter");
      currentCategory = btn.dataset.certFilter;
      filterCertificates();
    });
  });

  if (certSearch) {
    certSearch.addEventListener("input", filterCertificates);
  }

  /* -------------------------------------------------------------------------
     8. Certificate & Wall of Fame Modal Lightbox
     ------------------------------------------------------------------------- */
  const modal = document.getElementById("certModal"),
    modalImg = document.getElementById("modalImg"),
    modalTitle = document.getElementById("modalTitle"),
    modalLink = document.getElementById("modalDriveLink"),
    modalClose = document.getElementById("modalClose");

  function openModal(imgSrc, titleText, driveUrl) {
    if (!modal) return;
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = titleText || "Certificate Preview";
    if (modalLink) {
      if (driveUrl) {
        modalLink.href = driveUrl;
        modalLink.style.display = "inline-flex";
      } else {
        modalLink.style.display = "none";
      }
    }
    modal.classList.add("active-modal");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active-modal");
    document.body.style.overflow = "";
    if (modalImg) modalImg.src = "";
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active-modal")) {
      closeModal();
    }
  });

  // Attach click listener to certificate preview buttons & images
  document.querySelectorAll("[data-cert-preview]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = trigger.closest(".cert__card");
      if (!card) return;
      const imgSrc = card.dataset.certImg || card.querySelector("img")?.src;
      const title = card.dataset.certTitle || card.querySelector(".cert__title")?.textContent;
      const drive = card.dataset.certDrive || "";
      openModal(imgSrc, title, drive);
    });
  });

  // Attach click listener to Wall of Fame cards
  document.querySelectorAll(".testimonials__card--fame").forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img")?.src;
      const title = card.querySelector(".fame__title")?.textContent || "Milestone Milestone";
      openModal(img, title, null);
    });
  });

  /* -------------------------------------------------------------------------
     9. Copy Email In Contact
     ------------------------------------------------------------------------- */
  const copyBtn = document.getElementById("contact-btn");
  const copyEmailElem = document.getElementById("contact-email");

  if (copyBtn && copyEmailElem) {
    const copyEmail = copyEmailElem.textContent.trim();
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(copyEmail).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Email Copied <i class="ri-check-line"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 2200);
      });
    });
  }

  /* -------------------------------------------------------------------------
     10. Dynamic Current Year of Footer
     ------------------------------------------------------------------------- */
  const textYear = document.getElementById("footer-year");
  if (textYear) {
    textYear.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------------
     11. Scroll Section Active Link
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");

  const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const id = section.id;
      const top = section.offsetTop - 80;
      const height = section.offsetHeight;
      const link = document.querySelector(".nav__menu a[href*=" + id + "]");

      if (!link) return;
      link.classList.toggle(
        "active-link",
        scrollY > top && scrollY <= top + height
      );
    });
  };
  window.addEventListener("scroll", scrollActive);

  /* -------------------------------------------------------------------------
     12. Custom Cursor
     ------------------------------------------------------------------------- */
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    let mouseX = -100,
      mouseY = -100;
    let cursorActive = false;

    const cursorMove = () => {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      cursor.style.transform = "translate(-50%, -50%)";
      requestAnimationFrame(cursorMove);
    };

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorActive) {
        cursorActive = true;
        cursor.style.opacity = "1";
      }
    });
    cursorMove();

    const hoverables = document.querySelectorAll("a, button, input, .cert__card, .testimonials__card--fame");
    hoverables.forEach((item) => {
      item.addEventListener("mouseenter", () => cursor.classList.add("hide-cursor"));
      item.addEventListener("mouseleave", () => cursor.classList.remove("hide-cursor"));
    });
  }

  /* -------------------------------------------------------------------------
     13. Scroll Reveal Animation
     ------------------------------------------------------------------------- */
  try {
    if (typeof ScrollReveal !== "undefined") {
      const sr = ScrollReveal({
        origin: "top",
        distance: "60px",
        duration: 1800,
        delay: 200,
        reset: false,
      });

      sr.reveal(`.home__image, .projects__container, .work__container, .testimonials__container, .certs__controls, .certs__grid, .contact__container`);
      sr.reveal(`.home__data`, { delay: 600, origin: "bottom" });
      sr.reveal(`.home__info`, { delay: 800, origin: "bottom" });
      sr.reveal(`.home__social, .home__cv`, { delay: 900 });
      sr.reveal(`.about__data`, { origin: "left" });
      sr.reveal(`.about__image`, { origin: "right" });
      sr.reveal(`.services__card`, { interval: 120 });
    }
  } catch (err) {
    console.warn("ScrollReveal notice:", err);
  }
});

