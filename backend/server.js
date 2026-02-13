// IMPORTACIÓN DE DEPENDENCIAS

// npm install iconv-lite (texto aemet)
const iconv = require("iconv-lite");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });


// CONFIGURACIÓN INICIAL

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir peticiones desde el frontend (Vite)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());


// RUTAS AEMET
// BÚSQUEDA POR PROVINCIA
app.get("/api/tiempo/provincia/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    const urlAemet = `https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/${codigo}?api_key=${process.env.AEMET_API_KEY}`;

    const response = await fetch(urlAemet);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const info = await response.json();

    if (!info.datos || typeof info.datos !== "string") {
      throw new Error("Respuesta inesperada de AEMET");
    }

    const datosResponse = await fetch(info.datos);
    if (!datosResponse.ok) {
      throw new Error("Error al obtener los datos finales de AEMET");
    }

    const buffer = Buffer.from(await datosResponse.arrayBuffer());
    const datos = iconv.decode(buffer, "ISO-8859-1");

    res.json({
      success: true,
      data: datos
    });

  } catch (error) {
    console.error("ERROR AEMET:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// BÚSQUEDA POR MUNICIPIO
app.get("/api/tiempo/municipio/:codigoMunicipio", async (req, res) => {
  try {
    const { codigoMunicipio } = req.params;

    const urlAemet = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${codigoMunicipio}?api_key=${process.env.AEMET_API_KEY}`;

    const response = await fetch(urlAemet);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const info = await response.json();

    if (!info.datos || typeof info.datos !== "string") {
      throw new Error("Respuesta inesperada de AEMET");
    }

    const datosResponse = await fetch(info.datos);
    if (!datosResponse.ok) {
      throw new Error("Error al obtener datos finales");
    }

    const buffer = Buffer.from(await datosResponse.arrayBuffer());
    const datos = iconv.decode(buffer, "ISO-8859-1");

    const json = JSON.parse(datos);

    const municipio = json[0].nombre;

    const dias = json[0].prediccion.dia.map(d => ({
      fecha: d.fecha,
      tmin: d.temperatura.minima,
      tmax: d.temperatura.maxima,
      estadoCielo: d.estadoCielo[0]?.descripcion || "Desconocido",
      precipitacion: d.probPrecipitacion[0]?.value || 0
    }));

    res.json({
      success: true,
      municipio,
      prediccion: dias
    });

  } catch (error) {
    console.error("ERROR MUNICIPIO:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// BÚSQUEDA DE MUNICIPIOS POR PROVINCIA
app.get("/api/municipios/:codigoProvincia", async (req, res) => {
  try {
    const { codigoProvincia } = req.params;

    const urlAemet = `https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=${process.env.AEMET_API_KEY}`;

    const response = await fetch(urlAemet);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const info = await response.json();

    if (!info.datos || typeof info.datos !== "string") {
      throw new Error("Respuesta inesperada de AEMET");
    }

    const datosResponse = await fetch(info.datos);
    if (!datosResponse.ok) {
      throw new Error("Error al obtener municipios");
    }

    const buffer = Buffer.from(await datosResponse.arrayBuffer());
    const datos = iconv.decode(buffer, "ISO-8859-1");

    const municipios = JSON.parse(datos);

    const municipiosProvincia = municipios
      .filter(m => m.id.startsWith(codigoProvincia.padStart(2, "0")))
      .map(m => ({
        id: m.id,
        nombre: m.nombre
      }));

    res.json({
      success: true,
      total: municipiosProvincia.length,
      data: municipiosProvincia
    });

  } catch (error) {
    console.error("ERROR MUNICIPIOS:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// MANEJO DE RUTAS NO ENCONTRADAS

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint no encontrado"
  });
});

// INICIO DEL SERVIDOR

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación disponible en http://localhost:${PORT}`);
});
