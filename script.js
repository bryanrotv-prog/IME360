const siteConfig = {
  brandName: "IME360",
  whatsappNumber: "528443407452",
  whatsappMessage:
    "Hola, quiero cotizar mi evento con IME360. Me interesa conocer disponibilidad, servicios y precio individual o paquete especial.",
  serviceArea: "Arteaga, Coahuila",
};

const root = document.documentElement;
root.classList.add("js");

const sanitizePhone = (value) => String(value).replace(/\D/g, "");

const buildWhatsAppUrl = (message) => {
  const phone = sanitizePhone(siteConfig.whatsappNumber);
  const finalMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${finalMessage}`;
};

const buildDefaultMessage = () => siteConfig.whatsappMessage;

const buildServiceMessage = (serviceName) =>
  `Hola, quiero cotizar ${serviceName} para mi evento con IME360. Me interesa conocer disponibilidad y precio.`;

const buildQrUrl = (link) =>
  `https://quickchart.io/qr?text=${encodeURIComponent(link)}&size=320&margin=1&dark=%23173e57&light=%23ffffff`;

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
};

const initImageFallbacks = () => {
  document.querySelectorAll("img[data-fallback-src]").forEach((image) => {
    const applyFallback = () => {
      if (image.dataset.fallbackApplied === "true") {
        return;
      }

      image.dataset.fallbackApplied = "true";
      image.src = image.dataset.fallbackSrc;
    };

    image.addEventListener("error", applyFallback);

    if (image.complete && image.naturalWidth === 0) {
      applyFallback();
    }
  });
};

const initHeaderState = () => {
  const header = document.querySelector(".site-header");
  const stickyCta = document.querySelector(".sticky-cta");
  const mobileQuery = window.matchMedia("(max-width: 859px)");

  if (!header) {
    return;
  }

  const updateHeaderState = () => {
    const scrolled = window.scrollY > 36;
    const showSticky = mobileQuery.matches && window.scrollY > 420;

    header.classList.toggle("is-scrolled", scrolled);

    if (stickyCta) {
      stickyCta.classList.toggle("is-visible", showSticky);
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", updateHeaderState);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(updateHeaderState);
  }
};

const initContactData = () => {
  const defaultLink = buildWhatsAppUrl(buildDefaultMessage());
  const qrImage = document.getElementById("whatsapp-qr");

  setText("[data-brand-name]", siteConfig.brandName);
  setText("[data-service-area]", siteConfig.serviceArea);

  document.querySelectorAll(".js-whatsapp-link").forEach((node) => {
    const serviceName = node.dataset.service;
    const message = serviceName ? buildServiceMessage(serviceName) : buildDefaultMessage();
    node.href = buildWhatsAppUrl(message);
  });

  if (qrImage) {
    qrImage.src = buildQrUrl(defaultLink);
  }

  const copyFeedback = document.querySelector("[data-copy-feedback]");
  const copyButton = document.querySelector(".js-copy-link");

  if (!copyButton) {
    return;
  }

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(defaultLink);
      if (copyFeedback) {
        copyFeedback.textContent = "Enlace copiado. Ya puedes compartir tu contacto.";
      }
    } catch (error) {
      if (copyFeedback) {
        copyFeedback.textContent =
          "No se pudo copiar automáticamente. Usa el botón de WhatsApp para abrir el enlace.";
      }
    }
  });
};

const initReveal = () => {
  const elements = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((element) => observer.observe(element));
};

initContactData();
initReveal();
initImageFallbacks();
initHeaderState();
