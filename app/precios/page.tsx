import { redirect } from "next/navigation";

/**
 * Pausada: esta ruta describía un pricing ladder de 3 planes con
 * facturación mensual/anual y cancelación (components/pricing/pricing-data.ts)
 * que el backend no implementa — pagar cualquier plan otorga el mismo
 * acceso de por vida que /premium a $8, pago único. Redirige hasta que el
 * pricing ladder tenga entitlement real por tier. Ver
 * .claude/execution-logs/pricing-ladder-audit.md.
 */
export default function PreciosPage() {
  redirect("/premium");
}
