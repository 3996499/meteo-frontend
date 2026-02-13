// Componente principal de la aplicación de predicción meteorológica AEMET
import { useState } from "react";
import BuscadorProvincia from "./Components/BuscadorProvincia";
import BuscadorMunicipio from "./Components/BuscadorMunicipio";
import ResultadoProvincia from "./Components/ResultadoProvincia";
import ResultadoMunicipio from "./Components/ResultadoMunicipio";
import "./App.css";

function App() {
  // Estados para gestionar datos de provincia y municipios
  const [provinciaTexto, setProvinciaTexto] = useState(null);  // Texto de predicción provincial
  const [municipios, setMunicipios] = useState([]);            // Lista de municipios de la provincia
  const [pronostico, setPronostico] = useState(null);          // Predicción de 7 días del municipio
  const [loading, setLoading] = useState(false);               // Estado de carga
  const [error, setError] = useState(null);                    // Mensaje de error
  const API_URL = import.meta.env.VITE_API_URL;                // URL de la API

  // Busca la predicción de una provincia y carga sus municipios
  const buscarProvincia = async (codigoProvincia) => {
    // Resetear estados previos
    setLoading(true);
    setError(null);
    setMunicipios([]);
    setPronostico(null);

    try {
      // Obtener predicción de la provincia
      const resProvincia = await fetch(
        `${API_URL}/api/tiempo/provincia/${codigoProvincia}`
        
      );
      const jsonProvincia = await resProvincia.json();
      setProvinciaTexto(jsonProvincia.data);

      // Obtener lista de municipios de la provincia
      const resMunicipios = await fetch(
        `${API_URL}/api/municipios/${codigoProvincia}`
      );
      const jsonMunicipios = await resMunicipios.json();

      if (jsonMunicipios.success) {
        setMunicipios(jsonMunicipios.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Busca la predicción de 7 días de un municipio específico
  const buscarMunicipio = async (codigoMunicipio) => {
    if (!codigoMunicipio) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/api/tiempo/municipio/${codigoMunicipio}`
      );
      const json = await response.json();
      setPronostico(json.prediccion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Buscador de tiempo AEMET</h1>

      {/* Selector de provincia */}
      <BuscadorProvincia onBuscar={buscarProvincia} />

      {/* Mostrar resultado de provincia si hay datos */}
      {provinciaTexto && <ResultadoProvincia data={provinciaTexto} />}

      {/* Mostrar selector de municipios si hay municipios disponibles */}
      {municipios.length > 0 && (
        <BuscadorMunicipio
          municipios={municipios}
          onSeleccionar={buscarMunicipio}
        />
      )}

      {/* Mostrar predicción de 7 días del municipio si está disponible */}
      {pronostico && <ResultadoMunicipio data={pronostico} />}
    </div>
  );

}

export default App