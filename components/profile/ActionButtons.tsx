"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Download, Share2, Sun, Copy } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";

interface ActionButtonsProps {
  profile: UserProfile;
}

function generateShareText(profile: UserProfile): string {
  const displayName = profile.name || "Tu Mapa";
  return `${displayName} — ${profile.archetype} · Camino ${profile.lifePath} · ${profile.sunSign} · ${profile.chineseZodiac}`;
}

function generateShareUrl(profile: UserProfile): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/profile?dob=${profile.birthDate}`;
}

function buildProfileHTML(profile: UserProfile): string {
  const display = getZodiacDisplay(profile.chineseZodiac);
  const symbol = ZODIAC_SYMBOLS[profile.sunSign] || "";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const birthFormatted = new Date(profile.birthDate + "T00:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Molino — ${profile.archetype}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0A0A0C;
    --fg: #F3F1EA;
    --muted: #A6A69C;
    --accent: #7C8CFF;
    --accent-dim: rgba(124, 140, 255, 0.12);
    --border: rgba(243, 241, 234, 0.08);
    --num: #6B4C7A;
    --ast: #2E5C8A;
    --zod: #C49A2A;
  }

  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--fg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    padding: 48px 32px;
    max-width: 720px;
    margin: 0 auto;
  }

  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }

  .hero { text-align: center; padding-bottom: 48px; border-bottom: 1px solid var(--border); }

  .archetype {
    font-family: 'Archivo Black', sans-serif;
    font-size: clamp(2.5rem, 8vw, 4rem);
    line-height: 0.92;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--fg);
    margin-top: 16px;
  }

  .subtitle {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--muted);
    margin-top: 16px;
    letter-spacing: 0.05em;
  }

  .essence {
    font-size: 1rem;
    font-style: italic;
    color: var(--muted);
    margin-top: 20px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  .section { padding: 36px 0; border-bottom: 1px solid var(--border); }
  .section:last-child { border-bottom: none; }

  .section-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
  }

  .three-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .system-card { padding: 20px; border: 1px solid var(--border); border-radius: 8px; }
  .system-card .card-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .stat-row:last-child { border-bottom: none; }
  .stat-label { font-size: 0.8rem; color: var(--muted); }
  .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600; color: var(--fg); text-align: right; }

  .list-section { margin-top: 8px; }
  .list-section h3 {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--fg);
    margin-bottom: 10px;
  }
  .list-section ul { list-style: none; }
  .list-section li {
    font-size: 0.85rem;
    color: var(--muted);
    padding: 5px 0;
    padding-left: 16px;
    position: relative;
  }
  .list-section li::before {
    content: "·";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
  }

  .footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    color: var(--muted);
    letter-spacing: 0.1em;
  }

  @media print {
    body { padding: 24px 16px; background: #fff; color: #1a1a1a; }
    .archetype { color: #1a1a1a; }
    .system-card { border-color: #ddd; }
    .stat-row { border-color: #eee; }
    .stat-value { color: #1a1a1a; }
    .stat-label { color: #666; }
    .eyebrow, .subtitle, .essence, .section-title, .list-section li, .footer { color: #666; }
    .list-section li::before { color: #7C8CFF; }
    @page { margin: 20mm; }
  }

  @media (max-width: 640px) {
    .three-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<div class="hero">
  <p class="eyebrow">Tu mapa personal</p>
  <p class="archetype">${profile.archetype}</p>
  <p class="subtitle">
    ${display.emoji} ${display.name} de ${profile.chineseZodiacInfo?.element || ""} ·
    ${symbol} ${profile.sunSign} ·
    Camino de Vida ${lifePath}
  </p>
  ${archetype ? `<p class="essence">${archetype.name} — ${profile.sunSignInfo?.element || ""} · ${profile.sunSignInfo?.modality || ""}</p>` : ""}
</div>

<div class="section">
  <p class="section-title">Numerología</p>
  <div class="system-card" style="border-left: 3px solid var(--num);">
    <div class="stat-row">
      <span class="stat-label">Camino de Vida</span>
      <span class="stat-value">${lifePath}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Expresión</span>
      <span class="stat-value">${profile.expressionNumber ?? "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Alma</span>
      <span class="stat-value">${profile.soulNumber ?? "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Personalidad</span>
      <span class="stat-value">${profile.personalityNumber ?? "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Suerte</span>
      <span class="stat-value">${profile.luckyNumber}</span>
    </div>
  </div>
</div>

<div class="section">
  <p class="section-title">Astrología</p>
  <div class="system-card" style="border-left: 3px solid var(--ast);">
    <div class="stat-row">
      <span class="stat-label">Signo Solar</span>
      <span class="stat-value">${symbol} ${profile.sunSign}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Elemento</span>
      <span class="stat-value">${profile.sunSignInfo?.element || "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Modalidad</span>
      <span class="stat-value">${profile.sunSignInfo?.modality || "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Año Personal</span>
      <span class="stat-value">${profile.cycles?.personalYear ?? "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Mes Personal</span>
      <span class="stat-value">${profile.cycles?.personalMonth ?? "—"}</span>
    </div>
  </div>
</div>

<div class="section">
  <p class="section-title">Zodíaco Chino</p>
  <div class="system-card" style="border-left: 3px solid var(--zod);">
    <div class="stat-row">
      <span class="stat-label">Animal</span>
      <span class="stat-value">${display.emoji} ${display.name}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Elemento</span>
      <span class="stat-value">${profile.chineseZodiacInfo?.element || "—"}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">Año</span>
      <span class="stat-value">${profile.birthDate.split("-")[0]}</span>
    </div>
  </div>
</div>

<div class="section">
  <p class="section-title">Fortalezas</p>
  <div class="list-section">
    <ul>
      ${(profile.recommendations?.strengths || []).map((s) => `<li>${s}</li>`).join("\n      ")}
    </ul>
  </div>
</div>

<div class="section">
  <p class="section-title">Desafíos</p>
  <div class="list-section">
    <ul>
      ${(profile.recommendations?.challenges || []).map((s) => `<li>${s}</li>`).join("\n      ")}
    </ul>
  </div>
</div>

<div class="section">
  <p class="section-title">Prácticas recomendadas</p>
  <div class="list-section">
    <ul>
      ${(profile.recommendations?.practices || []).map((s) => `<li>${s}</li>`).join("\n      ")}
    </ul>
  </div>
</div>

<div class="footer">
  <p>MOLINO — MAPA PERSONAL DE AUTOCONOCIMIENTO</p>
  <p style="margin-top:4px;">${birthFormatted} · Generado en molino.app</p>
  <p style="margin-top:4px;">Sin registro. Sin cookies. Sin servidor guardando tus datos.</p>
</div>

</body>
</html>`;
}

function downloadProfileHTML(profile: UserProfile) {
  const html = buildProfileHTML(profile);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `molino-mapa-${profile.birthDate}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export default function ActionButtons({ profile }: ActionButtonsProps) {
  const router = useRouter();
  const shareText = generateShareText(profile);
  const shareUrl = generateShareUrl(profile);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi Mapa Molino", text: shareText, url: shareUrl });
        return;
      } catch {}
    }
    await copyToClipboard(`${shareText}\n${shareUrl}`);
  };

  const handleDownload = () => downloadProfileHTML(profile);

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText}\n\nVer en Molino:`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-3 py-8 border-t border-ink/10"
      role="group"
      aria-label="Acciones para tu mapa"
    >
      <Button
        variant="primary"
        onClick={handleDownload}
        className="flex items-center gap-2"
        aria-label="Descargar mi mapa"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        Descargar mapa
      </Button>

      <Button
        variant="ghost"
        onClick={handleShare}
        className="flex items-center gap-2"
        aria-label="Compartir mi mapa"
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        Compartir
      </Button>

      <Button
        variant="ghost"
        onClick={handleTwitterShare}
        className="flex items-center gap-2"
        aria-label="Compartir en Twitter"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter
      </Button>

      <Link
        href="/hoy"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        <Sun className="w-4 h-4" aria-hidden="true" />
        Energía de hoy
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(shareUrl)}
        className="flex items-center gap-1"
        aria-label="Copiar enlace al perfil"
      >
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Enlace</span>
      </Button>
    </motion.div>
  );
}