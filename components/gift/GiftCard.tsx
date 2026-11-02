"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { Printer } from "lucide-react";
import { useL } from "@/lib/i18n/useL";

/**
 * Tarjeta de regalo para imprimir (o guardar como PDF desde el diálogo de
 * impresión). Todo pasa en el navegador: el QR se dibuja acá y los campos
 * "Para" y "De" no se mandan a ningún lado.
 */
export default function GiftCard({ code, url }: { code: string; url: string }) {
  const L = useL();
  const [qr, setQr] = useState<string>("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  // La copia para imprimir va directo en <body>: así la impresión es una sola hoja.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let alive = true;
    QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0A0A0A", light: "#FFFFFF" } })
      .then((svg) => alive && setQr(svg))
      .catch(() => alive && setQr(""));
    return () => {
      alive = false;
    };
  }, [url]);

  const card = (
    <div className="molino-gift-card bg-white text-[#0A0A0A] border-2 border-ink flex flex-col" style={{ aspectRatio: "210 / 148" }}>
      <div className="bg-vermilion text-white px-[5%] py-[3%] flex items-baseline justify-between">
        <span className="font-display text-[clamp(1.1rem,3.4vw,1.9rem)] leading-none">molino</span>
        <span className="label-caps text-[clamp(0.6rem,1.6vw,0.85rem)]">{L("Un regalo", "A gift")}</span>
      </div>
      <div className="flex-1 grid grid-cols-[1fr_auto] gap-[5%] px-[5%] py-[4%] items-center">
        <div className="min-w-0">
          {to && <p className="italic text-[clamp(0.9rem,2.4vw,1.25rem)] text-[#0A0A0A]">{L(`Para ${to}`, `For ${to}`)}</p>}
          <p className="mt-1 font-display text-[clamp(1.2rem,4vw,2.3rem)] leading-tight text-[#0A0A0A]">
            {L("Tu mapa completo: números, astros y signo chino", "Your complete map: numbers, stars and Chinese sign")}
          </p>
          <p className="mt-[3%] text-[clamp(0.7rem,1.8vw,0.95rem)] text-[#474747]">
            {L(
              "Escaneá el código o entrá a la dirección, y escribí tu fecha de nacimiento. Es tuyo para siempre.",
              "Scan the code or open the address, and enter your date of birth. It's yours forever.",
            )}
          </p>
          <p className="mt-[3%] font-mono text-[clamp(0.85rem,2.4vw,1.3rem)] tracking-wider text-[#0A0A0A]">{code}</p>
          <p className="text-[clamp(0.6rem,1.5vw,0.8rem)] text-[#474747] break-all">{url.replace(/^https?:\/\//, "")}</p>
          {from && <p className="mt-[3%] italic text-[clamp(0.85rem,2.2vw,1.15rem)] text-[#0A0A0A]">{L(`De parte de ${from}`, `From ${from}`)}</p>}
        </div>
        <div
          className="w-[clamp(5rem,22vw,9.5rem)] aspect-square [&>svg]:w-full [&>svg]:h-full"
          aria-label={L("Código QR del regalo", "Gift QR code")}
          role="img"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
      </div>
      <div className="border-t border-ink/20 px-[5%] py-[2%] text-[clamp(0.55rem,1.4vw,0.75rem)] text-[#474747] italic">
        {L("«Yo sé quién soy» — Cervantes", "“I know who I am” — Cervantes")}
      </div>
    </div>
  );

  return (
    <section className="mt-10 text-left" aria-labelledby="tarjeta-regalo">
      <style>{`
        @media print {
          @page { size: A5 landscape; margin: 0; }
          body > *:not(.molino-gift-print) { display: none !important; }
          .molino-gift-print { display: block !important; }
          .molino-gift-print .molino-gift-card { border: 0 !important; width: 100vw; height: 100vh; aspect-ratio: auto !important; }
        }
        @media screen { .molino-gift-print { display: none; } }
      `}</style>
      <p id="tarjeta-regalo" className="text-sm text-muted mb-2 label-caps">
        {L("Tarjeta para imprimir", "Printable card")}
      </p>
      <div className="molino-gift-noprint grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <label className="block text-sm text-muted">
          {L("Para", "To")}
          <input
            value={to}
            onChange={(e) => setTo(e.target.value.slice(0, 40))}
            className="mt-1 w-full border border-ink/20 bg-background px-3 py-2 text-base text-foreground"
            placeholder={L("su nombre", "their name")}
          />
        </label>
        <label className="block text-sm text-muted">
          {L("De", "From")}
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value.slice(0, 40))}
            className="mt-1 w-full border border-ink/20 bg-background px-3 py-2 text-base text-foreground"
            placeholder={L("tu nombre", "your name")}
          />
        </label>
      </div>

      {card}
      {mounted && createPortal(<div className="molino-gift-print">{card}</div>, document.body)}

      <button
        type="button"
        onClick={() => window.print()}
        className="molino-gift-noprint mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-ink text-sm font-bold label-caps hover:bg-ink hover:text-paper transition-colors"
      >
        <Printer className="w-4 h-4" aria-hidden="true" />
        {L("Imprimir o guardar en PDF", "Print or save as PDF")}
      </button>
    </section>
  );
}
