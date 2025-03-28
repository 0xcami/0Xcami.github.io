function showFieldError(field, message) {
  const error = document.createElement("div");
  error.className = "input-error";
  error.textContent = message;
  field.insertAdjacentElement("afterend", error);
  setTimeout(() => error.remove(), 2000);
}

function initFormHandler() {
  let formStartTime = Date.now();

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
    // Limpia errores anteriores
const previousError = form.querySelector(".input-error");
if (previousError) previousError.remove();

if (!emailRegex.test(email)) {
  showFieldError(form.email, "❌ El correo debe tener un '@' y un dominio válido.");
  return;
}
if (!emailRegex.test(email)) {
  showFieldError(form.email, "❌ El correo debe tener un '@' y un dominio válido.");
  return;
}

if (message.length < 10) {
  showFieldError(form.message, "❌ El mensaje debe tener al menos 10 caracteres.");
  return;
}

    try {
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
        setTimeout(() => status.textContent = "", 2000);
      } else {
        status.textContent = "❌ Error en el envío.";
      }
    } catch (err) {
      status.textContent = "❌ Fallo de red.";
    }
  });
}
