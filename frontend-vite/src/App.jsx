import { useState } from "react";
import BuscadorProvincia from "./Components/BuscadorProvincia";
import BuscadorMunicipio from "./Components/BuscadorMunicipio";
import ResultadoProvincia from "./Components/ResultadoProvincia";
import ResultadoMunicipio from "./Components/ResultadoMunicipio";
import "./App.css";

function App() {
  const [provinciaTexto, setProvinciaTexto] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [pronostico, setPronostico] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar Provincia
  const buscarProvincia = async (codigoProvincia) => {
    setLoading(true);
    setError(null);
    setMunicipios([]);
    setPronostico(null);

    try {
      const resProvincia = await fetch(
        `http://localhost:3000/api/tiempo/provincia/${codigoProvincia}`
      );
      const jsonProvincia = await resProvincia.json();
      setProvinciaTexto(jsonProvincia.data);

      const resMunicipios = await fetch(
        `http://localhost:3000/api/municipios/${codigoProvincia}`
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

  // Buscar Municipio
  const buscarMunicipio = async (codigoMunicipio) => {
    if (!codigoMunicipio) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/tiempo/municipio/${codigoMunicipio}`
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

    <BuscadorProvincia onBuscar={buscarProvincia} />

    {provinciaTexto && <ResultadoProvincia data={provinciaTexto} />}

    {municipios.length > 0 && (
      <BuscadorMunicipio
        municipios={municipios}
        onSeleccionar={buscarMunicipio}
      />
    )}

    {pronostico && <ResultadoMunicipio data={pronostico} />}
  </div>
);

}

export default App;














