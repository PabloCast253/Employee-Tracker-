onst inquirer = require('inquirer');
const { viewAllDepartments } = require('./db/queries');

const mainMenu = async () => {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'Exit'
            ],
        },
    ]);

    if (choice === 'View all departments') {
        const departments = await viewAllDepartments();
        console.table(departments);
    }

    if (choice === 'Exit') process.exit();
};

mainMenu();