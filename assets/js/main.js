(() => {
  const doc = document;
  const header = doc.querySelector("[data-header]");
  const toggle = doc.querySelector("[data-nav-toggle]");
  const drawer = doc.querySelector("[data-drawer]");
  const year = doc.querySelector("[data-year]");

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setDrawer = (open) => {
    if (!drawer || !toggle) return;
    drawer.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    doc.body.classList.toggle("nav-open", open);
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setDrawer(open);
  });

  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setDrawer(false));
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setDrawer(false);
  });

  doc.querySelectorAll("[data-accordion]").forEach((item) => {
    const button = item.querySelector("button");
    const panel = item.querySelector("[data-panel]");
    if (!button || !panel) return;

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const group = item.closest("[data-accordion-group]");
      if (group) {
        group.querySelectorAll("[data-accordion]").forEach((other) => {
          const otherBtn = other.querySelector("button");
          const otherPanel = other.querySelector("[data-panel]");
          otherBtn?.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.hidden = true;
        });
      }
      button.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });

  const form = doc.querySelector("[data-booking-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const service = String(data.get("service") || "Physiotherapy");
    const visit = String(data.get("visit") || "Clinic visit");
    const message = String(data.get("message") || "").trim();
    const note = doc.querySelector("[data-form-note]");

    if (!name || !phone) {
      if (note) {
        note.textContent = "Please add your name and phone number so Dr. Hassan can reach you.";
        note.hidden = false;
      }
      return;
    }

    const text = [
      "Hello Dr. Hassan — I would like to book with Physio's Therapy Touch.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service: ${service}`,
      `Visit type: ${visit}`,
      message ? `Note: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/2348171964133?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    if (note) {
      note.textContent = "Opening WhatsApp with your booking request.";
      note.hidden = false;
    }
    form.reset();
  });

  const reveals = doc.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
