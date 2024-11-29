import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import NavBarLayout from './layout/NavBarLayout ';
import NotFoundComponent from './components/NotFound/NotFoundComponent';
import TipoEquipo from './pages/Configuration/TipoEquipo/TipoEquipo';
import Departamento from './pages/Configuration/Departamento/Departamento';
import Inventario from './pages/Inventario/Inventario';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>

      <Route element={<NavBarLayout />}>
        {/* Redirige la ruta raíz a /auth/login */}
        <Route path="/" element={<Navigate to="/configuracion/tipo-equipo" />} />
      </Route>

      <Route element={<DefaultLayout />}>
        <Route
          element={
            <>
              <PageTitle title="INVENTARIO" />
            </>
          }
        />

        <Route
          path="/configuracion/tipo-equipo"
          element={
            <>
              <PageTitle title="Tipo de Equipo" />
              <TipoEquipo />
            </>
          }
        />

        <Route
          path="/configuracion/departamento"
          element={
            <>
              <PageTitle title="Departamento" />
              <Departamento />
            </>
          }
        />

        <Route
          path="/procesos/inventario"
          element={
            <>
              <PageTitle title="Control Inventario" />
              <Inventario />
            </>
          }
        />

      </Route>
      <Route element={<NavBarLayout />}>
        <Route
          path="*"
          element={
            <>
              <PageTitle title="Error 404" />
              <NotFoundComponent />
            </>
          }
        />
      </Route>

    </Routes>
  );
}

export default App;
