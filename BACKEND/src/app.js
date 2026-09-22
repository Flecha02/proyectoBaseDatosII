const express = require('express');
const cors = require('cors');

const clienteRoutes = require('./routes/cliente.route');
const usuarioRoutes = require('./routes/usuario.route');
const productoRoute = require('./routes/producto.route');
const proveedorRoute = require('./routes/proveedor.route');

const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones desde el Frontend
app.use(express.json());

// Registro de Rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoute);
app.use('/api/proveedores', proveedorRoute);

module.exports = app;