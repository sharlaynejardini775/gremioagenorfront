import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Urna from './pages/Urna';
import Resultados from './pages/Resultados';


const AppRoutes = () => {
return (
<Router>
<Routes>
{/* Página principal de votação */}
<Route path="/" element={<Urna />} />

php-template
Copiar código
    {/* Página de resultados (gráfico dos ganhadores) */}
    <Route path="/resultados" element={<Resultados />} />

    {/* Página para rotas inválidas */}
   
  </Routes>
</Router>
);
};

export default AppRoutes;