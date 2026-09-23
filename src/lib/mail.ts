import 'server-only';
import nodemailer from 'nodemailer';
import { isEmailConfigured } from '@/lib/env';

function transport() {
  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

/** Šalje mejl kupcu. Baca grešku ako SMTP nije podešen ili slanje ne uspe. */
export async function sendMail(msg: {
  to: string; subject: string; text: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}): Promise<void> {
  if (!isEmailConfigured) throw new Error('SMTP nije konfigurisan.');
  await transport().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    ...msg,
  });
}

/**
 * Interna obaveštenja su opciona. Bez SMTP kredencijala aplikacija radi
 * normalno — poruka se samo evidentira u logu, bez bacanja greške.
 */
export async function notify(subject: string, body: string): Promise<void> {
  if (!isEmailConfigured) {
    console.info(`[mail: preskočeno — SMTP nije konfigurisan] ${subject}`);
    return;
  }
  try {
    // Obaveštenje ide na adresu pošiljaoca (prodavnica).
    await sendMail({ to: process.env.SMTP_FROM || process.env.SMTP_USER!, subject, text: body });
  } catch (err) {
    console.error('[mail] neuspešno slanje', err);
  }
}
