const pool = require('./connection');

const viewAllDepartments = async () => {
    const result = await pool.query('SELECT * FROM department');
    return result.rows;
};

module.exports = { viewAllDepartments };