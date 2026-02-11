// Componente que muestra el resultado meteorológico de una provincia
// Parsea el texto de la API de AEMET y extrae información estructurada
export default function Resultado({ loading, error, data }) {
    // Estados de carga y error
    if (loading) return <p className="loading">Cargando datos...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!data) return null;

    // Limpia y normaliza el texto recibido de la API
    function limpiarTexto(texto) {
        return texto
            .replace(/\\r\\n/g, "\n")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Extrae el nombre de la provincia del texto
    function obtenerProvincia(texto) {
        const match = texto.match(/PROVINCIA DE ([A-ZÁÉÍÓÚÑ]+)/);
        return match ? match[1].trim() : "Desconocida";
    }

    // Extrae la fecha de la predicción
    function obtenerFecha(texto) {
        const match = texto.match(/DÍA ([0-9]{1,2} DE [A-ZÁÉÍÓÚÑ\s]+ DE [0-9]{4})/);
        return match ? match[1] : " ";
    }

    // Extrae las temperaturas mínimas y máximas por localidad
    function obtenerTemperaturas(texto) {
        const regex = /([A-Za-zÁÉÍÓÚñ\s]+)\s+(-?\d+)\s+(-?\d+)/g;
        const resultados = [];
        let match;

        while ((match = regex.exec(texto)) !== null) {
            resultados.push({
                localidad: match[1].trim(),
                min: match[2],
                max: match[3]
            });
        }
        return resultados;
    }

    // Extrae la descripción del estado del cielo
    function obtenerCielo(texto) {
        const match = texto.match(/Cielos? ([^.]+)/i);
        return match ? match[1].trim() : "Desconocido";
    }

    // Extrae información sobre precipitaciones
    function obtenerPrecipitacion(texto) {
        const match = texto.match(/Precipitaciónes ([^.]+)/i);
        return match ? match[1].trim() : "No se esperan precipitaciones";
    }

    // Extrae información sobre el viento
    function obtenerViento(texto) {
        const match = texto.match(/Vientos? ([^.]+)/i);
        return match ? match[1].trim() : "No se espera viento";
    }

    // Procesamiento de datos: extraer toda la información del texto
    const texto = limpiarTexto(data);
    const provincia = obtenerProvincia(texto);
    const fecha = obtenerFecha(texto);
    const temperaturas = obtenerTemperaturas(texto);
    const cielo = obtenerCielo(texto);
    const precipitacion = obtenerPrecipitacion(texto);
    const viento = obtenerViento(texto);

    return (
        <div className="provincia-card">
            <h2 className="provincia-titulo">{provincia}</h2>

            <p>  <strong>Fecha:  {fecha} </strong></p>
            <p> <strong>Cielo: </strong> {cielo}</p>
            <p> <strong>Precipitación: </strong> {precipitacion}</p>
            <p> <strong>Viento: </strong> {viento}</p>
            {/* Lista de temperaturas por localidad */}
            <ul className="temp-list">
                {temperaturas.map((temp, index) => (
                    <li key={index}>
                        <strong>{temp.localidad}</strong>
                        <span> {temp.min}°C / {temp.max}°C</span>
                    </li>
                ))}
            </ul>

        </div>
    );
}
