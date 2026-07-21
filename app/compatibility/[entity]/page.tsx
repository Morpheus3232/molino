import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CompatibilityLab from '@/components/lab/CompatibilityLab';
import { ENTITIES } from '@/lib/data/entities';
import { calculateUserProfile, calculateCompatibility } from '@/lib/engines/compatibilityEngine';
import { generateSEOInterpretation } from '@/lib/engines/aiEngine';

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

  const user = calculateUserProfile('Usuario', '1995-12-25');
  const compat = calculateCompatibility(user, {
    lifePath: entity.symbolism.lifePath || 5,
    sunSign: entity.symbolism.sunSign,
    chineseZodiac: entity.symbolism.chineseZodiac,
    archetype: entity.symbolism.archetype,
    element: entity.symbolism.element,
    name: entity.name,
  });
  const seoDescription = generateSEOInterpretation(user, entity, compat);

  return {
    title: `Compatibilidad con ${entity.name} | Molino — Identity Lab`,
    description: seoDescription,
    openGraph: {
      title: `Compatibilidad con ${entity.name} | Molino`,
      description: seoDescription,
      type: 'website',
      images: [
        {
          url: `https://molino.app/api/og?entity=${entity.id}`,
          width: 1200,
          height: 630,
          alt: `Compatibilidad con ${entity.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Compatibilidad con ${entity.name}`,
      description: seoDescription,
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

  const user = calculateUserProfile('Usuario', '1995-12-25');
  const compat = calculateCompatibility(user, {
    lifePath: entity.symbolism.lifePath || 5,
    sunSign: entity.symbolism.sunSign,
    chineseZodiac: entity.symbolism.chineseZodiac,
    archetype: entity.symbolism.archetype,
    element: entity.symbolism.element,
    name: entity.name,
  });
  const seoDescription = generateSEOInterpretation(user, entity, compat);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[430px] px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-foreground transition-colors">Inicio</a>
          <span>›</span>
          <a href="/compatibility" className="hover:text-foreground transition-colors">Compatibilidad</a>
          <span>›</span>
          <span className="text-foreground font-medium">{entity.name}</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{entity.emoji}</span>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Compatibilidad con {entity.name}
            </h1>
            <p className="text-sm text-muted">
              {entity.category} · {entity.context.keyThemes.slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>

        <CompatibilityLab 
          user={user} 
          entity={entity} 
          template={`Analiza la compatibilidad desde la perspectiva de ${entity.category}.`}
        />

        <div className="mt-8 p-4 bg-card rounded-xl border border-card-border text-center space-y-2">
          <p className="text-xs text-muted">
            Descubrí tu compatibilidad con {entity.name} a través de {entity.category}
          </p>
          <p className="text-xs text-muted/70">
            Análisis basado en numerología, astrología occidental, zodiaco chino y arquetipos.
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: `Compatibilidad con ${entity.name}`,
              description: seoDescription,
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://molino.app/' },
                  { '@type': 'ListItem', position: 2, name: 'Compatibilidad', item: 'https://molino.app/compatibility' },
                  { '@type': 'ListItem', position: 3, name: entity.name, item: `https://molino.app/compatibility/${entity.id}` },
                ],
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
