const fs = require("fs");
const path = require("path");
const fetch = global.fetch || require("node-fetch");
const iconv = require("iconv-lite");
require("dotenv").config({ path: __dirname + "/../.env" });

const DATA_DIR = path.join(__dirname, "../data");

async function descargar(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    return res.json();
}

async function descargarMaestro(endpoint) {
    const url = `https://opendata.aemet.es/opendata/api/${endpoint}?api_key=${process.env.AEMET_API_KEY}`;
    const info = await descargar(url);

    if (!info.datos) throw new Error("Respuesta inesperada de AEMET");

    const datosRes = await fetch(info.datos);
    const buffer = Buffer.from(await datosRes.arrayBuffer());
    const texto = iconv.decode(buffer, "ISO-8859-1");

    return JSON.parse(texto);
}

(async () => {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);


        console.log(" Descargando municipios...");
        const municipios = await descargarMaestro("maestro/municipios");

        // Normalizar municipios (provincia = 2 primeros dígitos)
        const municipiosNormalizados = municipios.map(m => ({
            id: m.id.slice(2),
            nombre: m.nombre,
            provincia: m.id.substring(2, 4)
        }));



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
