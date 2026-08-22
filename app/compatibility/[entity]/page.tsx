import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { siteUrl } from '@/lib/seo';
import { ENTITIES } from '@/lib/data/entities';
import CompatibilityContent from '@/components/compatibility/CompatibilityContent';

export async function generateStaticParams() {
  return ENTITIES.map((entity) => ({
    entity: entity.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ entity: string }> }): Promise<Metadata> {
  const { entity: entityId } = await params;
  const entity = ENTITIES.find(e => e.id === entityId);
  if (!entity) {
    return {
      title: 'Análisis no encontrado',
      description: 'La entidad que buscas no existe en nuestra base de datos.',
    };
  }

  const description = `Compatibilidad simbólica con ${entity.name}: numerología, astrología y zodíaco chino. Mapa personal de autoconocimiento.`;

  return {
    title: `Análisis multi-factor de ${entity.name}`,
    description,
    alternates: {
      canonical: siteUrl(`/compatibility/${entityId}`),
    },
    openGraph: {
      title: `Análisis multi-factor de ${entity.name}`,
      description,
      type: 'website',
      url: siteUrl(`/compatibility/${entityId}`),
    },
    twitter: {
      card: 'summary_large_image',
      title: `Análisis multi-factor de ${entity.name}`,
      description,
    },
    keywords: [
      entity.name,
      'análisis multi-factor',
      'compatibilidad',
      'numerología',
      'astrología',
      'zodiaco chino',
      'arquetipos',
      ...entity.context.keyThemes,
    ],
  };
}

export default async function CompatibilityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: entityId } = await params;
  const entity = ENTITIES.find(e => e.id === entityId);
  if (!entity) notFound();

  return <CompatibilityContent entity={entity} />;
}
