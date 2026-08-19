export interface DecisionIntent {
  kind: 'accion' | 'espera' | 'revisar';
  label: string;
  domain?: string;
  confidence: number;
}

const ACCION_VERBS = ['aceptar', 'comprar', 'cambiar', 'lanzar', 'iniciar', 'empezar', 'firmar', 'mudar', 'crear', 'publicar', 'contratar', 'invertir', 'pedir', 'viajar'];
const ESPERA_VERBS = ['esperar', 'espera', 'postergar', 'aguardar', 'aplazar', 'posponer'];
const REVISAR_VERBS = ['dejar', 'renunciar', 'terminar', 'abandonar', 'cerrar', 'quitar'];

const DOMAIN_WORDS: Record<string, string[]> = {
  career: ['trabajo', 'trabajar', 'oferta', 'puesto', 'sueldo', 'salario', 'proyecto', 'empleo', 'empresa'],
  personal: ['casa', 'hogar', 'mudanza', 'lugar', 'ciudad', 'vecindario', 'barrio'],
  finances: ['auto', 'coche', 'compra', 'inversion', 'capital', 'gastar', 'pagar', 'dinero'],
  relationships: ['relacion', 'pareja', 'novio', 'novia', 'casar', 'boda'],
  health: ['salud', 'cuerpo', 'gimnasio', 'operacion', 'medico', 'dieta'],
  education: ['estudiar', 'carrera', 'curso', 'universidad', 'facultad', 'examen'],
  travel: ['viaje', 'viajar', 'vacaciones', 'destino', 'vuelo'],
  creativity: ['proyecto', 'idea', 'arte', 'diseno', 'escribir', 'publicar', 'lanzar'],
};

const KIND_LABELS: Record<DecisionIntent['kind'], string> = {
  accion: 'acción / iniciar',
  espera: 'espera',
  revisar: 'revisar / cesar',
};

export function normalizeQuestion(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function hasWord(text: string, word: string): boolean {
  const re = new RegExp(`\\b${word}\\b`);
  return re.test(text);
}

export function detectDecisionIntent(question: string, category: string): DecisionIntent | null {
  const normalized = normalizeQuestion(question);
  if (!normalized) return null;

  const candidates: Array<[DecisionIntent['kind'], string[]]> = [
    ['espera', ESPERA_VERBS],
    ['accion', ACCION_VERBS],
    ['revisar', REVISAR_VERBS],
  ];

  let kind: DecisionIntent['kind'] | null = null;
  for (const [candidateKind, verbs] of candidates) {
    if (verbs.some((v) => hasWord(normalized, v))) {
      kind = candidateKind;
      break;
    }
  }

  if (!kind) return null;

  const domainWords = DOMAIN_WORDS[category] || [];
  const matchedDomains = domainWords.filter((w) => hasWord(normalized, w));

  let confidence = 0.7;
  let domain: string | undefined;
  if (matchedDomains.length > 0) {
    domain = matchedDomains.join(', ');
    confidence += 0.15;
  }
  confidence = Math.min(1, confidence);

  const label = domain ? `${KIND_LABELS[kind]} · ${domain}` : KIND_LABELS[kind];

  return { kind, label, domain, confidence };
}
