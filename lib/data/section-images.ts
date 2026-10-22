/**
 * Portadas de Numerología, Astrología, Biblioteca y Academia (2026-10-22).
 * Fotos de Unsplash (licencia Unsplash) y láminas de dominio público de la
 * NYPL, el Cleveland Museum of Art y Europeana, con el mismo duotono que el
 * blog. Los archivos viven en public/secciones/<sección>/<clave>.jpg.
 * Las constelaciones son del atlas celeste de Flamsteed (ed. Fortin, 1795).
 */

export interface SectionImage {
  src: string;
  alt: string;
  /** "Foto" para fotografías; "Lámina" para grabados y documentos antiguos. */
  kind: "Foto" | "Lámina";
  credit: { name: string; url: string };
}

export const SECTION_IMAGES: Record<string, SectionImage> = {
  "numerologia/hub": { src: "/secciones/numerologia/hub.jpg", alt: "Un ábaco antiguo de madera", kind: "Foto", credit: { name: "Alexandr Popadin", url: "https://unsplash.com/photos/Osh3bfyOQTg" } },
  "numerologia/1": { src: "/secciones/numerologia/1.jpg", alt: "Un número 1 metálico sobre una pared clara", kind: "Foto", credit: { name: "Ilya Chunin", url: "https://unsplash.com/photos/QFSOl3y5_84" } },
  "numerologia/2": { src: "/secciones/numerologia/2.jpg", alt: "Un número 2 blanco sobre una pared de ladrillo", kind: "Foto", credit: { name: "Waldemar Brandt", url: "https://unsplash.com/photos/YKtxjGsl1BY" } },
  "numerologia/3": { src: "/secciones/numerologia/3.jpg", alt: "Un número 3 metálico sobre una pared de ladrillo", kind: "Foto", credit: { name: "Metin Ozer", url: "https://unsplash.com/photos/zRSOJpVjjdI" } },
  "numerologia/4": { src: "/secciones/numerologia/4.jpg", alt: "Una placa esmaltada con el número 4", kind: "Foto", credit: { name: "iridial", url: "https://unsplash.com/photos/s0ikeJgiJpc" } },
  "numerologia/5": { src: "/secciones/numerologia/5.jpg", alt: "Un número 5 pintado en blanco sobre fondo oscuro", kind: "Foto", credit: { name: "Ryan Johns", url: "https://unsplash.com/photos/0X7ZNRcBT-k" } },
  "numerologia/6": { src: "/secciones/numerologia/6.jpg", alt: "Un número 6 pintado sobre una puerta de madera", kind: "Foto", credit: { name: "Clem Onojeghuo", url: "https://unsplash.com/photos/H-82Nbe8m7o" } },
  "numerologia/7": { src: "/secciones/numerologia/7.jpg", alt: "Un cartel \"No. 7\" sobre una pared de ladrillo", kind: "Foto", credit: { name: "Eric Prouzet", url: "https://unsplash.com/photos/SS7DP_65N4g" } },
  "numerologia/8": { src: "/secciones/numerologia/8.jpg", alt: "Una placa ovalada con el número 8 sobre ladrillo", kind: "Foto", credit: { name: "Simon Harmer", url: "https://unsplash.com/photos/J_Nm6LKLQw0" } },
  "numerologia/9": { src: "/secciones/numerologia/9.jpg", alt: "Un número 9 negro sobre una pared de ladrillo blanco", kind: "Foto", credit: { name: "Kumudu Siriwardhane", url: "https://unsplash.com/photos/HUb_ip4v6eU" } },
  "numerologia/11": { src: "/secciones/numerologia/11.jpg", alt: "Una placa con el número 11 sobre ladrillo oscuro", kind: "Foto", credit: { name: "David Monje", url: "https://unsplash.com/photos/eUB_CYMxawE" } },
  "numerologia/22": { src: "/secciones/numerologia/22.jpg", alt: "El número 22 sobre una pared lisa", kind: "Foto", credit: { name: "Marcel Strauß", url: "https://unsplash.com/photos/28sYbMqonFs" } },
  "numerologia/33": { src: "/secciones/numerologia/33.jpg", alt: "El número 33 en relieve dentro de un círculo", kind: "Foto", credit: { name: "Flora Mipsum", url: "https://unsplash.com/photos/p_mXq4hGPaI" } },
  "astrologia/hub": { src: "/secciones/astrologia/hub.jpg", alt: "Rueda zodiacal antigua con los doce signos", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/jTDcWt-wLoU" } },
  "astrologia/aries": { src: "/secciones/astrologia/aries.jpg", alt: "La constelación de Aries en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/gR0GSkB0we8" } },
  "astrologia/tauro": { src: "/secciones/astrologia/tauro.jpg", alt: "La constelación de Tauro, junto a Orión, en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/XgbIuo9Cdc8" } },
  "astrologia/geminis": { src: "/secciones/astrologia/geminis.jpg", alt: "La constelación de Géminis en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/ElnyR3xXF68" } },
  "astrologia/cancer": { src: "/secciones/astrologia/cancer.jpg", alt: "La constelación de Cáncer en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/ns74WXsJvqY" } },
  "astrologia/leo": { src: "/secciones/astrologia/leo.jpg", alt: "La constelación de Leo en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/fZlN1qSI5fo" } },
  "astrologia/virgo": { src: "/secciones/astrologia/virgo.jpg", alt: "La constelación de Virgo en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/fzurSLOBik4" } },
  "astrologia/libra": { src: "/secciones/astrologia/libra.jpg", alt: "La balanza de Libra en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/OOarepLo6io" } },
  "astrologia/escorpio": { src: "/secciones/astrologia/escorpio.jpg", alt: "La constelación de Escorpio en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/OOarepLo6io" } },
  "astrologia/sagitario": { src: "/secciones/astrologia/sagitario.jpg", alt: "La constelación de Sagitario en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/1c0PtWPcN3M" } },
  "astrologia/capricornio": { src: "/secciones/astrologia/capricornio.jpg", alt: "La constelación de Capricornio en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/544kDc6FPb4" } },
  "astrologia/acuario": { src: "/secciones/astrologia/acuario.jpg", alt: "La constelación de Acuario en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/544kDc6FPb4" } },
  "astrologia/piscis": { src: "/secciones/astrologia/piscis.jpg", alt: "La constelación de Piscis en un atlas celeste de 1795", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/uv9B7hSc9F8" } },
  "biblioteca/hub": { src: "/secciones/biblioteca/hub.jpg", alt: "Una biblioteca antigua con estanterías de madera", kind: "Foto", credit: { name: "Michaela Murphy", url: "https://unsplash.com/photos/TIS8AnSiFI4" } },
  "biblioteca/numerologia": { src: "/secciones/biblioteca/numerologia.jpg", alt: "Un ábaco viejo de madera, de cerca", kind: "Foto", credit: { name: "Alexandr Popadin", url: "https://unsplash.com/photos/I4o4ap5frEQ" } },
  "biblioteca/astrologia": { src: "/secciones/biblioteca/astrologia.jpg", alt: "Un globo celeste antiguo", kind: "Foto", credit: { name: "Bernd Dittrich", url: "https://unsplash.com/photos/r1SxY90acD4" } },
  "biblioteca/zodiaco": { src: "/secciones/biblioteca/zodiaco.jpg", alt: "Varillas de incienso sobre ceniza, en un templo", kind: "Foto", credit: { name: "jly un", url: "https://unsplash.com/photos/H5H6Z56c-_k" } },
  "biblioteca/personalidad": { src: "/secciones/biblioteca/personalidad.jpg", alt: "Máscaras blancas y negras sobre una tela", kind: "Foto", credit: { name: "Victoria Priessnitz", url: "https://unsplash.com/photos/lz1utGEXz6Q" } },
  "biblioteca/filosofia": { src: "/secciones/biblioteca/filosofia.jpg", alt: "Un libro abierto junto a una vela encendida", kind: "Foto", credit: { name: "Ivan Sabayuki", url: "https://unsplash.com/photos/ZB7PHTn0Zvk" } },
  "academia/hub": { src: "/secciones/academia/hub.jpg", alt: "Esfera de reloj antigua con números romanos y signos del zodíaco", kind: "Foto", credit: { name: "Erik Mclean", url: "https://unsplash.com/photos/KbSF8a9kpNc" } },
  "academia/babilonia": { src: "/secciones/academia/babilonia.jpg", alt: "Una tablilla de arcilla con escritura cuneiforme", kind: "Foto", credit: { name: "IRANI WORLD", url: "https://unsplash.com/photos/YMfO2g4dCg8" } },
  "academia/pitagoras": { src: "/secciones/academia/pitagoras.jpg", alt: "Busto de mármol de un filósofo barbado", kind: "Foto", credit: { name: "Bernd Dittrich", url: "https://unsplash.com/photos/dWxSopvEHjU" } },
  "academia/guematia": { src: "/secciones/academia/guematia.jpg", alt: "Texto hebreo antiguo sobre pergamino", kind: "Foto", credit: { name: "Tanner Mardis", url: "https://unsplash.com/photos/xUXGHzhIbN4" } },
  "academia/zou-yan": { src: "/secciones/academia/zou-yan.jpg", alt: "Una mano escribiendo caligrafía con pincel y tinta", kind: "Foto", credit: { name: "Niketh Vellanki", url: "https://unsplash.com/photos/vJqSAasmCEY" } },
  "academia/calendario-taichu": { src: "/secciones/academia/calendario-taichu.jpg", alt: "Luna creciente sobre una montaña nevada", kind: "Foto", credit: { name: "Benjamin Voros", url: "https://unsplash.com/photos/U-Kty6HxcQc" } },
  "academia/helenistica": { src: "/secciones/academia/helenistica.jpg", alt: "Columnas corintias de estilo clásico", kind: "Foto", credit: { name: "Madeline Pere", url: "https://unsplash.com/photos/r37QcATSbD4" } },
  "academia/zodiaco-chino": { src: "/secciones/academia/zodiaco-chino.jpg", alt: "Una página de caligrafía china tradicional", kind: "Lámina", credit: { name: "The Cleveland Museum of Art", url: "https://unsplash.com/photos/oPqWQTmuSWY" } },
  "academia/ptolomeo": { src: "/secciones/academia/ptolomeo.jpg", alt: "Diagramas antiguos de esferas celestes y armilares", kind: "Lámina", credit: { name: "The New York Public Library", url: "https://unsplash.com/photos/7LzE9wWU-pI" } },
  "academia/balliett": { src: "/secciones/academia/balliett.jpg", alt: "Un libro antiguo abierto con un grabado", kind: "Foto", credit: { name: "Kelly Sikkema", url: "https://unsplash.com/photos/6hOlSAQ-L98" } },
  "academia/cheiro": { src: "/secciones/academia/cheiro.jpg", alt: "La palma abierta de una mano", kind: "Foto", credit: { name: "Kira auf der Heide", url: "https://unsplash.com/photos/QyCH5jwrD_A" } },
  "academia/jordan": { src: "/secciones/academia/jordan.jpg", alt: "Una máquina de escribir antigua sobre madera", kind: "Foto", credit: { name: "Patrick Fore", url: "https://unsplash.com/photos/0gkw_9fy0eQ" } },
  "academia/mccants": { src: "/secciones/academia/mccants.jpg", alt: "Un televisor antiguo de tubo", kind: "Foto", credit: { name: "Ming De Dong Huang", url: "https://unsplash.com/photos/IUud3kZxXfs" } },
  "academia/molino": { src: "/secciones/academia/molino.jpg", alt: "Un molino de viento de Consuegra, en La Mancha", kind: "Foto", credit: { name: "Sergio Guardiola Herrador", url: "https://unsplash.com/photos/QJNE7iiaRXI" } },
  "academia/como-funciona-tu-mapa": { src: "/secciones/academia/como-funciona-tu-mapa.jpg", alt: "Un mapamundi antiguo con figuras celestes", kind: "Lámina", credit: { name: "Europeana", url: "https://unsplash.com/photos/Gz4hlvSUtqw" } },
  "academia/como-funciona-el-zodiaco-chino": { src: "/secciones/academia/como-funciona-el-zodiaco-chino.jpg", alt: "Un libro abierto con escritura china", kind: "Foto", credit: { name: "Tianhao Zhang", url: "https://unsplash.com/photos/YdRIRl7Ic4o" } },
  "academia/como-se-arma-mi-mapa": { src: "/secciones/academia/como-se-arma-mi-mapa.jpg", alt: "Piezas sobre un tablero de ajedrez", kind: "Foto", credit: { name: "Warren Umoh", url: "https://unsplash.com/photos/HBkuFoJuwDI" } },
  "academia/por-que-fecha-exacta": { src: "/secciones/academia/por-que-fecha-exacta.jpg", alt: "Un calendario impreso, de cerca", kind: "Foto", credit: { name: "Road Ahead", url: "https://unsplash.com/photos/r1CDF8HXgJY" } },
  "academia/como-leer-una-afinidad": { src: "/secciones/academia/como-leer-una-afinidad.jpg", alt: "Una mano sostiene una lupa sobre un texto", kind: "Foto", credit: { name: "Mick Haupt", url: "https://unsplash.com/photos/eQ2Z9ay9Wws" } },
  "academia/como-funciona-hoy": { src: "/secciones/academia/como-funciona-hoy.jpg", alt: "Un reloj de bolsillo antiguo", kind: "Foto", credit: { name: "Andrik Langfield", url: "https://unsplash.com/photos/0rTCXZM7Xfo" } },
};

/** "Géminis" → "geminis": la clave de imagen de un signo. */
export function signImageKey(name: string): string {
  return `astrologia/${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`;
}

export function getSectionImage(key: string): SectionImage | undefined {
  return SECTION_IMAGES[key];
}
