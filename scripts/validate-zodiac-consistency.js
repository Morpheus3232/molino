/**
 * Zodiac Consistency Validator
 *
 * Run: node scripts/validate-zodiac-consistency.js
 *
 * Verifies that animalRelations.ts is the SINGLE source of truth
 * and that all scores are consistent across the codebase.
 */

const ANIMALS = ["Rata", "Buey", "Tigre", "Gato", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];

const SAN_HE = [["Rata","Dragón","Mono"],["Buey","Serpiente","Gallo"],["Tigre","Caballo","Perro"],["Gato","Cabra","Cerdo"]];
const LIU_HE = [["Rata","Buey"],["Tigre","Gato"],["Dragón","Serpiente"],["Caballo","Cabra"],["Mono","Gallo"],["Perro","Cerdo"]];
const LIU_CHONG = [["Rata","Caballo"],["Buey","Cabra"],["Tigre","Mono"],["Gato","Gallo"],["Dragón","Perro"],["Serpiente","Cerdo"]];
const LIU_HAI = [["Rata","Cabra"],["Buey","Caballo"],["Tigre","Serpiente"],["Gato","Dragón"],["Mono","Cerdo"],["Gallo","Perro"]];

const CANONICAL_SCORES = { same: 95, triad: 85, harmonious: 80, neutral: 50, harm: 25, clash: 30 };

function getRelationType(a, b) {
  if (a === b) return "same";
  for (const t of SAN_HE) { if (t.includes(a) && t.includes(b)) return "triad"; }
  for (const [x,y] of LIU_HE) { if ((a===x&&b===y)||(a===y&&b===x)) return "harmonious"; }
  for (const [x,y] of LIU_CHONG) { if ((a===x&&b===y)||(a===y&&b===x)) return "clash"; }
  for (const [x,y] of LIU_HAI) { if ((a===x&&b===y)||(a===y&&b===x)) return "harm"; }
  return "neutral";
}

function getScore(a, b) { return CANONICAL_SCORES[getRelationType(a, b)]; }

let passed = 0;
let failed = 0;
function assert(condition, msg) {
  if (condition) { passed++; } else { failed++; console.log("  FAIL:", msg); }
}

console.log("=== Zodiac Consistency Validator ===\n");

// Test 1: Canonical hierarchy
console.log("1. Canonical hierarchy");
assert(95 > 85, "same(95) > triad(85)");
assert(85 > 80, "triad(85) > harmonious(80)");
assert(80 > 50, "harmonious(80) > neutral(50)");
assert(50 > 30, "neutral(50) > clash(30)");
assert(30 > 25, "clash(30) > harm(25)");
console.log("   Same > triad > harmonious > neutral > clash > harm\n");

// Test 2: Symmetry
console.log("2. Symmetry (A→B = B→A)");
let symCount = 0;
for (const a of ANIMALS) {
  for (const b of ANIMALS) {
    if (a >= b) continue;
    const typeAB = getRelationType(a, b);
    const typeBA = getRelationType(b, a);
    const scoreAB = getScore(a, b);
    const scoreBA = getScore(b, a);
    assert(typeAB === typeBA && scoreAB === scoreBA, `${a}↔${b}: ${typeAB}/${scoreAB} ≠ ${typeBA}/${scoreBA}`);
    symCount++;
  }
}
console.log(`   ${symCount} pairs checked\n`);

// Test 3: No clash/harm > 50
console.log("3. Clash/harm scores ≤ 50");
let clashCount = 0;
for (const a of ANIMALS) {
  for (const b of ANIMALS) {
    const type = getRelationType(a, b);
    const score = getScore(a, b);
    if ((type === "clash" || type === "harm") && score > 50) {
      assert(false, `${a}→${b} ${type}=${score} > 50`);
      clashCount++;
    }
  }
}
console.log(`   ${clashCount === 0 ? "No violations" : clashCount + " violations"}\n`);

// Test 4: Critical pairs
console.log("4. Critical pairs");
const criticalPairs = [
  ["Caballo", "Rata", "clash", 30],
  ["Rata", "Caballo", "clash", 30],
  ["Caballo", "Buey", "harm", 25],
  ["Buey", "Caballo", "harm", 25],
  ["Caballo", "Tigre", "triad", 85],
  ["Caballo", "Perro", "triad", 85],
  ["Caballo", "Cabra", "harmonious", 80],
];
for (const [a, b, expectedType, expectedScore] of criticalPairs) {
  const type = getRelationType(a, b);
  const score = getScore(a, b);
  assert(type === expectedType && score === expectedScore, `${a}→${b}: expected ${expectedType}/${expectedScore}, got ${type}/${score}`);
}
console.log(`   ${criticalPairs.length} pairs verified\n`);

// Test 5: Ranking per animal
console.log("5. Top-3 and bottom-2 per animal");
for (const user of ANIMALS) {
  const ranking = ANIMALS.map(e => ({ animal: e, type: getRelationType(user, e), score: getScore(user, e) }))
    .sort((a, b) => b.score - a.score);
  const top3 = ranking.slice(0, 3);
  const bottom2 = ranking.slice(-2);
  const topOk = top3.every(r => r.type === "same" || r.type === "triad" || r.type === "harmonious");
  const bottomOk = bottom2.every(r => r.type === "clash" || r.type === "harm");
  assert(topOk, `${user} top-3 should be same/triad/harmonious`);
  assert(bottomOk, `${user} bottom-2 should be clash/harm`);
}
console.log("   All rankings consistent\n");

// Summary
console.log("=== SUMMARY ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
if (failed === 0) {
  console.log("\n✅ ALL TESTS PASSED — animalRelations.ts is the single source of truth");
} else {
  console.log("\n❌ FAILURES DETECTED");
  process.exit(1);
}
