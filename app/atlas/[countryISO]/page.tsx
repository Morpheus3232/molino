import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
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

export async function generateStaticParams() {
  return getAllCountryISOs().map((countryISO) => ({ countryISO }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryISO } = await params;
  const name = getCountryName(countryISO.toUpperCase());
  if (!name) return { title: "País no encontrado" };
  const canonical = siteUrl(`/atlas/${countryISO.toUpperCase()}`);
  return {
    title: `Atlas de ${name} — Afinidades`,
    description: `Explorá las afinidades simbólicas de ${name}: ciudades, clubes, universidades, marcas y famosos según el zodíaco chino.`,
    alternates: { canonical },
    openGraph: {
      title: `Atlas de ${name} — Afinidades`,
      description: `Explorá las afinidades simbólicas de ${name} según el zodíaco chino.`,
      type: "website",
      url: canonical,
    },
  };
}

export default async function CountryPage({ params }: Props) {
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
