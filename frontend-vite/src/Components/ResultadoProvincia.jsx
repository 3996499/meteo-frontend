export default function Resultado({ loading, error, data }) {
    if (loading) return <p className="loading">Cargando datos...</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!data) return null;


    function limpiarTexto(texto) {
        return texto
            .replace(/\\r\\n/g, "\n")
            .replace(/\s+/g, " ")
            .trim();
    }

    function obtenerProvincia(texto) {
        const match = texto.match(/PROVINCIA DE ([A-ZÁÉÍÓÚÑ]+)/);
        return match ? match[1].trim() : "Desconocida";
    }

    function obtenerFecha(texto) {
        const match = texto.match(/DÍA ([0-9]{1,2} DE [A-ZÁÉÍÓÚÑ\s]+ DE [0-9]{4})/);
        return match ? match[1] : " ";
    }

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

    function obtenerCielo(texto) {
        const match = texto.match(/Cielos? ([^.]+)/i);
        return match ? match[1].trim() : "Desconocido";
    }

    function obtenerPrecipitacion(texto) {
        const match = texto.match(/Precipitaciónes ([^.]+)/i);
        return match ? match[1].trim() : "No se esperan precipitaciones";
    }

    function obtenerViento(texto) {
        const match = texto.match(/Vientos? ([^.]+)/i);
        return match ? match[1].trim() : "No se espera viento";
    }

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
