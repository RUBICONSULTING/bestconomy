module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Método no permitido.' }); }
  const body = req.body || {};
  const name = body.name, email = body.email, topic = body.topic, message = body.message, website = body.website;
  if (website) return res.status(200).json({ ok: true });
  const validEmail = typeof email === 'string' && /^[^ @]+@[^ @]+[.][^ @]+$/.test(email);
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || !validEmail || email.length > 180 || typeof message !== 'string' || message.trim().length < 10 || message.length > 3000) return res.status(400).json({ error: 'Revisa los campos del formulario.' });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.SUPPORT_EMAIL || 'rrubiconsulting@gmail.com';
  if (!apiKey || !from) return res.status(503).json({ error: 'El formulario todavía no está conectado al correo. Escríbenos directamente a rrubiconsulting@gmail.com.' });
  const clean = function(v, n) { return String(v || '').split(String.fromCharCode(13)).join(' ').split(String.fromCharCode(10)).join(' ').slice(0, n || 3000); };
  try {
    const lines = ['Nombre: ' + clean(name, 100), 'Email: ' + clean(email, 180), 'Motivo: ' + clean(topic || 'Consulta', 120), '', clean(message)];
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: from, to: [to], reply_to: clean(email, 180), subject: '[Bestconomy] ' + clean(topic || 'Consulta', 120), text: lines.join(String.fromCharCode(10)) }) });
    if (!response.ok) { const detail = await response.text().catch(function(){ return ''; }); console.error('Resend rejected contact email:', response.status, detail.slice(0, 500)); return res.status(502).json({ error: 'El proveedor de correo no ha aceptado el mensaje.' }); }
    return res.status(200).json({ ok: true });
  } catch (error) { console.error('Contact email request failed:', error && error.message || 'unknown error'); return res.status(502).json({ error: 'No se ha podido conectar con el proveedor de correo.' }); }
}