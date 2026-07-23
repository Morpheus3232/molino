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
      title: 'Compatibilidad no encontrada | Molino',
      description: 'La entidad que buscas no existe en nuestra base de datos.',
    };
  }

  const description = `Descubrí tu compatibilidad con ${entity.name}. Análisis basado en numerología, astrología y zodiaco chino. Molino — Inteligencia Personal.`;

  return {
    title: `Compatibilidad con ${entity.name} | Molino`,
    description,
    openGraph: {
      title: `Compatibilidad con ${entity.name} | Molino`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Compatibilidad con ${entity.name}`,
      description,
    },
    keywords: [
      entity.name,
      'compatibilidad',
      'numerología',
      'astrología',
      'zodiaco chino',
      'identidad',
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
