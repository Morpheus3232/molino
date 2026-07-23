import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ENTITIES } from '@/lib/data/entities';
import CompatibilityContent from '@/components/compatibility/CompatibilityContent';

export async function generateStaticParams() {
  return ENTITIES.map((entity) => ({
    entity: entity.id,
  }));
}

export async function generateMetadata({ params }: { params: { entity: string } }): Promise<Metadata> {
  const entity = ENTITIES.find(e => e.id === params.entity);
  if (!entity) {
    return {
      title: 'Compatibilidad no encontrada | Molino',
      description: 'La entidad que buscas no existe en nuestra base de datos.',
    };
  }

  const description = `Descubrí tu compatibilidad con ${entity.name}. Análisis basado en numerología, astrología y zodiaco chino. Molino — Personal Intelligence Platform.`;

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

export default function CompatibilityPage({ params }: { params: { entity: string } }) {
  const entity = ENTITIES.find(e => e.id === params.entity);
  if (!entity) notFound();

  return <CompatibilityContent entity={entity} />;
}
