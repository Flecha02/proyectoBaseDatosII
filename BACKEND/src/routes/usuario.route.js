const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Definición de las rutas del CRUD
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.patch('/:id/estado', usuarioController.cambiarEstadoUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
// Ruta para el inicio de sesión
router.post('/login', usuarioController.login);

module.exports = router;