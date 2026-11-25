// Tipo para la tabla 'employees'
export interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  department_id: string;
  departments: { name: string };
}