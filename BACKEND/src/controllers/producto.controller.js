const productoModel = require('../models/producto.model');

async function getProductos(req, res) {
    try {
        const productos = await productoModel.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
}

async function getProductoById(req, res) {
    try {
        const { id } = req.params;
        const producto = await productoModel.obtenerProductoPorId(id);
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
    }
}

async function postProducto(req, res) {
    const { 
        idCategoria, 
        idMedidaPresentacion, 
        codigoProducto, 
        nombreProducto, 
        marcaProducto, 
        precioVentaProducto 
    } = req.body;

    if (!idCategoria || !idMedidaPresentacion || !codigoProducto || !nombreProducto || !marcaProducto || precioVentaProducto === undefined) {
        return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser proporcionados' });
    }

    try {
        const idInsertado = await productoModel.crearProducto(req.body);
        res.status(201).json({ mensaje: 'Producto creado correctamente', idProducto: idInsertado });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'El código de producto ya está registrado' });
        }
        res.status(500).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
}

async function putProductoPrecioYStock(req, res) {
    const { id } = req.params;
    const { precioVentaProducto, stockMinimoProducto } = req.body;

    if (precioVentaProducto === undefined || stockMinimoProducto === undefined) {
        return res.status(400).json({ mensaje: 'Se requiere precioVentaProducto y stockMinimoProducto' });
    }

    try {
        const filasAfectadas = await productoModel.actualizarPrecioYStock(id, {
            precioVentaProducto,
            stockMinimoProducto
        });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json({ mensaje: 'Precio y stock mínimo actualizados exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
}

async function eliminarProducto(req, res) {
    const { id } = req.params;
    try {
        const filasAfectadas = await productoModel.eliminarProducto(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ mensaje: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
}

module.exports = {
    getProductos,
    getProductoById,
    postProducto,
    putProductoPrecioYStock,
    eliminarProducto
};