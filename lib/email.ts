import { Resend } from 'resend';
import { SITE_URL } from '@/lib/seo';

const FROM_ADDRESS = `Molino <hola@${process.env.RESEND_EMAIL_DOMAIN || 'molino.app'}>`;

function buildConfirmationEmailHtml(paymentId: string, claimUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu Lectura Pro está lista</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f6; color: #1a1a1a; margin: 0; padding: 32px 16px; line-height: 1.5;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e8e5df; padding: 36px 28px; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="font-size: 32px; margin-bottom: 8px;">✨</div>
          <h1 style="font-size: 22px; font-weight: 700; color: #111111; margin: 0 0 8px 0; letter-spacing: -0.02em;">¡Tu Lectura Pro está lista!</h1>
          <p style="font-size: 14px; color: #666666; margin: 0;">Tu pago con Mercado Pago se acreditó con éxito. Ya tenés acceso permanente.</p>
        </div>

        <div style="background: #fbf8f3; border: 1px solid #f0e6d6; border-radius: 12px; padding: 22px 18px; margin-bottom: 28px; text-align: center;">
          <p style="font-size: 15px; font-weight: 600; color: #222222; margin: 0 0 16px 0;">Entrá directo a tu lectura con un solo clic:</p>
          <a href="${claimUrl}" style="display: inline-block; padding: 14px 28px; background: #111111; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; letter-spacing: 0.02em;">
            Ver mi Lectura Pro Completa →
          </a>
        </div>

        <div style="border-top: 1px solid #f0ece6; padding-top: 24px; margin-top: 24px;">
          <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #888888; margin: 0 0 10px 0; font-weight: 700;">Tu llave de respaldo de por vida</h2>
          <p style="font-size: 13px; color: #555555; line-height: 1.5; margin: 0 0 14px 0;">
            En Molino no usamos contraseñas ni te hacemos crear cuentas molestas. Guardá este correo: si cambiás de celular, abrís una pestaña de incógnito o limpiás el navegador, podés recuperar tu compra en 1 segundo.
          </p>
          
          <div style="background: #f6f5f2; border: 1px solid #eae7e1; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #777777; display: block; margin-bottom: 4px;">ID de pago de Mercado Pago</span>
            <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 16px; font-weight: 700; color: #111111; letter-spacing: 0.05em;">${paymentId}</span>
          </div>

          <p style="font-size: 12px; color: #888888; line-height: 1.5; margin: 0;">
            Para restaurar el acceso en cualquier dispositivo: ingresá a <a href="${SITE_URL}/profile" style="color: #444444; font-weight: 600; text-decoration: underline;">molino.app/profile</a>, hacé clic en &ldquo;Recuperar acceso&rdquo; y pegá tu ID de pago.
          </p>
        </div>

        <div style="border-top: 1px solid #f0ece6; padding-top: 20px; margin-top: 28px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">— Molino · Autoconocimiento simbólico</p>
        </div>
      </div>
    </body>
    </html>
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
        subject: '✨ Tu Lectura Pro está lista — Acceso permanente a tu mapa',
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
