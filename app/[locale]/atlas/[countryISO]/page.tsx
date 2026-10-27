import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localeAlternates, localeUrl } from "@/lib/seo";
import {
  getAllCountryISOs,
  getCategoriesByCountry,
  getCountryName,
  isoToFlagEmoji,
  getCitiesByCountry,
  getCountryEntityByISO,
} from "@/lib/data/atlas-queries";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";
import CountryHubClient from "@/components/atlas/CountryHubClient";

interface Props {
  params: Promise<{ countryISO: string }>;
}

// Todos los países se pre-generan; cualquier otro ISO resuelve a 404 real.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllCountryISOs().map((countryISO) => ({ countryISO }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { countryISO } = await params;
  const nameEs = getCountryName(countryISO.toUpperCase());
  if (!nameEs) return { title: L("País no encontrado", "Country not found") };
  const name = L.t(nameEs);
  const path = `/atlas/${countryISO.toUpperCase()}`;
  const title = L(`Atlas de ${name} — Afinidades`, `Atlas of ${name} — Affinities`);
  return {
    title,
    description: L(
      `Explorá las afinidades simbólicas de ${name}: ciudades, clubes, universidades, marcas y famosos según el zodíaco chino.`,
      `Explore the symbolic affinities of ${name}: cities, universities, brands and famous people according to the Chinese zodiac.`,
    ),
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title,
      description: L(`Explorá las afinidades simbólicas de ${name} según el zodíaco chino.`, `Explore the symbolic affinities of ${name} according to the Chinese zodiac.`),
      type: "website",
      url: localeUrl(path, L.locale),
    },
  };
}

export default async function CountryPage({ params }: Props) {
  await initLocale(params);
  const { countryISO } = await params;
  const valid = getAllCountryISOs().includes(countryISO.toUpperCase());
  if (!valid) notFound();

  const iso = countryISO.toUpperCase();
  const name = getCountryName(iso);
  const categories = getCategoriesByCountry(iso);
  const cities = getCitiesByCountry(iso);
  const countryEntity = getCountryEntityByISO(iso);
  const flagEmoji = isoToFlagEmoji(iso);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <AtlasBreadcrumbs
          crumbs={[{ href: "/atlas", label: "Atlas" }, { label: name }]}
        />

        <CountryHubClient
          countryISO={iso}
          countryName={name}
          flagEmoji={flagEmoji}
          categories={categories}
          cities={cities}
          countryEntity={countryEntity}
        />
      </div>
    </main>
  );
}
