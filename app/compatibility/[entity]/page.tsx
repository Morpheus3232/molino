import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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
      title: 'Análisis no encontrado | Molino',
      description: 'La entidad que buscas no existe en nuestra base de datos.',
    };
  }

  const description = `Análisis profundo de compatibilidad con ${entity.name} usando numerología, astrología occidental y zodiaco chino. Molino — Inteligencia Personal.`;

  return {
    title: `Análisis multi-factor de ${entity.name} | Molino`,
    description,
    openGraph: {
      title: `Análisis multi-factor de ${entity.name} | Molino`,
      description,
      type: 'website',
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
