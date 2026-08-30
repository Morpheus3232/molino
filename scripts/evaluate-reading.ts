#!/usr/bin/env npx tsx
/**
 * Reading Quality Evaluation Harness
 *
 * Generates representative profiles, computes deterministic synthesis,
 * validates synthesis integrity, and optionally calls the AI interpret
 * endpoint to produce Readings for human evaluation.
 *
 * Usage:
 *   npx tsx scripts/evaluate-reading.ts                    # dry run (synthesis only)
 *   npx tsx scripts/evaluate-reading.ts --api               # with AI (needs env vars)
 *   npx tsx scripts/evaluate-reading.ts --api --model X      # override model
 *   npx tsx scripts/evaluate-reading.ts --profile idx        # single profile by index
 *   npx tsx scripts/evaluate-reading.ts --validate           # validate synthesis only
 *
 * Output goes to evaluation-results/reading-eval-<timestamp>/
 *
 * Requires: tsx (already in devDependencies), node fetch.
 * API mode requires: OPENROUTER_API_KEY or OPENAI_API_KEY or ANTHROPIC_API_KEY.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { calculateUserProfile } from "../lib/engines/profileBuilder";
import { buildSynthesis } from "../lib/engines/synthesisEngine";
import {
  buildMolinoContext,
  buildIntelligencePrompt,
} from "../lib/engines/intelligenceEngine";
import { hashProfile } from "../lib/mercadopago";
import type { UserProfile } from "../types/user";

// ── Representative profiles ──────────────────────────────────────────
// Covers: different Life Paths (1-9, 11, 22), solar elements, Chinese
// animals, modalities, edge cases (no convergence, 3-system convergence,
// thermal tension). Birth dates chosen to produce diverse combinations.

interface ProfileFixture {
  name: string;
  dob: string;
  note: string;
  expectedTags?: string[];
}

const FIXTURES: ProfileFixture[] = [
  // Life Path 1 (Aries/Caballo — all Fire, strong convergence)
  { name: "Lucía Fernández", dob: "1990-03-28", note: "LP1 + Aries + Caballo Madera — fuego puro, convergencia 3 sistemas" },
  // Life Path 4 (Virgo/Tigre — Earth + Wood, tension possible)
  { name: "Martín García", dob: "1985-09-05", note: "LP4 + Virgo + Tigre Tierra — tierra organizada vs tigre impulsivo" },
  // Life Path 7 (Piscis/Rata — intuición, agua + agua)
  { name: "Camila Rodríguez", dob: "1998-02-14", note: "LP7 + Piscis + Rata Agua — introspección profunda" },
  // Life Path 5 (Libra/Perro — aire + metal, diplomacia)
  { name: "Diego López", dob: "1992-10-20", note: "LP5 + Libra + Perro Metal — equilibrio y relaciones" },
  // Life Path 8 (Capricornio/Búfalo — tierra + tierra, estructura)
  { name: "Ana Martínez", dob: "1988-01-08", note: "LP8 + Capricornio + Búfalo Tierra — ambición y disciplina" },
  // Life Path 3 (Leo/Dragón — fuego + fuego, expresión)
  { name: "Pablo Sánchez", dob: "1995-08-15", note: "LP3 + Leo + Dragón Fuego — creatividad explosiva" },
  // Life Path 11 (Géminis/Serpiente — maestro, aire + fuego)
  { name: "Valentina Díaz", dob: "1993-06-01", note: "LP11 + Géminis + Serpiente Fuego — número maestro, comunicación" },
  // Life Path 2 (Cáncer/Cabra — agua + tierra, cuidado)
  { name: "Roberto Hernández", dob: "1987-07-12", note: "LP2 + Cáncer + Cabra Tierra — vínculos y protección" },
  // Life Path 9 (Escorpio/Cerdo — agua profunda, transformación)
  { name: "Sofía Torres", dob: "1996-11-08", note: "LP9 + Escorpio + Cerdo Agua — intensidad y cierre de ciclos" },
  // Life Path 6 (Tauro/Mono — tierra + metal, armonía vs ingenio)
  { name: "Carlos Ramírez", dob: "1991-04-25", note: "LP6 + Tauro + Mono Metal — responsabilidad vs juego" },
  // Life Path 22 (Acuario/Gallo — maestro, aire + metal, visión)
  { name: "Isabella Moreno", dob: "1990-01-30", note: "LP22 + Acuario + Gallo Metal — número maestro, visión humanitaria" },
  // Life Path 4 (Sagitario/Caballo — fuego + fuego, aventura)
  { name: "Mateo Ruiz", dob: "1994-12-10", note: "LP4 + Sagitario + Caballo Fuego — estructura vs libertad (tensión)" },
  // Life Path 1 (Aries/Cerdo — fuego + agua, thermal tension)
  { name: "Julia Fernández", dob: "1999-04-05", note: "LP1 + Aries + Cerdo Agua — tensión térmica fuego/agua" },
  // Life Path 5 (Virgo/Búfalo — tierra + tierra, análisis profundo)
  { name: "Andrés Gutiérrez", dob: "1989-08-22", note: "LP5 + Virgo + Búfalo Tierra — analítico pero en movimiento" },
  // Life Path 8 (Piscis/Tigre — agua + madera, ambición espiritual)
  { name: "Luciana Vargas", dob: "1997-03-15", note: "LP8 + Piscis + Tigre Madera — poder intuitivo" },
];

// ── Validation ───────────────────────────────────────────────────────

interface ValidationResult {
  profileName: string;
  dob: string;
  passed: boolean;
  checks: { name: string; ok: boolean; detail: string }[];
  synthesisStats: {
    patternsCount: number;
    convergencesCount: number;
    tensionsCount: number;
    rulesCount: number;
    uncertaintiesCount: number;
    systemsEngaged: string[];
    hasCircularSources: boolean;
  };
}

function validateSynthesis(
  name: string,
  dob: string,
  synthesis: ReturnType<typeof buildSynthesis>
): ValidationResult {
  const checks: ValidationResult["checks"] = [];

  // 1. Coordinates present
  checks.push({
    name: "coordinates_present",
    ok: !!synthesis.coordinates,
    detail: synthesis.coordinates ? `LP=${synthesis.coordinates.lifePath} Sun=${synthesis.coordinates.sunSign} Animal=${synthesis.coordinates.chineseAnimal}` : "missing",
  });

  // 2. Patterns non-empty
  checks.push({
    name: "patterns_non_empty",
    ok: synthesis.patterns.length > 0,
    detail: `${synthesis.patterns.length} patterns`,
  });

  // 3. No circular sources in patterns
  const hasCircular = synthesis.patterns.some((p) => {
    const signals = p.sources.map((s) => {
      const map: Record<string, string> = { Numerología: "lifePath", Arquetipos: "lifePath", Ciclos: "personalCycle", Astrología: "sunSign", "Zodiaco Chino": "chineseZodiac" };
      return map[s] ?? s;
    });
    return new Set(signals).size < signals.length;
  });
  checks.push({
    name: "no_circular_sources",
    ok: !hasCircular,
    detail: hasCircular ? "CIRCULAR SOURCES FOUND" : "clean",
  });

  // 4. Tensions: 0-3 is valid
  checks.push({
    name: "tensions_valid_count",
    ok: synthesis.tensions.length <= 3,
    detail: `${synthesis.tensions.length} tensions (0-3 expected)`,
  });

  // 5. Rules: at least 1
  checks.push({
    name: "rules_non_empty",
    ok: synthesis.rules.length > 0,
    detail: `${synthesis.rules.length} rules`,
  });

  // 6. Uncertainties: always 4 (luna, expresión, ascendente, naturaleza simbólica)
  checks.push({
    name: "uncertainties_complete",
    ok: synthesis.uncertainties.length >= 3,
    detail: `${synthesis.uncertainties.length} uncertainties`,
  });

  // 7. SystemsEngaged: at least 1
  checks.push({
    name: "systems_engaged",
    ok: synthesis.systemsEngaged.length > 0,
    detail: synthesis.systemsEngaged.join(", ") || "none",
  });

  // 8. Convergences: 0 is valid (honest), >0 is good
  checks.push({
    name: "convergences_count",
    ok: true, // always valid — 0 is honest
    detail: `${synthesis.convergences.length} convergences`,
  });

  // 9. Each pattern has non-empty fields
  const emptyPatterns = synthesis.patterns.filter(
    (p) => !p.label || !p.keyword || !p.description || p.sources.length === 0
  );
  checks.push({
    name: "patterns_complete",
    ok: emptyPatterns.length === 0,
    detail: emptyPatterns.length === 0 ? "all patterns complete" : `${emptyPatterns.length} incomplete patterns`,
  });

  // 10. Tension implications non-empty
  const emptyTensions = synthesis.tensions.filter((t) => !t.implication || !t.evidence);
  checks.push({
    name: "tensions_have_implication",
    ok: emptyTensions.length === 0,
    detail: emptyTensions.length === 0 ? "all tensions have implication" : `${emptyTensions.length} empty implications`,
  });

  const passed = checks.every((c) => c.ok);

  return {
    profileName: name,
    dob,
    passed,
    checks,
    synthesisStats: {
      patternsCount: synthesis.patterns.length,
      convergencesCount: synthesis.convergences.length,
      tensionsCount: synthesis.tensions.length,
      rulesCount: synthesis.rules.length,
      uncertaintiesCount: synthesis.uncertainties.length,
      systemsEngaged: synthesis.systemsEngaged,
      hasCircularSources: hasCircular,
    },
  };
}

// ── Prompt generation ────────────────────────────────────────────────

function generatePrompt(profile: UserProfile, synthesis: ReturnType<typeof buildSynthesis>): string {
  const context = buildMolinoContext(profile, {});
  return buildIntelligencePrompt({
    type: "personal_profile",
    context,
    synthesis,
  });
}

// ── API call ─────────────────────────────────────────────────────────

async function callInterpret(
  profile: UserProfile,
  prompt: string,
  modelOverride?: string
): Promise<{ raw: string; model: string; durationMs: number; status: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("No API key found in env");

  const provider = process.env.OPENROUTER_API_KEY
    ? "openrouter"
    : process.env.OPENAI_API_KEY
      ? "openai"
      : "anthropic";

  const model = modelOverride || process.env.OPENROUTER_MODEL || "deepseek/deepseek-v4-flash";
  const start = Date.now();

  if (provider === "openrouter") {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 6000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(60_000),
    });
    const data = await res.json() as any;
    const raw = data.choices?.[0]?.message?.content || "";
    return { raw, model, durationMs: Date.now() - start, status: res.ok ? "ok" : `error_${res.status}` };
  }

  throw new Error(`Provider ${provider} not yet wired in harness — add it here`);
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const apiMode = args.includes("--api");
  const validateOnly = args.includes("--validate");
  const profileIdx = args.includes("--profile") ? parseInt(args[args.indexOf("--profile") + 1]) : undefined;
  const modelOverride = args.includes("--model") ? args[args.indexOf("--model") + 1] : process.env.AI_HEAVY_MODEL;

  const outDir = join(process.cwd(), "evaluation-results", `reading-eval-${Date.now()}`);
  mkdirSync(outDir, { recursive: true });

  const v2Enabled = process.env.INTELLIGENCE_ENGINE_V2_ENABLED === "true";
  if (!v2Enabled) {
    console.warn("\n⚠️  INTELLIGENCE_ENGINE_V2_ENABLED no está activo. Las lecturas paga se generarían con el builder legacy (sin buildSynthesis canónico ni blindSpot/lifeAreas). Activá el flag antes de una corrida con API.\n");
  }

  const fixtures = profileIdx !== undefined ? [FIXTURES[profileIdx]] : FIXTURES;
  const results: ValidationResult[] = [];
  const prompts: { name: string; dob: string; promptLength: number; promptFile: string }[] = [];

  console.log(`\n📊 Reading Quality Evaluation`);
  console.log(`   Profiles: ${fixtures.length}`);
  console.log(`   Mode: ${apiMode ? "AI generation" : validateOnly ? "validation only" : "dry run (synthesis + prompts)"}`);
  if (modelOverride) console.log(`   Model override: ${modelOverride}`);
  console.log(`   Output: ${outDir}\n`);

  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    console.log(`[${i + 1}/${fixtures.length}] ${f.name} (${f.dob}) — ${f.note}`);

    // 1. Calculate profile
    const profile = calculateUserProfile(f.name, f.dob);

    // 2. Build synthesis
    const synthesis = buildSynthesis(profile);

    // 3. Validate
    const validation = validateSynthesis(f.name, f.dob, synthesis);
    results.push(validation);

    const status = validation.passed ? "✅" : "❌";
    console.log(`   ${status} Synthesis: ${validation.synthesisStats.patternsCount}P ${validation.synthesisStats.convergencesCount}C ${validation.synthesisStats.tensionsCount}T — systems: ${validation.synthesisStats.systemsEngaged.join(", ")}`);

    if (!validation.passed) {
      for (const check of validation.checks.filter((c) => !c.ok)) {
        console.log(`      ❌ ${check.name}: ${check.detail}`);
      }
    }

    // 4. Generate prompt
    const prompt = generatePrompt(profile, synthesis);
    const promptFile = `prompt-${String(i).padStart(2, "0")}-${f.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    writeFileSync(join(outDir, promptFile), prompt);
    prompts.push({ name: f.name, dob: f.dob, promptLength: prompt.length, promptFile });

    // 5. Save synthesis summary
    const synthesisFile = `synthesis-${String(i).padStart(2, "0")}-${f.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    writeFileSync(
      join(outDir, synthesisFile),
      JSON.stringify(
        {
          coordinates: synthesis.coordinates,
          patterns: synthesis.patterns,
          convergences: synthesis.convergences,
          differences: synthesis.differences,
          tensions: synthesis.tensions,
          rules: synthesis.rules,
          uncertainties: synthesis.uncertainties,
          systemsEngaged: synthesis.systemsEngaged,
        },
        null,
        2
      )
    );

    // 6. Optionally call AI
    if (apiMode) {
      try {
        console.log(`   🤖 Calling AI...`);
        const aiResult = await callInterpret(profile, prompt, modelOverride);
        const aiFile = `reading-${String(i).padStart(2, "0")}-${f.name.replace(/\s+/g, "-").toLowerCase()}.json`;
        writeFileSync(
          join(outDir, aiFile),
          JSON.stringify(
            {
              profile: { name: f.name, dob: f.dob, note: f.note },
              model: aiResult.model,
              durationMs: aiResult.durationMs,
              status: aiResult.status,
              raw: aiResult.raw,
            },
            null,
            2
          )
        );
        console.log(`   ✅ AI response: ${aiResult.durationMs}ms (${aiResult.model})`);
      } catch (err) {
        console.log(`   ❌ AI error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n📋 Summary: ${passed}/${results.length} passed validation, ${failed} failed`);

  // Write summary
  writeFileSync(
    join(outDir, "summary.json"),
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        mode: apiMode ? "ai" : validateOnly ? "validate" : "dry-run",
        model: modelOverride || "default",
        v2Enabled,
        promptBuilder: v2Enabled ? "buildIntelligencePromptV2 (canónico)" : "buildIntelligencePromptLegacy (SIN síntesis canónica)",
        profiles: results.length,
        passed,
        failed,
        results,
        prompts,
      },
      null,
      2
    )
  );

  console.log(`\n📄 Full results: ${outDir}/summary.json`);
  console.log(`📝 Prompts: ${prompts.length} files in ${outDir}/`);
  if (apiMode) console.log(`🤖 AI readings: in ${outDir}/`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
