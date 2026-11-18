# Bestconomy v0.7 — Bizum manual + Resend

## Modelo comercial configurado
- Starter gratuito.
- Bestconomy Plus: 4,99 €/mes o 49,90 €/año.
- Pago manual mediante Bizum para empresas (pendiente de confirmar alta con el banco).
- Sin renovación automática.
- El usuario solicita el plan desde la web; soporte envía instrucciones individualmente; el administrador verifica el abono en la cuenta bancaria y activa manualmente el acceso.
- No se muestra número, QR ni enlace de pago porque todavía no se ha facilitado ni verificado un identificador comercial.

## Flujo pendiente de activar en la aplicación
Esta versión recoge solicitudes por formulario. La activación real de permisos Plus requiere una herramienta administrativa segura y un campo de suscripción/fecha de vencimiento; no se debe cambiar el esquema Supabase sin diseñar y revisar las políticas RLS. Por ahora la confirmación manual se hace fuera de la app y no se otorgan privilegios automáticamente.

## Resend
1. Crear cuenta en https://resend.com/signup.
2. Añadir y verificar un dominio propio en https://resend.com/domains. Publicar los registros DNS que Resend indique.
3. Crear una API key limitada a permiso de envío (Sending access) y al dominio verificado.
4. En Vercel > Project Bestconomy > Settings > Environment Variables, añadir SOLO en Preview:
   - `RESEND_API_KEY` = clave de Resend (secreta)
   - `RESEND_FROM_EMAIL` = remitente del dominio verificado, por ejemplo `Bestconomy <soporte@TU-DOMINIO>`
   - `SUPPORT_EMAIL` = `rrubiconsulting@gmail.com`
5. Redeploy del entorno Preview y probar formulario y respuesta. Nunca poner la clave en el HTML, JavaScript del navegador, repositorio o chat.

## Bizum
Antes de cobrar, confirmar con tu banco la contratación de Bizum para empresas/profesionales y las condiciones de uso. No utilizar un Bizum personal para cobros recurrentes de una actividad comercial. Bizum comercial online requiere habilitación bancaria y la integración indicada por la entidad.

## Seguridad y alcance
- No se ha habilitado pago online ni renovación automática.
- No se han modificado Supabase, RLS ni producción.
- La dirección postal y la revisión legal siguen pendientes.