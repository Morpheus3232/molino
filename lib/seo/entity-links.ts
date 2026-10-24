/**
 * Fichas del Atlas sin fecha exacta van noindex (no se puede afirmar el signo,
 * ver generateMetadata de /affinity/[type]/[slug]). Los enlaces internos a
 * esas fichas llevan rel="nofollow": la persona igual puede abrirlas, pero
 * Google no gasta su rastreo en cientos de páginas que no va a indexar y lo
 * dedica a las que sí. `originDate` viaja en la entidad liviana solo cuando
 * la fecha es exacta, así que es el mismo criterio que el noindex.
 */
export function entityLinkRel(entity: { originDate?: string }): "nofollow" | undefined {
  return entity.originDate ? undefined : "nofollow";
}
