export default function BuscadorMunicipio({municipios, onSeleccionar}) {
   if (!municipios || municipios.length === 0) return null;

   return (
    <select onChange={(e) => onSeleccionar(e.target.value)}>
        <option value="">Selecciona un municipio</option>
        {municipios.map((m) => (
            <option key={m.id} value={m.id}>
                {m.nombre}
            </option>
        ))}
    </select>
   );
}