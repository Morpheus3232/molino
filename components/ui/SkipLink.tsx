"use client";

/**
 * El target (#main-content) no es focuseable por default — sin esto, activar
 * el link mueve el scroll pero el foco de teclado se queda en <body>,
 * dejando a un usuario de teclado/lector de pantalla sin punto de partida
 * real dentro del contenido. Se agrega tabindex=-1 temporalmente (fuera del
 * tab order normal, pero focuseable programáticamente) y se saca al perder
 * el foco para no ensuciar el DOM permanentemente.
 */
export default function SkipLink() {
  const handleClick = () => {
    const target = document.getElementById("main-content");
    if (!target) return;
    target.setAttribute("tabindex", "-1");
    target.focus();
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  };

  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      Saltar al contenido principal
    </a>
  );
}
