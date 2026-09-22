const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

router.get('/', productoController.getProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.postProducto);
router.put('/:id', productoController.putProductoPrecioYStock);

module.exports = router;