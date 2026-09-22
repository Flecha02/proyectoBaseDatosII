const pool = require('../config/database');

async function obtenerProductos() {
    const sql = `
        SELECT 
            p.idProducto,
            p.codigoProducto,
            p.nombreProducto,
            p.marcaProducto,
            p.colorProducto,
            p.precioVentaProducto,
            p.stockMinimoProducto,
            c.idCategoria,
            c.nombreCategoria,
            m.idMedidaPresentacion,
            m.descripcionMedida
        FROM Producto p
        INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
        INNER JOIN MedidaPresentacion m ON p.idMedidaPresentacion = m.idMedidaPresentacion
    `;
    const [filas] = await pool.query(sql);
    return filas;
}

async function obtenerProductoPorId(id) {
    const sql = `
        SELECT 
            p.idProducto,
            p.codigoProducto,
            p.nombreProducto,
            p.marcaProducto,
            p.colorProducto,
            p.precioVentaProducto,
            p.stockMinimoProducto,
            c.idCategoria,
            c.nombreCategoria,
            m.idMedidaPresentacion,
            m.descripcionMedida
        FROM Producto p
        INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
        INNER JOIN MedidaPresentacion m ON p.idMedidaPresentacion = m.idMedidaPresentacion
        WHERE p.idProducto = ?
    `;
    const [filas] = await pool.query(sql, [id]);
    return filas[0];
}

async function crearProducto({ 
    idCategoria, 
    idMedidaPresentacion, 
    codigoProducto, 
    nombreProducto, 
    marcaProducto, 
    colorProducto, 
    precioVentaProducto, 
    stockMinimoProducto 
}) {
    const sql = `
        INSERT INTO Producto (
            idCategoria, 
            idMedidaPresentacion, 
            codigoProducto, 
            nombreProducto, 
            marcaProducto, 
            colorProducto, 
            precioVentaProducto, 
            stockMinimoProducto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await pool.query(sql, [
        idCategoria, 
        idMedidaPresentacion, 
        codigoProducto, 
        nombreProducto, 
        marcaProducto, 
        colorProducto || null, 
        precioVentaProducto, 
        stockMinimoProducto || 0
    ]);
    return resultado.insertId;
}

// PUT restrictivo: Solo actualiza precioVentaProducto y stockMinimoProducto
async function actualizarPrecioYStock(id, { precioVentaProducto, stockMinimoProducto }) {
    const sql = `
        UPDATE Producto 
        SET precioVentaProducto = ?, stockMinimoProducto = ?
        WHERE idProducto = ?
    `;
    const [resultado] = await pool.query(sql, [precioVentaProducto, stockMinimoProducto, id]);
    return resultado.affectedRows;
}

async function eliminarProducto(id) {
    const sql = 'DELETE FROM Producto WHERE idProducto = ?';
    const [resultado] = await pool.query(sql, [id]);
    return resultado.affectedRows;
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarPrecioYStock,
    eliminarProducto
};