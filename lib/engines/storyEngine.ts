"use client";

import { UserProfile } from "@/types/user";
import { EntityProfile } from "@/lib/data/entities";
import { ARCHETYPES } from "@/lib/data/archetypes";

export interface MatchStory {
  narrative: string;
  connections: string[];
  challenges: string[];
}

export function generateMatchStory(
  user: UserProfile,
  entity: EntityProfile,
  score: number
): MatchStory {
  const archetype = ARCHETYPES[user.lifePath] || ARCHETYPES[1];
  
  const narrative = `Tu energía de ${archetype.name} resuena con la esencia de ${entity.name}. 
    ${score >= 80 ? 'Esta es una conexión excepcional que puede ser profundamente transformadora.' :
    score >= 60 ? 'Hay una alineación natural que puede crecer con el tiempo.' :
    score >= 40 ? 'Existen puntos de conexión genuina que merecen ser explorados.' :
    'Esta relación puede ofrecer aprendizajes valiosos, aunque requiere trabajo consciente.'}`;

  const connections = [
    `Comparten una visión de ${entity.context.keyThemes[0] || 'crecimiento'}`,
    `Tu ${archetype.name} encuentra en ${entity.name} un espejo de cualidades que valoras`,
    `La energía de ${entity.name} complementa tu camino de ${archetype.name.toLowerCase()}`
  ];

  const challenges = [
    `Puede haber tensiones en torno a ${entity.context.keyThemes[1] || 'la dirección'}`,
    `Tu necesidad de ${archetype.keywords[0] || 'independencia'} podría chocar con la energía de ${entity.name}`,
    `Es importante mantener el equilibrio entre ${archetype.keywords[1] || 'acción'} y ${entity.context.keyThemes[2] || 'reflexión'}`
  ];

  return { narrative, connections, challenges };
}
