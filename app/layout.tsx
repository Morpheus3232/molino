// El layout raíz real (con <html lang>) vive en app/[locale]/layout.tsx: el
// idioma sale de la URL. Este solo existe porque Next exige uno en app/.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
