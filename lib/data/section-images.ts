/**
 * Portadas de Numerología, Astrología, Biblioteca y Academia (2026-10-22).
 * Fotos de Unsplash (licencia Unsplash) y láminas de dominio público de la
 * NYPL, el Cleveland Museum of Art y Europeana, con el mismo duotono que el
 * blog. Los archivos viven en public/secciones/<sección>/<clave>.jpg.
 * Las constelaciones son del atlas celeste de Flamsteed (ed. Fortin, 1795).
 *
 * Segunda tanda (2026-10-25): herramientas, guías, páginas sueltas, zodíaco
 * chino y fases de la Luna. Obras de dominio público (CC0) del Met y del
 * Cleveland Museum of Art, y visualizaciones de la NASA. Las figuras del
 * zodíaco chino son un mismo juego funerario de la dinastía Sui/Tang.
 */

export interface SectionImage {
  src: string;
  alt: string;
  /**
   * "Foto" para fotografías; "Lámina" para grabados y documentos antiguos;
   * "Pintura" para óleos; "Imagen" para visualizaciones (la Luna de la NASA).
   */
  kind: "Foto" | "Lámina" | "Pintura" | "Imagen";
  credit: { name: string; url: string };
  /** Dónde está publicada. Sin dato es Unsplash. */
  source?: { name: string; url: string };
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
  "herramientas/hub": { src: "/secciones/herramientas/hub.jpg", alt: "Astrolabio de bronce dorado de 1462", kind: "Foto", credit: { name: "Regiomontanus", url: "https://www.metmuseum.org/art/collection/search/923639" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "herramientas/camino-de-vida": { src: "/secciones/herramientas/camino-de-vida.jpg", alt: "Un camino de tierra entre árboles, pintado por Meindert Hobbema hacia 1670", kind: "Pintura", credit: { name: "Meyndert Hobbema", url: "https://www.metmuseum.org/art/collection/search/436653" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "herramientas/signo-solar": { src: "/secciones/herramientas/signo-solar.jpg", alt: "El Sol fotografiado por el Observatorio de Dinámica Solar de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/PIA26681" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "herramientas/zodiaco-chino": { src: "/secciones/herramientas/zodiaco-chino.jpg", alt: "Espejo chino de bronce con los doce animales del zodíaco alrededor", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1995.336" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "herramientas/compatibilidad": { src: "/secciones/herramientas/compatibilidad.jpg", alt: "Una pareja sentada en un banco, grabado de Israhel van Meckenem", kind: "Lámina", credit: { name: "Israhel van Meckenem", url: "https://www.metmuseum.org/art/collection/search/641741" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "guia/hub": { src: "/secciones/guia/hub.jpg", alt: "Portada grabada de «Nova Reperta», con la brújula entre los inventos modernos", kind: "Lámina", credit: { name: "Jan Collaert I", url: "https://www.metmuseum.org/art/collection/search/659646" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "guia/camino-de-vida-7": { src: "/secciones/guia/camino-de-vida-7.jpg", alt: "«Melencolia I» de Durero, con su cuadrado mágico en la pared", kind: "Lámina", credit: { name: "Albrecht Dürer", url: "https://www.metmuseum.org/art/collection/search/360018" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "guia/compatibilidad-astrologica": { src: "/secciones/guia/compatibilidad-astrologica.jpg", alt: "Mapa celeste del hemisferio norte grabado por Durero en 1515", kind: "Lámina", credit: { name: "Albrecht Dürer", url: "https://www.metmuseum.org/art/collection/search/358366" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "guia/numeros-maestros": { src: "/secciones/guia/numeros-maestros.jpg", alt: "Un libro abierto de 1485 con diagramas de las esferas celestes", kind: "Lámina", credit: { name: "Johannes de Sacrobosco", url: "https://www.metmuseum.org/art/collection/search/356589" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/calendario": { src: "/secciones/paginas/calendario.jpg", alt: "Calendario japonés giratorio de 1795, el año del conejo", kind: "Lámina", credit: { name: "Kubo Shunman", url: "https://www.metmuseum.org/art/collection/search/77876" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/hoy": { src: "/secciones/paginas/hoy.jpg", alt: "Amanecer de año nuevo sobre la nieve en Susaki, grabado de Hiroshige", kind: "Lámina", credit: { name: "Utagawa Hiroshige", url: "https://www.metmuseum.org/art/collection/search/45295" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/pareja": { src: "/secciones/paginas/pareja.jpg", alt: "Una pareja camina bajo la nieve compartiendo un paraguas, grabado de Harunobu", kind: "Lámina", credit: { name: "Suzuki Harunobu", url: "https://www.metmuseum.org/art/collection/search/45085" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/socios": { src: "/secciones/paginas/socios.jpg", alt: "Dos comerciantes de plata sentados a una mesa, daguerrotipo de hacia 1850", kind: "Foto", credit: { name: "Autor desconocido", url: "https://www.metmuseum.org/art/collection/search/751631" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/journal": { src: "/secciones/paginas/journal.jpg", alt: "Una joven escribe una carta, grabado de Harunobu", kind: "Lámina", credit: { name: "Suzuki Harunobu", url: "https://www.metmuseum.org/art/collection/search/55793" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/premium": { src: "/secciones/paginas/premium.jpg", alt: "Una llave de cortesano labrada del siglo XVI", kind: "Foto", credit: { name: "The Met", url: "https://www.metmuseum.org/art/collection/search/202099" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/profesionales": { src: "/secciones/paginas/profesionales.jpg", alt: "«San Jerónimo en su estudio», grabado de Durero de 1514", kind: "Lámina", credit: { name: "Albrecht Dürer", url: "https://www.metmuseum.org/art/collection/search/336229" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/nosotros": { src: "/secciones/paginas/nosotros.jpg", alt: "«El molino», aguafuerte de Rembrandt de 1641", kind: "Lámina", credit: { name: "Rembrandt van Rijn", url: "https://clevelandart.org/art/1941.657" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "paginas/filosofia": { src: "/secciones/paginas/filosofia.jpg", alt: "«La escuela de Atenas», grabado de Volpato según el fresco de Rafael", kind: "Lámina", credit: { name: "Giovanni Volpato", url: "https://www.metmuseum.org/art/collection/search/716834" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/metodos-y-fuentes": { src: "/secciones/paginas/metodos-y-fuentes.jpg", alt: "Un sabio en su estudio («Fausto»), aguafuerte de Rembrandt", kind: "Lámina", credit: { name: "Rembrandt", url: "https://www.metmuseum.org/art/collection/search/373045" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/explore": { src: "/secciones/paginas/explore.jpg", alt: "Naturaleza muerta japonesa con un catalejo y una rama de cerezo", kind: "Lámina", credit: { name: "Katsushika Hokusai", url: "https://www.metmuseum.org/art/collection/search/54435" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/atlas": { src: "/secciones/paginas/atlas.jpg", alt: "Un globo terráqueo de 1828", kind: "Foto", credit: { name: "James Wilson", url: "https://www.metmuseum.org/art/collection/search/8487" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/lectura": { src: "/secciones/paginas/lectura.jpg", alt: "Una mujer lee, dibujo de Rembrandt", kind: "Lámina", credit: { name: "Rembrandt", url: "https://www.metmuseum.org/art/collection/search/347891" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "paginas/regalar": { src: "/secciones/paginas/regalar.jpg", alt: "Preparativos para el año nuevo, grabado japonés de felicitación", kind: "Lámina", credit: { name: "Totoya Hokkei", url: "https://www.metmuseum.org/art/collection/search/54516" }, source: { name: "The Met", url: "https://www.metmuseum.org/" } },
  "zodiaco-chino/hub": { src: "/secciones/zodiaco-chino/hub.jpg", alt: "Las doce figuras funerarias chinas del zodíaco, de cerámica, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/rata": { src: "/secciones/zodiaco-chino/rata.jpg", alt: "Figura funeraria china de cerámica con cabeza de rata, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.1" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/buey": { src: "/secciones/zodiaco-chino/buey.jpg", alt: "Figura funeraria china de cerámica con cabeza de buey, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.2" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/tigre": { src: "/secciones/zodiaco-chino/tigre.jpg", alt: "Figura funeraria china de cerámica con cabeza de tigre, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.3" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/gato": { src: "/secciones/zodiaco-chino/gato.jpg", alt: "Figura funeraria china de cerámica con cabeza de liebre (el Gato o Conejo), siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.4" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/dragon": { src: "/secciones/zodiaco-chino/dragon.jpg", alt: "Figura funeraria china de cerámica con cabeza de dragón, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.5" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/serpiente": { src: "/secciones/zodiaco-chino/serpiente.jpg", alt: "Figura funeraria china de cerámica con cabeza de serpiente, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.6" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/caballo": { src: "/secciones/zodiaco-chino/caballo.jpg", alt: "Figura funeraria china de cerámica con cabeza de caballo, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.7" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/cabra": { src: "/secciones/zodiaco-chino/cabra.jpg", alt: "Figura funeraria china de cerámica con cabeza de cabra, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.8" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/mono": { src: "/secciones/zodiaco-chino/mono.jpg", alt: "Figura funeraria china de cerámica con cabeza de mono, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.9" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/gallo": { src: "/secciones/zodiaco-chino/gallo.jpg", alt: "Figura funeraria china de cerámica con cabeza de gallo, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.10" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/perro": { src: "/secciones/zodiaco-chino/perro.jpg", alt: "Figura funeraria china de cerámica con cabeza de perro, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.11" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "zodiaco-chino/cerdo": { src: "/secciones/zodiaco-chino/cerdo.jpg", alt: "Figura funeraria china de cerámica con cabeza de cerdo, siglo VI", kind: "Foto", credit: { name: "Cleveland Museum of Art", url: "https://clevelandart.org/art/1972.76.12" }, source: { name: "Cleveland Museum of Art", url: "https://www.clevelandart.org/" } },
  "luna/nueva": { src: "/secciones/luna/nueva.jpg", alt: "Luna nueva, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000872" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/creciente": { src: "/secciones/luna/creciente.jpg", alt: "Luna creciente, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000865" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/cuarto-creciente": { src: "/secciones/luna/cuarto-creciente.jpg", alt: "Luna en cuarto creciente, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000866" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/gibosa-creciente": { src: "/secciones/luna/gibosa-creciente.jpg", alt: "Luna gibosa creciente, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000867" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/llena": { src: "/secciones/luna/llena.jpg", alt: "Luna llena, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000868" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/gibosa-menguante": { src: "/secciones/luna/gibosa-menguante.jpg", alt: "Luna gibosa menguante, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000869" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/cuarto-menguante": { src: "/secciones/luna/cuarto-menguante.jpg", alt: "Luna en cuarto menguante, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000870" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
  "luna/menguante": { src: "/secciones/luna/menguante.jpg", alt: "Luna menguante, visualización de la NASA", kind: "Imagen", credit: { name: "NASA", url: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000871" }, source: { name: "NASA", url: "https://images.nasa.gov/" } },
};

/** "Géminis" → "geminis": la clave de imagen de un signo. */
export function signImageKey(name: string): string {
  return `astrologia/${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`;
}

/** "Dragón" → "zodiaco-chino/dragon": la clave de imagen de un animal. */
export function animalImageKey(name: string): string {
  return `zodiaco-chino/${name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`;
}

const MOON_KEYS: Record<string, string> = {
  nueva: "luna/nueva",
  creciente: "luna/creciente",
  "cuarto creciente": "luna/cuarto-creciente",
  "gibosa creciente": "luna/gibosa-creciente",
  llena: "luna/llena",
  "gibosa menguante": "luna/gibosa-menguante",
  "cuarto menguante": "luna/cuarto-menguante",
  menguante: "luna/menguante",
};

/** "Gibosa Creciente" → "luna/gibosa-creciente". */
export function moonImageKey(phase: string): string | undefined {
  return MOON_KEYS[phase.trim().toLowerCase()];
}

export function getSectionImage(key: string): SectionImage | undefined {
  return SECTION_IMAGES[key];
}
