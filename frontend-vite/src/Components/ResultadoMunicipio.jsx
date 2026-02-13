// Convierte una fecha ISO a formato legible en español (ej: "lunes, 15 de enero")
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  const texto = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Componente que muestra la predicción meteorológica de 7 días para un municipio
export default function ResultadoMunicipio({ data }) {
  // Si no hay datos válidos, no renderizar nada
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div>
      <h2>Predicción 7 días</h2>

      <ul className="pronostico">
        {/* Renderizar cada día con su información meteorológica */}
        {data.map((dia, index) => (
          <li key={index}>
            📅 <strong>{formatearFecha(dia.fecha)}</strong> — 🌡️ {dia.tmin}°C / {dia.tmax}°C · ☁️ {dia.estadoCielo} · 🌧️ {dia.precipitacion}%
          </li>


        ))}


      </ul>


    </div>
  )
}