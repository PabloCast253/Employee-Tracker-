const inquirer = require('inquirer');
const pool = require('./db/connection'); // Ensure this points to your database connection file

// Main menu function
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
            await viewAllDepartments();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
        default:
            console.log('Invalid choice!');
    }

    await mainMenu(); // Return to the main menu after an action
}

// Functions for each choice
async function viewAllDepartments() {
    try {
        const res = await pool.query('SELECT * FROM department');
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing departments:', err.message);
    }
}

async function viewAllRoles() {
    try {
        const res = await pool.query(
            `SELECT role.id, role.title, role.salary, department.name AS department
             FROM role
             JOIN department ON role.department_id = department.id`
        );
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing roles:', err.message);
    }
}

async function viewAllEmployees() {
    try {
        const res = await pool.query(
            `SELECT employee.id, employee.first_name, employee.last_name, 
                    role.title AS role, department.name AS department, 
                    role.salary, 
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
             FROM employee
             LEFT JOIN role ON employee.role_id = role.id
             LEFT JOIN department ON role.department_id = department.id
             LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
        );
        console.table(res.rows);
    } catch (err) {
        console.error('Error viewing employees:', err.message);
    }
}

async function addDepartment() {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter the department name:' },
    ]);

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        console.log(`Added department: ${name}`);
    } catch (err) {
        console.error('Error adding department:', err.message);
    }
}

async function addRole() {
    const { title, salary, departmentId } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' },
        { type: 'input', name: 'departmentId', message: 'Enter the department ID for this role:' },
    ]);

    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
        console.log(`Added role: ${title}`);
    } catch (err) {
        console.error('Error adding role:', err.message);
    }
}

async function addEmployee() {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: 'Enter the employee first name:' },
        { type: 'input', name: 'lastName', message: 'Enter the employee last name:' },
        { type: 'input', name: 'roleId', message: 'Enter the role ID for this employee:' },
        { type: 'input', name: 'managerId', message: 'Enter the manager ID for this employee (or press Enter for none):' },
    ]);

    try {
        await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, roleId, managerId || null]
        );
        console.log(`Added employee: ${firstName} ${lastName}`);
    } catch (err) {
        console.error('Error adding employee:', err.message);
    }
}

async function updateEmployeeRole() {
    const { employeeId, newRoleId } = await inquirer.prompt([
        { type: 'input', name: 'employeeId', message: 'Enter the employee ID to update:' },
        { type: 'input', name: 'newRoleId', message: 'Enter the new role ID for this employee:' },
    ]);

    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
        console.log(`Updated employee ID ${employeeId} with new role ID ${newRoleId}`);
    } catch (err) {
        console.error('Error updating employee role:', err.message);
    }
}

// Start the application
mainMenu().catch((err) => {
    console.error('Error starting application:', err.message);
    process.exit(1);
});