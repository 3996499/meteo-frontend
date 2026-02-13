import { useState } from "react";
import { provincias } from "../data/provincias";

// Componente buscador de provincias - Muestra un formulario para seleccionar y buscar una provincia
export default function BuscadorProvincia({ onBuscar }) {
  // Estado que almacena el código de la provincia seleccionada
  const [codigo, setCodigo] = useState("");

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const limpio = codigo.trim();
    // Solo buscar si hay un código válido
    if (!limpio) return;
    onBuscar(limpio);
  };


  return (
    <form onSubmit={handleSubmit}>
      <select value={codigo} onChange={(e) => setCodigo(e.target.value)}>
        {/* Opción por defecto */}
        <option value="">Selecciona una provincia</option>
        {/* Renderizar todas las provincias disponibles */}
        {provincias.map((p) => (
          <option key={p.codigo} value={p.codigo}>
            {p.nombre}
          </option>
        ))}
      </select>
      {/* Botón de búsqueda deshabilitado si no hay código seleccionado */}
      <button type="submit" disabled={!codigo}>
        Buscar
      </button>
    </form>
  );
}