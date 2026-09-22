const express = require('express')
const router = express.Router()
const clienteController = require('../controllers/cliente.controller')

router.get('/', clienteController.getClientes)
router.get('/:id', clienteController.getClienteById)
router.post('/', clienteController.postCliente)
router.put('/:id', clienteController.actualizarCliente)

module.exports = router