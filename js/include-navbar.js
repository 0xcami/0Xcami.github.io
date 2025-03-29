document.addEventListener("DOMContentLoaded", function () {
    fetch("partials/navbar.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
      });
  });