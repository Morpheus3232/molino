// Suspense para useSearchParams de esta página (antes lo daba el loading.tsx
// de la raíz, que hacía que TODAS las páginas salieran con el contenido oculto
// detrás de "Calculando patrones…" en el HTML).
export { default } from "@/components/ui/PageLoading";
