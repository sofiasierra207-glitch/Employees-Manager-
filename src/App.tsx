import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';

/**
 * Define la barra de navegación y las rutas:
 * - "/empleados": gestión de empleados
 * - "/departamentos": gestión de departamentos
 */
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/empleados" />} />
        <Route path="/empleados" element={<EmployeesPage />} />
        <Route path="/departamentos" element={<DepartmentsPage />} />
      </Routes>
    </>
  );
}

export default App;
