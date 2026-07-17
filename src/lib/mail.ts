import { isEmailConfigured } from '@/lib/env';

/**
 * Obaveštenja e-poštom su opciona. Bez SMTP kredencijala aplikacija radi
 * normalno — poruka se samo evidentira u logu, bez bacanja greške.
 */
export async function notify(subject: string, body: string): Promise<void> {
  if (!isEmailConfigured) {
    console.info(`[mail: preskočeno — SMTP nije konfigurisan] ${subject}`);
    return;
  }
  try {
    // Implementacija se dodaje kada klijent dostavi SMTP kredencijale
    // (nodemailer / Resend). Namerno bez zavisnosti dok se ne aktivira.
    console.info(`[mail] ${subject}\n${body}`);
  } catch (err) {
    console.error('[mail] neuspešno slanje', err);
  }
}
