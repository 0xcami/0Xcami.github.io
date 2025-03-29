fetch('partials/footer.html')
  .then(response => response.text())
  .then(data => {
    document.body.insertAdjacentHTML('beforeend', data);

    const formHandlerScript = document.createElement('script');
    formHandlerScript.src = 'js/form-handler.js';

    formHandlerScript.onload = function () {
      if (typeof initFormHandler === 'function') {
        initFormHandler();
      } else {
        console.error("No se pudo inicializar el handler del formulario.");
      }
    };

    document.body.appendChild(formHandlerScript);
  });