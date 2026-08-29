/**
 * Pago en BTC — cotización y verificación en cadena.
 *
 * MercadoPago avisa al sitio con un webhook firmado. Una wallet no custodial
 * (Cake Wallet) no avisa a nadie, y como todos pagarían a la MISMA dirección,
 * cuando entran 8 dólares no hay forma de saber de qué usuario son. Por eso
 * el comprobante lo aporta la persona: pega el txid y el server lo verifica
 * contra la blockchain. No se le cree nada — se chequea que esa transacción
 * pague a NUESTRA dirección, que el monto alcance, y que ese txid no se haya
 * usado antes.
 *
 * Fuente: mempool.space (pública, sin cuenta ni API key). Se usa tanto para
 * la cotización como para leer la transacción, así no se suma un segundo
 * tercero.
 */

const MEMPOOL_API = "https://mempool.space/api";

/** Precio del producto, alineado con PRODUCT_PRICE_USD de lib/mercadopago.ts. */
export const BTC_PRODUCT_PRICE_USD = 8;

/**
 * Tolerancia sobre el monto exigido. No se guarda una cotización por orden:
 * al verificar se recalcula con el precio del momento, así que entre que la
 * persona ve el QR y la transacción entra al mempool el precio se movió.
 * 5% cubre la volatilidad normal de esa ventana sin regalar el producto.
 */
export const BTC_PRICE_TOLERANCE = 0.05;

const SATS_PER_BTC = 100_000_000;

/** Un txid es exactamente 64 caracteres hex. Se valida antes de pegarlo en una URL. */
export function isValidTxid(txid: unknown): txid is string {
  return typeof txid === "string" && /^[0-9a-fA-F]{64}$/.test(txid);
}

/**
 * Direcciones Bitcoin que aceptamos configurar: bech32 (bc1...) y las
 * legacy/P2SH (1... / 3...). Es una validación de forma, no de checksum: solo
 * evita que un valor obviamente mal cargado en la env var llegue a mostrarse
 * como destino de pago.
 */
export function looksLikeBtcAddress(addr: unknown): addr is string {
  if (typeof addr !== "string") return false;
  return (
    /^bc1[02-9ac-hj-np-z]{7,71}$/.test(addr) ||
    /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)
  );
}

/** La dirección de cobro vive en la env var: se rota sin deploy y no va al repo. */
export function getBtcAddress(): string {
  const addr = process.env.BTC_ADDRESS;
  if (!looksLikeBtcAddress(addr)) {
    throw new Error("BTC_ADDRESS no está configurada o no es una dirección válida");
  }
  return addr;
}

/** ¿Está habilitado el pago en BTC? Sin dirección configurada, no se ofrece. */
export function isBtcEnabled(): boolean {
  return looksLikeBtcAddress(process.env.BTC_ADDRESS);
}

export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

/** Precio de BTC en USD según mempool.space. */
export async function fetchBtcUsdRate(signal?: AbortSignal): Promise<number> {
  const res = await fetch(`${MEMPOOL_API}/v1/prices`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`No se pudo cotizar BTC (HTTP ${res.status})`);
  const data = (await res.json()) as { USD?: number };
  const usd = data?.USD;
  if (typeof usd !== "number" || !Number.isFinite(usd) || usd <= 0) {
    throw new Error("Cotización de BTC inválida");
  }
  return usd;
}

/**
 * Cuántos satoshis equivalen a `usd` a una cotización dada.
 *
 * Se multiplica ANTES de dividir: `8 / 100000 * 1e8` da 8000.000000000001 en
 * punto flotante, y el ceil cobraba un satoshi de más en todo precio redondo.
 * `8 * 1e8 / 100000` da 8000 exacto. Se redondea para arriba a propósito:
 * para abajo, el monto exigido quedaría por debajo del precio.
 */
export function usdToSats(usd: number, btcUsdRate: number): number {
  if (!Number.isFinite(btcUsdRate) || btcUsdRate <= 0) {
    throw new Error("Cotización de BTC inválida");
  }
  return Math.ceil((usd * SATS_PER_BTC) / btcUsdRate);
}

/** URI BIP-21: lo que lee Cake Wallet al escanear el QR. */
export function buildPaymentUri(address: string, sats: number): string {
  // Se manda `amount` en BTC con 8 decimales, que es lo que exige BIP-21.
  const btc = satsToBtc(sats).toFixed(8);
  return `bitcoin:${address}?amount=${btc}`;
}

interface MempoolVout {
  scriptpubkey_address?: string;
  value?: number;
}

export interface MempoolTx {
  txid: string;
  vout?: MempoolVout[];
  status?: { confirmed?: boolean; block_height?: number };
}

/** Trae una transacción del mempool/cadena. `null` si no existe. */
export async function fetchTransaction(
  txid: string,
  signal?: AbortSignal
): Promise<MempoolTx | null> {
  if (!isValidTxid(txid)) throw new Error("txid inválido");
  const res = await fetch(`${MEMPOOL_API}/tx/${txid}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`No se pudo leer la transacción (HTTP ${res.status})`);
  return (await res.json()) as MempoolTx;
}

/**
 * Cuántos satoshis paga esta transacción A NUESTRA dirección.
 *
 * Suma solo las salidas cuyo destino es `address`: el vuelto y cualquier otra
 * salida se ignoran. Una transacción puede pagarnos en más de una salida, así
 * que se suman todas en vez de tomar la primera.
 */
export function satsPaidTo(tx: MempoolTx, address: string): number {
  return (tx.vout ?? []).reduce(
    (total, out) =>
      out.scriptpubkey_address === address && typeof out.value === "number"
        ? total + out.value
        : total,
    0
  );
}

export interface BtcVerification {
  ok: boolean;
  /** Motivo del rechazo, en español y listo para mostrar. */
  reason?: string;
  paidSats: number;
  requiredSats: number;
  confirmed: boolean;
}

/**
 * ¿Esta transacción paga el producto?
 *
 * Función pura: recibe la transacción ya traída y la cotización, no hace I/O.
 * Así el caso de negocio se testea sin red.
 *
 * Se acepta con 0 confirmaciones (transacción vista en el mempool). Esperar
 * un bloque son 10-60 minutos para una compra de 8 dólares, y montar un doble
 * gasto cuesta bastante más que eso.
 * ponytail: 0-conf a propósito; si aparece abuso, exigir status.confirmed.
 */
export function verifyPayment(
  tx: MempoolTx | null,
  address: string,
  btcUsdRate: number,
  usdPrice: number = BTC_PRODUCT_PRICE_USD
): BtcVerification {
  const requiredSats = Math.ceil(usdToSats(usdPrice, btcUsdRate) * (1 - BTC_PRICE_TOLERANCE));

  if (!tx) {
    return {
      ok: false,
      reason:
        "No encontramos esa transacción en la red. Si la acabás de enviar, esperá un minuto y volvé a intentar.",
      paidSats: 0,
      requiredSats,
      confirmed: false,
    };
  }

  const paidSats = satsPaidTo(tx, address);
  const confirmed = Boolean(tx.status?.confirmed);

  if (paidSats === 0) {
    return {
      ok: false,
      reason: "Esa transacción no paga a la dirección de Molino.",
      paidSats,
      requiredSats,
      confirmed,
    };
  }

  if (paidSats < requiredSats) {
    return {
      ok: false,
      reason: `El monto no alcanza: llegaron ${paidSats} satoshis y hacían falta ${requiredSats}.`,
      paidSats,
      requiredSats,
      confirmed,
    };
  }

  return { ok: true, paidSats, requiredSats, confirmed };
}
