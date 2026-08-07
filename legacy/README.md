# Legacy

Archivos descontinuados que ya no se importan desde el código activo.

## Contenido

| Archivo | Estado | Nota |
|---|---|---|
| `Journey.tsx` | Descontinuado | Reemplazado por la homepage rediseñada (Hero + SystemsPreview) |
| `ConceptsIndex.tsx` | Descontinuado | Reemplazado por la homepage rediseñada |

## Notas

- No borrar estos archivos sin confirmar que ninguna parte del código los referencia.
- `lib/data/navigation.ts` NO está acá: aún exporta `footerColumns` usado por `UniversityFooter.tsx`.
- Pueden eliminarse en un sprint futuro después de verificar con `grep -rn` que nada los importa.

## Verificación

```bash
grep -rn "Journey\|ConceptsIndex" app/ components/ lib/ | grep -v node_modules
```
