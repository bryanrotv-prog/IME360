const siteConfig = {
  brandName: "IME360",
  whatsappNumber: "5210000000000",
  whatsappMessage:
    "Hola, quiero cotizar servicios para mi evento. Me interesa recibir informacion y disponibilidad.",
  serviceArea: "tu ciudad y alrededores",
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
  `Hola, quiero cotizar el servicio de ${serviceName} para mi evento. ${siteConfig.whatsappMessage}`;

const buildQrUrl = (link) =>
  `https://quickchart.io/qr?text=${encodeURIComponent(link)}&size=320&margin=1&dark=%23173e57&light=%23ffffff`;

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
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
          "No se pudo copiar automaticamente. Usa el boton de WhatsApp para abrir el enlace.";
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
