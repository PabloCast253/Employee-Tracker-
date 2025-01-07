
// db/queries.js
const pool = require('./connection');

// View all departments
async function getDepartments() {
  const { rows } = await pool.query('SELECT * FROM department ORDER BY id');
  return rows; // Return rows to be displayed in server.js
}

// View all roles (including department info)
async function getRoles() {
  const { rows } = await pool.query(`
    SELECT
      role.id,
      role.title,
      role.salary,
      department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
    ORDER BY role.id
  `);
  return rows;
}

// View all employees (including role, department, manager info)
async function getEmployees() {
  const { rows } = await pool.query(`
    SELECT
      e.id,
      e.first_name,
      e.last_name,
      role.title AS role,
      department.name AS department,
      role.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id
    ORDER BY e.id
  `);
  return rows;
}

// Add a department
async function insertDepartment(name) {
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
}

// Add a role
async function insertRole(title, salary, departmentId) {
  await pool.query(
    'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
    [title, salary, departmentId]
  );
}

// Add an employee
async function insertEmployee(firstName, lastName, roleId, managerId) {
  await pool.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, roleId, managerId || null]
  );
}

// Update an employee’s role
async function updateEmployeeRole(employeeId, newRoleId) {
  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
    newRoleId,
    employeeId,
  ]);
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  insertDepartment,
  insertRole,
  insertEmployee,
  updateEmployeeRole,
};