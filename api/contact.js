export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Método no permitido.' }); }
  const body = req.body || {};
  const { name, email, topic, message, website } = body;
  if (website) return res.status(200).json({ ok: true });
  const validEmail = typeof email === 'string' && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || !validEmail || email.length > 180 ||
      typeof message !== 'string' || message.trim().length < 10 || message.length > 3000) {
    return res.status(400).json({ error: 'Revisa los campos del formulario.' });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.SUPPORT_EMAIL || 'rrubiconsulting@gmail.com';
  if (!apiKey || !from) return res.status(503).json({ error: 'El formulario todavía no está conectado al correo. Escríbenos directamente a rrubiconsulting@gmail.com.' });
  const clean = (v, n=3000) => String(v || '').replace(/[\\r\\n]/g, ' ').slice(0,n);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: clean(email,180),
        subject: `[Bestconomy] ${clean(topic || 'Consulta',120)}`,
        text: `Nombre: ${clean(name,100)}\\nEmail: ${clean(email,180)}\\nMotivo: ${clean(topic || 'Consulta',120)}\\n\\n${clean(message)}` })
    });
    if (!response.ok) return res.status(502).json({ error: 'El proveedor de correo no ha aceptado el mensaje.' });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'No se ha podido conectar con el proveedor de correo.' }); }
}