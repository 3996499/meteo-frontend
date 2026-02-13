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

  // Función para obtener datos de la API
  async function fetchAPI(endpoint){
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok){
      throw new Error(`Error al obtener datos de la API.`);
    }
    return response.json();
  }



  // Busca la predicción de una provincia y carga sus municipios
  const buscarProvincia = async (codigoProvincia) => {
    // Resetear estados previos
    setLoading(true);
    setError(null);
    setMunicipios([]);
    setPronostico(null);

    try {
      // Obtener predicción de la provincia
      const resProvincia = await fetchAPI(
        `/api/tiempo/provincia/${codigoProvincia}`

      );
      //const jsonProvincia = await resProvincia.json();
      setProvinciaTexto(resProvincia.data);

      // Obtener lista de municipios de la provincia
      const resMunicipios = await fetchAPI(
        `/api/municipios/${codigoProvincia}`
      );
      //const jsonMunicipios = await resMunicipios.json();

      if (resMunicipios.success) {
        setMunicipios(resMunicipios.data);
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
      const response = await fetchAPI(
        `/api/tiempo/municipio/${codigoMunicipio}`
      );
      setPronostico(response.prediccion);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Buscador de tiempo AEMET</h1>

      {/* Mensajes de carga y error */}
      {loading && <p className="loading">Cargando datos...</p>}

      {error && (
        <p className="error">
          Error: {error}
        </p>
      )}

      {/* Selector de provincia */}
      <BuscadorProvincia onBuscar={buscarProvincia} />

      {/* Mostrar resultado de provincia si hay datos */}
      {provinciaTexto && <ResultadoProvincia data={provinciaTexto} />}

      {/* Mostrar mensaje si no hay municipios disponibles */}
      {municipios.length === 0 && provinciaTexto && (
        <p>No hay municipios disponibles para esta provincia.</p>
      )}

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