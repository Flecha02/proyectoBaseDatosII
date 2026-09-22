const UsuarioModel = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
// GET /api/usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.obtenerTodos();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
    }
};

// GET /api/usuarios/:id
exports.obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await UsuarioModel.obtenerPorId(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /api/usuarios (Crear Usuario con Contraseña Encriptada)
exports.crearUsuario = async (req, res) => {
    const { idRol, nombreUsuario, correoUsuario, contraseniaUsuario } = req.body;

    if (!idRol || !nombreUsuario || !correoUsuario || !contraseniaUsuario) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    try {
        // 1. Generar el hash de la contraseña (10 salt rounds es el estándar seguro)
        const saltRounds = 10;
        const contraseniaEncriptada = await bcrypt.hash(contraseniaUsuario, saltRounds);

        // 2. Guardar en la base de datos con la contraseña ya encriptada
        const idInsertado = await UsuarioModel.crear({ 
            idRol, 
            nombreUsuario, 
            correoUsuario, 
            contraseniaUsuario: contraseniaEncriptada 
        });

        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            idUsuario: idInsertado
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
        }
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// PUT /api/usuarios/:id
exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { idRol, nombreUsuario, correoUsuario } = req.body;

    if (!idRol || !nombreUsuario || !correoUsuario) {
        return res.status(400).json({ mensaje: 'Los campos idRol, nombreUsuario y correoUsuario son obligatorios' });
    }

    try {
        const filasAfectadas = await UsuarioModel.actualizar(id, { idRol, nombreUsuario, correoUsuario });
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// PATCH /api/usuarios/:id/estado (Switch automático)
exports.cambiarEstadoUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const nuevoEstado = await UsuarioModel.alternarEstado(id);
        
        if (nuevoEstado === null) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({
            mensaje: `Estado del usuario cambiado exitosamente`,
            estadoUsuario: Boolean(nuevoEstado)
        });
    } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error);
        res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
    }
};

// POST /api/usuarios/login
exports.login = async (req, res) => {
    const { correoUsuario, contraseniaUsuario } = req.body;

    // 1. Validar que vengan los datos requeridos
    if (!correoUsuario || !contraseniaUsuario) {
        return res.status(400).json({ mensaje: 'El correo y la contraseña son obligatorios' });
    }

    try {
        // 2. Ejecutar el Stored Procedure mediante el Modelo
        const usuario = await UsuarioModel.obtenerPorCorreoLogin(correoUsuario);

        // Si no existe o está inactivo
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas o usuario inactivo' });
        }

        // 3. Comparar la contraseña enviada con la contraseña encriptada (hash)
        const contraseniaCoincide = await bcrypt.compare(contraseniaUsuario, usuario.contraseniaUsuario);

        if (!contraseniaCoincide) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // 4. Si la contraseña es correcta, eliminamos la contraseña del objeto antes de responder
        delete usuario.contraseniaUsuario;

        // 5. Responder al Frontend con la información del usuario logueado
        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                idUsuario: usuario.idUsuario,
                nombreUsuario: usuario.nombreUsuario,
                correoUsuario: usuario.correoUsuario,
                idRol: usuario.idRol,
                nombreRol: usuario.nombreRol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
    }
};

// DELETE /api/usuarios/:id
exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const filasAfectadas = await UsuarioModel.eliminar(id);
        if (filasAfectadas === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno al eliminar el usuario' });
    }
};