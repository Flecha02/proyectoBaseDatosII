const proveedorModel = require('../models/proveedor.model');

async function getProveedores(req, res) {
    try {
        const proveedores = await proveedorModel.obtenerProveedores();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los proveedores', error: error.message });
    }
}

async function getProveedorById(req, res) {
    try {
        const { id } = req.params;
        const proveedor = await proveedorModel.obtenerProveedorPorId(id);
        if (!proveedor) return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el proveedor', error: error.message });
    }
}

async function postProveedor(req, res) {
    const { nitProveedor, nombreProveedor } = req.body;

    if (!nitProveedor || !nombreProveedor) {
        return res.status(400).json({ mensaje: 'El NIT y el nombre del proveedor son obligatorios' });
    }

    try {
        const idInsertado = await proveedorModel.crearProveedor(req.body);
        res.status(201).json({ mensaje: 'Proveedor creado correctamente', idProveedor: idInsertado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el proveedor', error: error.message });
    }
}

async function putProveedor(req, res) {
    const { id } = req.params;
    const { nitProveedor, nombreProveedor, telefonoProveedor, direccionProveedor } = req.body;

    if (!nitProveedor || !nombreProveedor) {
        return res.status(400).json({ mensaje: 'El NIT y el nombre del proveedor son obligatorios' });
    }

    try {
        const filasAfectadas = await proveedorModel.actualizarProveedor(id, {
            nitProveedor,
            nombreProveedor,
            telefonoProveedor,
            direccionProveedor
        });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }

        res.status(200).json({ mensaje: 'Proveedor actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el proveedor', error: error.message });
    }
}

module.exports = {
    getProveedores,
    getProveedorById,
    postProveedor,
    putProveedor
};