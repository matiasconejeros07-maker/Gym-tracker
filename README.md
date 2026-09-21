# Gym-tracker
## Registro de usuarios (opcional)

APULSO es un archivo estático: los datos de cada persona se guardan en su
propio navegador y no salen de ahí. Para saber quién entra por el enlace hace
falta un lugar donde guardarlos.

En `backend/registro.gs` está el script de Google Apps Script que recibe cada
ficha y la escribe en una hoja de cálculo. Es gratis y no necesita servidor.

1. Crea una hoja en <https://sheets.new>.
2. Extensiones → Apps Script, y pega el contenido de `backend/registro.gs`.
3. Cambia `CLAVE_ADMIN` por una contraseña tuya.
4. Implementar → Nueva implementación → Aplicación web, con acceso
   "Cualquier usuario". Copia la URL que termina en `/exec`.
5. Pega esa URL en `index.html`, en la constante `SYNC_ENDPOINT`, y sube el
   cambio.

Desde ese momento, cada persona que complete el cuestionario inicial queda
registrada. El perfil incluye un interruptor para desactivarlo por dispositivo. El panel se abre añadiendo `?admin` a
la dirección de la app; la clave se pide una vez y se guarda sólo en ese
dispositivo, así que nadie más puede leer los registros.

Sin `SYNC_ENDPOINT` no se envía nada a ninguna parte y el cuestionario ni
siquiera muestra la casilla de compartir.
