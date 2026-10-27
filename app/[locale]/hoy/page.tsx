import { useL } from "@/lib/i18n/useL";
import HoyClient from "./HoyClient";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Hoy — Tu Energía y Foco Diario", "Today — Your Daily Energy and Focus"],
  description:
    ["Descubrí tu vibración diaria, fase lunar, foco de acción y consejo del momento en Molino. 100% calculado en tu navegador.", "Discover your daily vibration, moon phase, focus for action and advice for the moment on Molino. 100% calculated in your browser."],
  path: "/hoy",
  ogTitle: ["Tu Energía de Hoy", "Your Energy Today"],
  ogDescription: ["Vibración diaria, vista de 3 días y foco de acción según tu numerología y astrología.", "Daily vibration, 3-day view and focus for action according to your numerology and astrology."],
});

export default function HoyPage() {
  const L = useL();
  return (
    <HoyClient
      heading={
        <h1 className="font-display font-normal text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] tracking-tight text-foreground">{L("Tu energía de hoy", "Your energy today")}</h1>
      }
    />
  );
}
