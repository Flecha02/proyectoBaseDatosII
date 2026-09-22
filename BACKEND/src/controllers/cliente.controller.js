const clienteModel = require('../models/cliente.model');

async function getClientes(req, res) {
    try {
        const clientes = await clienteModel.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los clientes', error: error.message });
    }
}

async function getClienteById(req, res) {
    try {
        const { id } = req.params;
        const cliente = await clienteModel.obtenerClientePorId(id);
        if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el cliente', error: error.message });
    }
}

async function postCliente(req, res) {
    try {
        const idInsertado = await clienteModel.crearCliente(req.body);
        res.status(201).json({ mensaje: 'Cliente creado correctamente', idCliente: idInsertado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el cliente', error: error.message });
    }
}

async function actualizarCliente(req, res) {
    const { id } = req.params;
    const { nitCliente, nombreCliente, telefonoCliente, direccionCliente } = req.body;

    if (!nitCliente || !nombreCliente) {
        return res.status(400).json({ mensaje: 'El NIT y el nombre del cliente son obligatorios' });
    }

    try {
        const filasAfectadas = await clienteModel.actualizarCliente(id, { 
            nitCliente, 
            nombreCliente, 
            telefonoCliente, 
            direccionCliente 
        });

        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        res.status(200).json({ mensaje: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'Error interno al actualizar el cliente' });
    }
}

// Exportamos TODAS las funciones juntas en un solo objeto
module.exports = {
    getClientes,
    getClienteById,
    postCliente,
    actualizarCliente
};