import { Resend } from 'resend';
import { SITE_URL } from '@/lib/seo';

const FROM_ADDRESS = `Molino <hola@${process.env.RESEND_EMAIL_DOMAIN || 'molino.app'}>`;

function buildConfirmationEmailHtml(paymentId: string, claimUrl: string): string {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 20px;">Tu Mapa Personal está listo</h1>
      <p>Hola,</p>
      <p>Tu pago se acreditó y tu Síntesis Completa ya está desbloqueada.</p>
      <p>Guardá este ID de pago — es tu forma de recuperar el acceso si cambiás de dispositivo o borrás el caché del navegador:</p>
      <p style="font-family: monospace; font-size: 16px; font-weight: bold; padding: 12px; background: #f4f4f4; border-radius: 8px;">${paymentId}</p>
      <p style="margin: 24px 0;">
        <a href="${claimUrl}" style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 8px;">
          Ver mi Síntesis Completa →
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">— Molino</p>
    </div>
  `;
}

/**
 * Best-effort post-payment confirmation email. Never throws — a failed send
 * must never break the webhook that already granted premium access.
 */
export async function sendPremiumConfirmationEmail({
  to,
  paymentId,
  claimToken,
}: {
  to: string;
  paymentId: string;
  claimToken: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return;

  try {
    const resend = new Resend(apiKey);
    const claimUrl = `${SITE_URL}/premium/claim?token=${claimToken}`;

    const { error } = await resend.emails.send(
      {
        from: FROM_ADDRESS,
        to: [to],
        subject: 'Tu Mapa Personal está listo',
        html: buildConfirmationEmailHtml(paymentId, claimUrl),
      },
      { idempotencyKey: `premium-confirmation/${paymentId}` },
    );

    if (error) {
      console.error('[Email] Resend error sending confirmation:', error);
    }
  } catch (error) {
    console.error('[Email] Error sending confirmation:', error);
  }
}
