// index.js (si usas mysql2 puro)
const app = require('./src/app')
const PUERTO = 3000

app.listen(PUERTO, () => {
    console.log("Servidor corriendo en el puerto: " + PUERTO)
})