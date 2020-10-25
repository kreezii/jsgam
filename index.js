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


current_date = new Date()
cmm = current_date.getFullYear()
document.querySelector("#currentYear").innerHTML=cmm;

document.querySelector("#switchTheme").onclick=switchTheme;

function switchTheme(){
  if(document.documentElement.hasAttribute("data-theme")){
    document.documentElement.removeAttribute("data-theme")
  }else{
    document.documentElement.setAttribute("data-theme","dark");
  }
}
