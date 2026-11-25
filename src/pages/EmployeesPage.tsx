import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Employee } from '../types/employee';
import type { Department } from '../types/department';

// Da formato de pesos al salario (Ej: 3000000 -> $3.000.000)
const formatSalary = (salary: number) =>
  '$' + salary.toLocaleString('es-CO');

/**
 * Página para crear, ver, editar y eliminar empleados.
 */
function EmployeesPage() {
  // Listas que vienen de Supabase
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  // Campos del formulario
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  // Id del empleado que se está editando (null = creando uno nuevo)
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchEmployees = async () => {
    // Trae también el nombre del departamento gracias a la llave foránea
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, position, salary, department_id, departments ( name )')
      .order('name', { ascending: true });

    if (error) {
      alert('Error al cargar empleados: ' + error.message);
    } else {
      setEmployees(data as unknown as Employee[]);
    }
  };

  // Los departamentos se usan para llenar el <select>
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

  // READ: carga empleados y departamentos al abrir la página
  useEffect(() => {
    const cargar = async () => {
      await fetchEmployees();
      await fetchDepartments();
    };
    cargar();
  }, []);

  // Limpia el formulario y sale del modo edición
  const resetForm = () => {
    setName('');
    setPosition('');
    setSalary('');
    setDepartmentId('');
    setEditingId(null);
  };

  // El formulario es válido si los campos requeridos no están vacíos
  const isValid = name.trim() !== '' && position.trim() !== '' && Number(salary) > 0;

  // CREATE y UPDATE: guarda el formulario
  const handleSubmit = async () => {
    // Validación: no se envían datos requeridos vacíos
    if (!isValid) return;

    const datos = {
      name: name.trim(),
      position: position.trim(),
      salary: Number(salary),
      department_id: departmentId || null, // Sin departamento = null
    };

    const { error } = editingId
      ? await supabase.from('employees').update(datos).eq('id', editingId)
      : await supabase.from('employees').insert([datos]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      resetForm();
      fetchEmployees();
    }
  };

  // Llena el formulario con los datos del empleado a editar
  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setName(employee.name);
    setPosition(employee.position);
    setSalary(String(employee.salary));
    setDepartmentId(employee.department_id ?? '');
  };

  // DELETE: elimina un empleado
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      fetchEmployees();
    }
  };

  return (
    <main className="pagina">
      <h1 className="pagina-titulo">Gestión de Empleados</h1>

      {/* Formulario para crear o editar */}
      <section className="tarjeta">
        <h2>{editingId ? 'Editar Empleado' : 'Añadir Nuevo Empleado'}</h2>
        <div className="formulario">
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Puesto (Ej: Desarrollador)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <input
            type="number"
            placeholder="Salario"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="">Seleccionar Departamento</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div className="botones">
          <button className="boton" onClick={handleSubmit} disabled={!isValid}>
            {editingId ? 'Guardar Cambios' : 'Añadir Empleado'}
          </button>
        </div>
      </section>

      {/* Lista de empleados */}
      <section className="tarjeta tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Puesto</th>
              <th>Departamento</th>
              <th>Salario</th>
              <th className="acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="negrita">{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.departments?.name}</td>
                <td className="salario">{formatSalary(employee.salary)}</td>
                <td className="acciones">
                  <button className="enlace-editar" onClick={() => handleEdit(employee)}>
                    Editar
                  </button>
                  <button className="enlace-eliminar" onClick={() => handleDelete(employee.id)}>
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

export default EmployeesPage;
