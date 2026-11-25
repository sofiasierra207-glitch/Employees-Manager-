import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Department } from '../types/department';

/**
 * Página para crear, ver, editar y eliminar departamentos.
 */
function DepartmentsPage() {
  // Lista de departamentos
  const [departments, setDepartments] = useState<Department[]>([]);
  // Campos del formulario
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  // Id del departamento que se está editando (null = creando uno nuevo)
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      alert('Error al cargar departamentos: ' + error.message);
    } else {
      setDepartments(data as Department[]);
    }
  };

  // READ: carga los departamentos al abrir la página
  useEffect(() => {
    const cargar = async () => {
      await fetchDepartments();
    };
    cargar();
  }, []);

  // Limpia el formulario y sale del modo edición
  const resetForm = () => {
    setName('');
    setLocation('');
    setEditingId(null);
  };

  // CREATE y UPDATE: guarda el formulario
  const handleSubmit = async () => {
    // Validación: el nombre es obligatorio
    if (!name.trim()) return;

    const datos = {
      name: name.trim(),
      location: location.trim() || null, // Si está vacío se guarda como null
    };

    const { error } = editingId
      ? await supabase.from('departments').update(datos).eq('id', editingId)
      : await supabase.from('departments').insert([datos]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      resetForm();
      fetchDepartments();
    }
  };

  // Llena el formulario con los datos del departamento a editar
  const handleEdit = (department: Department) => {
    setEditingId(department.id);
    setName(department.name);
    setLocation(department.location ?? '');
  };

  // DELETE: elimina un departamento
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('departments').delete().eq('id', id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      fetchDepartments();
    }
  };

  return (
    <main className="pagina">
      <h1 className="pagina-titulo">Gestión de Departamentos</h1>

      {/* Formulario para crear o editar */}
      <section className="tarjeta">
        <h2>{editingId ? 'Editar Departamento' : 'Añadir Nuevo Departamento'}</h2>
        <div className="formulario">
          <input
            placeholder="Nombre del Departamento"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Ubicación (Ej: Piso 3)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="botones">
          <button className="boton" onClick={handleSubmit} disabled={!name.trim()}>
            {editingId ? 'Guardar Cambios' : 'Añadir Departamento'}
          </button>
        </div>
      </section>

      {/* Lista de departamentos */}
      <section className="tarjeta tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th className="acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td className="negrita">{department.name}</td>
                <td>{department.location}</td>
                <td className="acciones">
                  <button className="enlace-editar" onClick={() => handleEdit(department)}>
                    Editar
                  </button>
                  <button className="enlace-eliminar" onClick={() => handleDelete(department.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default DepartmentsPage;
