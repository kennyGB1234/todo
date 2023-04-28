const express = require("express");
const app = express();
const mongoose = require("mongoose");
port = 3000;

app.use(express.json());


const rutasUsuarios = require("../backend/routes/rutas-usuarios");
app.use("/api/usuarios", rutasUsuarios);

app.use((req, res) => {

  res.status(404);
  res.json({
    mensaje: "¡ERROR!, no se han podido obtener los datos",
  });
});

mongoose
  .connect(
    "mongodb+srv://kenny:Soloparaesto1@cluster0.b9cjpjk.mongodb.net/proyecto"
  )
  .then(() => {
    app.listen(port, () => console.log(`Escuchando en el puerto: ${port}`));
  })
  .catch((error) => console.log(error));
