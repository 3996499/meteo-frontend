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

  // 🔹 Provincia
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

  // 🔹 Municipio
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




















// import React from 'react';
// import Buscador from './Components/BuscadorProvincia';
// import Resultado from './Components/ResultadoProvincia';
// import { useState } from 'react';
// import './App.css';
// import BuscadorMunicipio from './Components/BuscadorMunicipio';

// function App() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
//     const [pronostico, setPronostico] = useState([]);
//     const [municipios, setMunicipios] = useState([]);


//     const buscar = async (codigoProvincia) => {
//       setLoading(true);
//       setError("");
//       setData(null);

//       try {
//         const response = await fetch(
//           `http://localhost:3000/api/tiempo/provincia/${codigoProvincia}`
//         ); 

//         if (!response.ok){
//           throw new Error(`Error HTTP ${response.status}`);
//         }


//         const json = await response.json();
        
//         if (!json.success){
//           throw new Error(json.message || "Error al obtener datos");
//         }

//         setData(json.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//     }
// };

// const buscarMunicipio = async (codigoMunicipio) => {
//   setLoading(true);
//   setError(null);
//   setPronostico(null);

//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/tiempo/municipio/${codigoMunicipio}`
//     ); 

//     if (!response.ok){
//       throw new Error(`Error HTTP ${response.status}`);
//     }


//     const json = await response.json();
    
//     if (!json.success){
//       throw new Error(json.message || "Error al obtener datos");
//     }

//     setPronostico(json.data);
//   } catch (error) {
//     setError(error.message);
//   } finally {
//     setLoading(false);
// }
// };


// const cargarMunicipios = async (codigoProvincia) => {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/municipios/${codigoProvincia}`
//     );

//     const json = await response.json();
//     console.log("Municipios recibidos:", json);

//     if (json.success) {
//       setMunicipios(json.data);
//     } else {
//       setMunicipios([]);
//     }
//   } catch (error) {
//     console.error(error);
//     setMunicipios([]);
//   }
// };



// return (
//   <div className='app'>
//     <h1>Buscador de tiempo AEMET</h1>
//     <Buscador onBuscar={buscar} />
//     <Resultado loading={loading} error={error} data={data} />
    
//   </div>
// );
// }

// export default App;

