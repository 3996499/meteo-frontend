// Script para descargar los maestros de municipios desde la API de AEMET
const fs = require("fs");
const path = require("path");
const fetch = global.fetch || require("node-fetch");
const iconv = require("iconv-lite"); // Para decodificar ISO-8859-1 a UTF-8
require("dotenv").config({ path: __dirname + "/../.env" });

// Directorio donde se guardarán los datos descargados
const DATA_DIR = path.join(__dirname, "../data");

// Función auxiliar para realizar peticiones HTTP y obtener JSON
async function descargar(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return res.json();
}

// Descarga un maestro de AEMET (municipios, provincias, etc.)
// La API devuelve primero una URL temporal donde están los datos reales
async function descargarMaestro(endpoint) {
    const url = `https://opendata.aemet.es/opendata/api/${endpoint}?api_key=${process.env.AEMET_API_KEY}`;
    const info = await descargar(url);

    if (!info.datos) throw new Error("Respuesta inesperada de AEMET");

    // Descargar los datos desde la URL temporal
    const datosRes = await fetch(info.datos);
    const buffer = Buffer.from(await datosRes.arrayBuffer());
    // Decodificar desde ISO-8859-1 (encoding de AEMET) a UTF-8
    const texto = iconv.decode(buffer, "ISO-8859-1");

    return JSON.parse(texto);
}

// Función principal que se ejecuta inmediatamente (IIFE)
(async () => {
    try {
        // Crear directorio de datos si no existe
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);


        console.log(" Descargando municipios...");
        const municipios = await descargarMaestro("maestro/municipios");

        // Normalizar municipios (provincia = 2 primeros dígitos)
        const municipiosNormalizados = municipios.map(m => ({
            id: m.id.slice(2),
            nombre: m.nombre,
            provincia: m.id.substring(2, 4)
        }));



        // Guardar los municipios normalizados en archivo JSON
        fs.writeFileSync(
            path.join(DATA_DIR, "municipios.json"),
            JSON.stringify(municipiosNormalizados, null, 2),
            "utf-8"
        );

        console.log(" Maestros guardados en /data");
    } catch (err) {
        console.error("Error:", err.message);
    }
})();
