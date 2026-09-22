const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/cliente.controller')

router.get('/', clienteController.getClientes)
router.get('/:id', clienteController.getClienteById)
router.post('/', clienteController.postCliente)
router.put('/:id', clienteController.actualizarCliente)
router.delete('/:id', clienteController.eliminarCliente)

module.exports = router