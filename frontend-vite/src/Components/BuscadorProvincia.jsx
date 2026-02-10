import { useState } from "react";
import { provincias } from "../data/provincias";

export default function Buscador({onBuscar}) {
    const [codigo, setCodigo] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const limpio = codigo.trim();
        if (!limpio) return;
        onBuscar(limpio);
    };


     return (
    <form onSubmit={handleSubmit}>
      <select value={codigo} onChange={(e) => setCodigo(e.target.value)}>
        {provincias.map((p) => (
          <option key={p.codigo} value={p.codigo}>
            {p.nombre}
          </option>
        ))}
      </select>

      <button type="submit">Buscar</button>
    </form>
  );
}