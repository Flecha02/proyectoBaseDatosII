require('dotenv').config();
const app = require('./src/app');
const PUERTO = process.env.PORT || 4000;

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto: ${PUERTO}`);
});