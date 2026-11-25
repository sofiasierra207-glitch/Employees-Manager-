import { NavLink } from 'react-router-dom';

/**
 * Barra de navegación para cambiar entre la gestión
 * de departamentos y la de empleados.
 */
function Navbar() {
  return (
    <header className="navbar">
      <span className="navbar-logo">Gestión Empresarial</span>
      <nav className="navbar-links">
        <NavLink to="/departamentos">Departamentos</NavLink>
        <NavLink to="/empleados">Empleados</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
