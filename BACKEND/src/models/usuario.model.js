const db = require('../config/database');

const UsuarioModel = {
    // Obtener todos los usuarios
    obtenerTodos: async () => {
        const query = `
            SELECT u.idUsuario, u.nombreUsuario, u.correoUsuario, u.estadoUsuario, u.idRol, r.nombreRol 
            FROM Usuario u
            INNER JOIN Rol r ON u.idRol = r.idRol
        `;
        const [filas] = await db.query(query);
        return filas;
    },

    // Obtener un usuario por ID
    obtenerPorId: async (id) => {
        const query = `
            SELECT u.idUsuario, u.nombreUsuario, u.correoUsuario, u.estadoUsuario, u.idRol, r.nombreRol 
            FROM Usuario u
            INNER JOIN Rol r ON u.idRol = r.idRol
            WHERE u.idUsuario = ?
        `;
        const [filas] = await db.query(query, [id]);
        return filas[0];
    },

    // AQUÍ DEBE ESTAR LA FUNCIÓN PARA EL LOGIN:
    obtenerPorCorreoLogin: async (correoUsuario) => {
        const query = 'CALL sp_ObtenerUsuarioParaLogin(?)';
        const [filas] = await db.query(query, [correoUsuario]);
        return filas[0][0] || null;
    },

    // Crear un nuevo usuario
    crear: async ({ idRol, nombreUsuario, correoUsuario, contraseniaUsuario }) => {
        const query = `
            INSERT INTO Usuario (idRol, nombreUsuario, correoUsuario, contraseniaUsuario)
            VALUES (?, ?, ?, ?)
        `;
        const [resultado] = await db.query(query, [idRol, nombreUsuario, correoUsuario, contraseniaUsuario]);
        return resultado.insertId;
    },

    // Actualizar datos del usuario
    actualizar: async (id, { idRol, nombreUsuario, correoUsuario }) => {
        const query = `
            UPDATE Usuario 
            SET idRol = ?, nombreUsuario = ?, correoUsuario = ?
            WHERE idUsuario = ?
        `;
        const [resultado] = await db.query(query, [idRol, nombreUsuario, correoUsuario, id]);
        return resultado.affectedRows;
    },

    // Alternar estado (Toggle / Switch)
    alternarEstado: async (id) => {
        const query = `
            UPDATE Usuario 
            SET estadoUsuario = NOT estadoUsuario 
            WHERE idUsuario = ?
        `;
        const [resultado] = await db.query(query, [id]);
        
        if (resultado.affectedRows === 0) return null;

        const [filas] = await db.query('SELECT estadoUsuario FROM Usuario WHERE idUsuario = ?', [id]);
        return filas[0].estadoUsuario;
    }
};

module.exports = UsuarioModel;