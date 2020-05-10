var botonArriba = document.querySelector("#sube");

window.addEventListener("scroll", mostrarBoton);

function mostrarBoton() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    if (!botonArriba.classList.contains("mostrar")) {
      botonArriba.classList.remove("ocultar");
      botonArriba.classList.add("mostrar");
      botonArriba.style.display = "block";
    }
  } else {
    if (botonArriba.classList.contains("mostrar")) {
      botonArriba.classList.remove("mostrar");
      botonArriba.classList.add("ocultar");
      setTimeout(() => {
        botonArriba.style.display = "none";
      }, 250);
    }
  }
}

botonArriba.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});
