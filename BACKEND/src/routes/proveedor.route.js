const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');

router.get('/', proveedorController.getProveedores);
router.get('/:id', proveedorController.getProveedorById);
router.post('/', proveedorController.postProveedor);
router.put('/:id', proveedorController.putProveedor);

module.exports = router;