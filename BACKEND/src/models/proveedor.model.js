const pool = require('../config/database');

async function obtenerProveedores() {
    const sql = 'SELECT * FROM Proveedor';
    const [filas] = await pool.query(sql);
    return filas;
}

async function obtenerProveedorPorId(id) {
    const sql = 'SELECT * FROM Proveedor WHERE idProveedor = ?';
    const [filas] = await pool.query(sql, [id]);
    return filas[0];
}

async function crearProveedor({ nitProveedor, nombreProveedor, telefonoProveedor, direccionProveedor }) {
    const sql = `
        INSERT INTO Proveedor (nitProveedor, nombreProveedor, telefonoProveedor, direccionProveedor)
        VALUES (?, ?, ?, ?)
    `;
    const [resultado] = await pool.query(sql, [
        nitProveedor,
        nombreProveedor,
        telefonoProveedor || null,
        direccionProveedor || null
    ]);
    return resultado.insertId;
}

async function actualizarProveedor(id, { nitProveedor, nombreProveedor, telefonoProveedor, direccionProveedor }) {
    const sql = `
        UPDATE Proveedor 
        SET nitProveedor = ?, nombreProveedor = ?, telefonoProveedor = ?, direccionProveedor = ?
        WHERE idProveedor = ?
    `;
    const [resultado] = await pool.query(sql, [
        nitProveedor,
        nombreProveedor,
        telefonoProveedor || null,
        direccionProveedor || null,
        id
    ]);
    return resultado.affectedRows;
}

async function eliminarProveedor(id) {
    const sql = 'DELETE FROM Proveedor WHERE idProveedor = ?';
    const [resultado] = await pool.query(sql, [id]);
    return resultado.affectedRows;
}

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};