export default function ResultadoMunicipio({ data, municipio }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div>
      <h2>Predicción 7 días </h2>
  <ul className="pronostico">
  {data.map((dia, index) => (
    <li key={index}>
       📅 <strong>{dia.fecha}</strong> — 🌡️ {dia.tmin}°C / {dia.tmax}°C · ☁️ {dia.estadoCielo} · 🌧️ {dia.precipitacion}%
    </li>
  ))}
</ul>
    </div>
  );
}
