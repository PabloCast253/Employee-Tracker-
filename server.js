// server.js
const inquirer = require('inquirer');
const db = require('./db/queries'); // Our db functions

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View All Departments':
      await handleViewAllDepartments();
      break;

    case 'View All Roles':
      await handleViewAllRoles();
      break;

    case 'View All Employees':
      await handleViewAllEmployees();
      break;

    case 'Add Department':
      await handleAddDepartment();
      break;

    case 'Add Role':
      await handleAddRole();
      break;

    case 'Add Employee':
      await handleAddEmployee();
      break;

    case 'Update Employee Role':
      await handleUpdateEmployeeRole();
      break;

    case 'Exit':
      console.log('Goodbye!');
      process.exit(0);

    default:
      console.log('Invalid choice!');
  }

  // After handling user’s selection, show main menu again
  return mainMenu();
}

// =============== HANDLERS ===============

async function handleViewAllDepartments() {
  const departments = await db.getDepartments();
  console.table(departments);
}

async function handleViewAllRoles() {
  const roles = await db.getRoles();
  console.table(roles);
}

async function handleViewAllEmployees() {
  const employees = await db.getEmployees();
  console.table(employees);
}

async function handleAddDepartment() {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the new department name:',
    },
  ]);

  await db.insertDepartment(departmentName);
  console.log(`\nDepartment "${departmentName}" added!\n`);
}

async function handleAddRole() {
  const { title, salary, departmentId } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter the role title:' },
    { type: 'input', name: 'salary', message: 'Enter the role salary:' },
    {
      type: 'input',
      name: 'departmentId',
      message: 'Enter the department ID for this role:',
    },
  ]);

  await db.insertRole(title, salary, departmentId);
  console.log(`\nRole "${title}" added!\n`);
}

async function handleAddEmployee() {
  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    { type: 'input', name: 'firstName', message: 'First name:' },
    { type: 'input', name: 'lastName', message: 'Last name:' },
    { type: 'input', name: 'roleId', message: 'Role ID:' },
    {
      type: 'input',
      name: 'managerId',
      message: 'Manager ID (press Enter for none):',
      default: null,
    },
  ]);

  await db.insertEmployee(firstName, lastName, roleId, managerId);
  console.log(`\nEmployee "${firstName} ${lastName}" added!\n`);
}

async function handleUpdateEmployeeRole() {
  const { employeeId, newRoleId } = await inquirer.prompt([
    { type: 'input', name: 'employeeId', message: 'Enter the Employee ID:' },
    { type: 'input', name: 'newRoleId', message: 'Enter the new Role ID:' },
  ]);

  await db.updateEmployeeRole(employeeId, newRoleId);
  console.log(`\nEmployee ${employeeId} role updated to ${newRoleId}!\n`);
}

// Start the program
mainMenu().catch((err) => {
  console.error('Application Error:', err);
  process.exit(1);
});