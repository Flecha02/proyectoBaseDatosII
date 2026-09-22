const pool = require('../config/database');

async function obtenerClientes() {
    const [filas] = await pool.query('SELECT * FROM Cliente');
    return filas;
}

async function obtenerClientePorId(id) {
    const [filas] = await pool.query('SELECT * FROM Cliente WHERE idCliente = ?', [id]);
    return filas[0];
}

async function crearCliente({ nitCliente, nombreCliente, telefonoCliente, direccionCliente }) {
    const sql = 'INSERT INTO Cliente (nitCliente, nombreCliente, telefonoCliente, direccionCliente) VALUES (?, ?, ?, ?)';
    const [resultado] = await pool.query(sql, [nitCliente, nombreCliente, telefonoCliente, direccionCliente]);
    return resultado.insertId;
}

async function actualizarCliente(id, { nitCliente, nombreCliente, telefonoCliente, direccionCliente }) {
    const sql = `
        UPDATE Cliente 
        SET nitCliente = ?, nombreCliente = ?, telefonoCliente = ?, direccionCliente = ?
        WHERE idCliente = ?
    `;
    const [resultado] = await pool.query(sql, [
        nitCliente, 
        nombreCliente, 
        telefonoCliente, 
        direccionCliente, 
    ]);
    return resultado.affectedRows;
}

async function eliminarCliente(id) {
    const sql = 'DELETE FROM Cliente WHERE idCliente = ?';
    const [resultado] = await pool.query(sql, [id]);
    return resultado.affectedRows;
}

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};