// Importar dependencias
// npm install iconv-lite (texto aemet)
const iconv = require("iconv-lite");


//carga archivo .json municipios
const fs = require("fs");
const path = require("path");

const municipios = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/municipios.json"), "utf-8")
);




const express = require('express');
const cors = require('cors');
require('dotenv').config({path: __dirname + '/.env'});
//console.log('API_KEY', process.env.AEMET_API_KEY);

// Crear aplicación Express
const app = express();
//cors (permiso para que el frontend acceda a la api)
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;


// MUNICIPIOS (desde JSON local)
app.get("/api/municipios/:codigoProvincia", (req, res) => {
  const { codigoProvincia } = req.params;

  const lista = municipios.filter(
    m => m.provincia === codigoProvincia
  );

  res.json({
    success: true,
    total: lista.length,
    data: lista
  });
});


// Middlewares
//app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Parsear JSON en el body de las peticiones

// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API Backend',
    endpoints: {
      '/api/ejemplo': 'Obtiene datos de ejemplo de una API externa',
      '/api/usuarios': 'Obtiene lista de usuarios de ejemplo',
      '/api/usuario/:id': 'Obtiene un usuario específico por ID'
    }
  });
});

// EJEMPLO 1: Endpoint que consulta a una API externa y devuelve los datos
app.get('/api/ejemplo', async (req, res) => {
  try {
    // Hacer petición a API externa (JSONPlaceholder como ejemplo)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    
    // Convertir respuesta a JSON
    const data = await response.json();
    
    // Devolver los datos al cliente
    res.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error('Error al consultar la API:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los datos de la API externa',
      detalles: error.message
    });
  }
});

// EJEMPLO 2: Endpoint que obtiene una lista de recursos
app.get('/api/usuarios', async (req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const usuarios = await response.json();
    
    res.json({
      success: true,
      total: usuarios.length,
      data: usuarios
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios'
    });
  }
});

// EJEMPLO 3: Endpoint con parámetros dinámicos
app.get('/api/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const usuario = await response.json();
    
    res.json({
      success: true,
      data: usuario
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el usuario'
    });
  }
});

// EJEMPLO 4: Endpoint con query parameters (para filtros, búsquedas, etc.)
app.get('/api/posts', async (req, res) => {
  try {
    // Obtener parámetros de consulta (ej: /api/posts?userId=1)
    const { userId } = req.query;
    
    let url = 'https://jsonplaceholder.typicode.com/posts';
    
    // Si se proporciona userId, filtrar por ese usuario
    if (userId) {
      url += `?userId=${userId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const posts = await response.json();
    
    res.json({
      success: true,
      total: posts.length,
      filtros: { userId: userId || 'ninguno' },
      data: posts
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener posts'
    });
  }
});
//busqueda por provincia
app.get('/api/tiempo/provincia/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    const urlAemet = `https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/${codigo}?api_key=${process.env.AEMET_API_KEY}`;
    
    const response = await fetch(urlAemet);
    if (!response.ok){
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
//


//busqueda por municipio
app.get('/api/tiempo/municipio/:codigoMunicipio', async (req, res) => {
  try {
    const { codigoMunicipio } = req.params;

    const urlAemet = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${codigoMunicipio}?api_key=${process.env.AEMET_API_KEY}`;

    const response = await fetch(urlAemet);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const info = await response.json();

    if (!info.datos || typeof info.datos !== 'string') {
      throw new Error('Respuesta inesperada de AEMET');
    }

    const datosResponse = await fetch(info.datos);
    if (!datosResponse.ok) {
      throw new Error('Error al obtener datos finales');
    }

    const buffer = Buffer.from(await datosResponse.arrayBuffer());
    const datos = iconv.decode(buffer, 'ISO-8859-1');

    const json = JSON.parse(datos);

    const municipio = json[0].nombre;
    const dias = json[0].prediccion.dia.map(d => ({
      fecha: d.fecha,
      tmin: d.temperatura.minima,
      tmax: d.temperatura.maxima,
      estadoCielo: d.estadoCielo[0]?.descripcion || 'Desconocido',
      precipitacion: d.probPrecipitacion[0]?.value || 0
    }));

    res.json({
      success: true,
      municipio,
      prediccion: dias
    });

  } catch (error) {
    console.error('ERROR MUNICIPIO:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



// BUSQUEDA DE MUNICIPIOS POR PROVINCIA
app.get('/api/municipios/:codigoProvincia', async (req, res) => {
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
    console.error('ERROR MUNICIPIOS:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Ruta para manejar endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación disponible en http://localhost:${PORT}`);
});


