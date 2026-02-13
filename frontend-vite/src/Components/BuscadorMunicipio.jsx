// Componente selector de municipios - Renderiza un <select> con los municipios de la provincia seleccionada
export default function BuscadorMunicipio({ municipios, onSeleccionar, loading }) {
    // Si no hay municipios disponibles, no mostrar el selector
    if (!municipios || municipios.length === 0) return null;

    return (
        <select onChange={(e) => onSeleccionar(e.target.value)} disabled={loading}>
            <option value="">Selecciona un municipio</option>
            {/* Mapear cada municipio a una opción del selector */}
            {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                    {m.nombre}
                </option>
            ))}
        </select>
    );
}