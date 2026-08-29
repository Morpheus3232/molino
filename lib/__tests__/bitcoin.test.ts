import { describe, it, expect } from "vitest";
import {
  isValidTxid,
  looksLikeBtcAddress,
  usdToSats,
  satsToBtc,
  buildPaymentUri,
  satsPaidTo,
  verifyPayment,
  BTC_PRICE_TOLERANCE,
  type MempoolTx,
} from "../bitcoin";

const ADDR = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4";
const OTRA = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
const TXID = "a".repeat(64);
// A 100.000 USD/BTC, 8 dólares son 8000 sats. Con 5% de tolerancia: 7600.
const RATE = 100_000;

function tx(vout: Array<{ addr?: string; value: number }>, confirmed = false): MempoolTx {
  return {
    txid: TXID,
    vout: vout.map((v) => ({ scriptpubkey_address: v.addr, value: v.value })),
    status: { confirmed },
  };
}

describe("validación de entrada", () => {
  it("acepta un txid de 64 hex y rechaza el resto", () => {
    expect(isValidTxid(TXID)).toBe(true);
    expect(isValidTxid("A".repeat(64))).toBe(true);
    expect(isValidTxid("a".repeat(63))).toBe(false);
    expect(isValidTxid("g".repeat(64))).toBe(false);
    expect(isValidTxid("")).toBe(false);
    expect(isValidTxid(null)).toBe(false);
  });

  it("rechaza un txid con path traversal — se interpola en una URL", () => {
    expect(isValidTxid("../../etc/passwd")).toBe(false);
    expect(isValidTxid(`${"a".repeat(60)}/../x`)).toBe(false);
  });

  it("reconoce direcciones bech32 y legacy, y rechaza basura", () => {
    expect(looksLikeBtcAddress(ADDR)).toBe(true);
    expect(looksLikeBtcAddress("1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2")).toBe(true);
    expect(looksLikeBtcAddress("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy")).toBe(true);
    expect(looksLikeBtcAddress("no-soy-una-direccion")).toBe(false);
    expect(looksLikeBtcAddress("")).toBe(false);
    expect(looksLikeBtcAddress(undefined)).toBe(false);
  });
});

describe("cotización", () => {
  it("convierte USD a satoshis y redondea PARA ARRIBA", () => {
    // Redondear para abajo dejaría pagos de 1 sat menos que el precio.
    expect(usdToSats(8, 100_000)).toBe(8000);
    expect(usdToSats(8, 99_999)).toBe(8001);
  });

  it("rechaza cotizaciones imposibles en vez de dividir por cero", () => {
    expect(() => usdToSats(8, 0)).toThrow();
    expect(() => usdToSats(8, -1)).toThrow();
    expect(() => usdToSats(8, NaN)).toThrow();
  });

  it("arma un URI BIP-21 con el monto en BTC y 8 decimales", () => {
    expect(buildPaymentUri(ADDR, 8000)).toBe(`bitcoin:${ADDR}?amount=0.00008000`);
    expect(satsToBtc(100_000_000)).toBe(1);
  });
});

describe("cuánto nos paga la transacción", () => {
  it("ignora el vuelto y las salidas a otras direcciones", () => {
    const t = tx([
      { addr: ADDR, value: 8000 },
      { addr: OTRA, value: 500_000 },
    ]);
    expect(satsPaidTo(t, ADDR)).toBe(8000);
  });

  it("suma varias salidas a nuestra dirección", () => {
    const t = tx([
      { addr: ADDR, value: 5000 },
      { addr: ADDR, value: 3000 },
      { addr: OTRA, value: 999 },
    ]);
    expect(satsPaidTo(t, ADDR)).toBe(8000);
  });

  it("devuelve 0 si no nos paga nada", () => {
    expect(satsPaidTo(tx([{ addr: OTRA, value: 999_999 }]), ADDR)).toBe(0);
    expect(satsPaidTo({ txid: TXID }, ADDR)).toBe(0);
  });
});

describe("verifyPayment", () => {
  it("acepta el monto exacto", () => {
    const r = verifyPayment(tx([{ addr: ADDR, value: 8000 }]), ADDR, RATE);
    expect(r.ok).toBe(true);
    expect(r.paidSats).toBe(8000);
  });

  it("acepta de más — nadie pierde el acceso por pagar la comisión de sobra", () => {
    expect(verifyPayment(tx([{ addr: ADDR, value: 20_000 }]), ADDR, RATE).ok).toBe(true);
  });

  it("acepta dentro de la tolerancia si el precio se movió", () => {
    const requerido = Math.ceil(8000 * (1 - BTC_PRICE_TOLERANCE)); // 7600
    expect(verifyPayment(tx([{ addr: ADDR, value: requerido }]), ADDR, RATE).ok).toBe(true);
  });

  it("rechaza un satoshi por debajo de la tolerancia", () => {
    const requerido = Math.ceil(8000 * (1 - BTC_PRICE_TOLERANCE));
    const r = verifyPayment(tx([{ addr: ADDR, value: requerido - 1 }]), ADDR, RATE);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("no alcanza");
  });

  it("rechaza una transacción real que le paga a OTRO", () => {
    const r = verifyPayment(tx([{ addr: OTRA, value: 10_000_000 }]), ADDR, RATE);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("no paga a la dirección");
  });

  it("rechaza un txid que no existe", () => {
    const r = verifyPayment(null, ADDR, RATE);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("No encontramos");
  });

  it("acepta con 0 confirmaciones y lo informa", () => {
    const r = verifyPayment(tx([{ addr: ADDR, value: 8000 }], false), ADDR, RATE);
    expect(r.ok).toBe(true);
    expect(r.confirmed).toBe(false);
  });

  it("exige MÁS satoshis cuando BTC vale menos", () => {
    // A la mitad de precio, el mismo producto cuesta el doble de satoshis.
    const barato = verifyPayment(tx([{ addr: ADDR, value: 8000 }]), ADDR, RATE / 2);
    expect(barato.ok).toBe(false);
    expect(barato.requiredSats).toBeGreaterThan(8000);
  });
});
