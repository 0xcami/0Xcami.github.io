function showFieldError(field, message) {
  const error = document.createElement("div");
  error.className = "input-error";
  error.textContent = message;
  field.insertAdjacentElement("afterend", error);
  setTimeout(() => error.remove(), 3000);
}

function initFormHandler() {
  const formStartTime = Date.now();
  const form = document.getElementById("contact-form");
  const csrfField = document.getElementById("csrf_token");
  const status = document.getElementById("form-status");

  if (!form || !csrfField || !status) {
    console.warn("Formulario no encontrado.");
    return;
  }

  const fakeToken = Math.random().toString(36).substring(2);
  csrfField.value = fakeToken;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = form.querySelector("[name='_gotcha']");
    const token = form.csrf_token.value;
    const elapsed = (Date.now() - formStartTime) / 1000;

    const previousError = form.querySelector(".input-error");
    if (previousError) previousError.remove();

    // Validaciones básicas
    if (honeypot && honeypot.value !== "") {
      status.textContent = "❌ Actividad sospechosa detectada (honeypot).";
      return;
    }

    if (token !== fakeToken) {
      status.textContent = "❌ Token inválido.";
      return;
    }

    if (elapsed < 3) {
      status.textContent = "⏳ Espera unos segundos antes de enviar.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFieldError(form.email, "❌ El correo debe tener un '@' y un dominio válido.");
      return;
    }

    if (message.length < 10) {
      showFieldError(form.message, "❌ El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    // Validación extra vía Vercel
    try {
      const validationRes = await fetch("https://validate-email-api-dpsp-formspree.vercel.app/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const validationData = await validationRes.json();

      if (!validationData.valid) {
        showFieldError(form.email, `❌ ${validationData.reason}`);
        return;
      }

      // Envío a Formspree
      const response = await fetch("https://formspree.io/f/mjkyerdn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ email, message })
      });

      if (response.ok) {
        status.textContent = "Gracias por tu mensaje :)";
        history.replaceState({}, document.title, window.location.pathname);
        form.reset();
        setTimeout(() => (status.textContent = ""), 3000);
      } else {
        status.textContent = "❌ Error en el envío.";
      }
    } catch (err) {
      status.textContent = "❌ Fallo de red.";
    }
  });
}

// Asegurar que esté disponible globalmente
window.initFormHandler = initFormHandler;
