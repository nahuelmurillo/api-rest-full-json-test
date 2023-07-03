// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const {
  leerFrutas,
  guardarFrutas
} = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
  res.send(BD);
});

// Inicio Practica 9

//Ruta que modifica el dato de la fruta con el Id
app.put('/frutas/:id', (req, res) => {
  const frutaActualizada = req.body;
  const idFruta = parseInt(req.params.id);
  const index = BD.findIndex(fruta => fruta.id == idFruta); //Obtengo indice

  if (index < 0) {
    return res.status(404).send(`Fruta No Actualizada!. Id: ${idFruta}`);
  }

  BD[index] = frutaActualizada;
  guardarFrutas(BD);
  res.status(201).send(`Fruta Actualizada!. Id: ${idFruta}`);
});

// Ruta que elimina el dato de la fruta con el Id
app.delete("/frutas/:id", (req, res) => {
  const idFruta = parseInt(req.params.id);
  const index = BD.findIndex(fruta => fruta.id == idFruta);//Obtengo indice

  if (index < 0) {
    return res.status(404).send(`Fruta No Eliminada!. Id: ${idFruta}`);
  }

  BD.splice(index, 1);
  guardarFrutas(BD);
  res.status(201).send(`Fruta Eliminada!. Id: ${idFruta}`);

});

// Ruta que devuelve los datos de la fruta con el Id
app.get("/frutas/:id", (req, res) => {
  const idFruta = parseInt(req.params.id);
  const resultado = BD.find(fruta => fruta.id === idFruta);
  resultado ? res.status(201).json(resultado) : res.status(404).send(`No se encontraron coincidencias de id: ${idFruta}`);
});

//Fin Inicio Practica 9

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
  const nuevaFruta = req.body;
  BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
  guardarFrutas(BD); // Guardar los cambios en el archivo
  res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});