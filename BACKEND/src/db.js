const mysql = require('mysql2/promise')


//pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'pintapro',
    waitForConnections: true, //Espera para las conexiones
    connectionLimit: 10
})

module.exports = pool