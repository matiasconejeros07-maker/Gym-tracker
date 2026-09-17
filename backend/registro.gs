/**
 * APULSO — registro de usuarios
 * ---------------------------------------------------------------------------
 * Google Apps Script que recibe los datos del cuestionario inicial y los
 * guarda en una hoja de cálculo. Es gratis y no necesita servidor propio.
 *
 * CÓMO INSTALARLO (5 minutos)
 *  1. Crea una hoja nueva en https://sheets.new y ponle nombre, por ejemplo
 *     "APULSO registros".
 *  2. En el menú: Extensiones → Apps Script. Borra lo que haya y pega ESTE
 *     archivo completo.
 *  3. Cambia CLAVE_ADMIN por una contraseña tuya (no la compartas: es la que
 *     te deja LEER los registros).
 *  4. Implementar → Nueva implementación → tipo "Aplicación web".
 *       Ejecutar como: Yo
 *       Quién tiene acceso: Cualquier usuario
 *     Copia la URL que termina en /exec.
 *  5. Pega esa URL en index.html, en la constante SYNC_ENDPOINT.
 *  6. Sube el cambio. Listo: cada persona que complete el cuestionario
 *     aparecerá en tu hoja y en el panel de administración de la app.
 */

const CLAVE_ADMIN = "cambia-esta-clave";
const HOJA = "registros";

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const hoja = obtenerHoja_();
    const fila = [
      new Date(),
      datos.deviceId || "",
      datos.name || "",
      datos.gender || "",
      datos.age || "",
      datos.height || "",
      datos.weight || "",
      datos.activity || "",
      datos.activityName || "",
      datos.bmi || "",
      datos.tdee || "",
      datos.tz || "",
      datos.lang || ""
    ];
    // Si el mismo dispositivo vuelve a registrarse, se actualiza su fila.
    const existentes = hoja.getDataRange().getValues();
    let filaExistente = -1;
    for (let i = 1; i < existentes.length; i++) {
      if (existentes[i][1] && existentes[i][1] === datos.deviceId) { filaExistente = i + 1; break; }
    }
    if (filaExistente > 0) hoja.getRange(filaExistente, 1, 1, fila.length).setValues([fila]);
    else hoja.appendRow(fila);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const clave = e && e.parameter ? e.parameter.key : "";
  if (clave !== CLAVE_ADMIN) return json_({ ok: false, error: "clave incorrecta" });

  const hoja = obtenerHoja_();
  const valores = hoja.getDataRange().getValues();
  const registros = [];
  for (let i = 1; i < valores.length; i++) {
    const f = valores[i];
    if (!f[0]) continue;
    registros.push({
      fecha: f[0], deviceId: f[1], name: f[2], gender: f[3], age: f[4],
      height: f[5], weight: f[6], activity: f[7], activityName: f[8],
      bmi: f[9], tdee: f[10], tz: f[11], lang: f[12]
    });
  }
  return json_({ ok: true, total: registros.length, registros: registros });
}

function obtenerHoja_() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(["Fecha", "ID dispositivo", "Nombre", "Sexo", "Edad", "Estatura",
                    "Peso", "Nivel", "Nivel (texto)", "IMC", "TDEE", "Zona horaria", "Idioma"]);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
