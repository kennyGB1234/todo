const express = require("express");
const Usuario = require("../models/models-usuarios");
const router = express.Router();
const bcrypt = require("bcryptjs");


router.get("/", async (req, res, next) => {
  let usuarios;
  try {
    usuarios = await Usuario.find({} );
  } catch (err) {
    const error = new Error("¡ERROR! datos no encontrados");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    usuarios: usuarios,
  });
});


router.get("/:id", async (req, res, next) => {
  const idUsuario = req.params.id;
  let usuario;
  try {
    usuario = await Usuario.findById(idUsuario);
  } catch (err) {
    const error = new Error(
      "¡ERROR! datos no encontrados en base a dicho ID"
    );
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    usuario: usuario,
  });
});


router.post("/", async (req, res, next) => {
  const { nombre, email, contraseña, activo } = req.body;
  let existeUsuario;
  try {
    existeUsuario = await Usuario.findOne({
      email: email,
    });
  } catch (err) {
    const error = new Error(err);
    error.code = 500;
    console.log("Este email ya existe");
    return next(error);
  }

  if (existeUsuario) {
    const error = new Error("Este usuario ya existe");
    error.code = 401; 
    return next(error);
  } else {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(contraseña, 12);
    } catch (error) {
      const err = new Error("No se pudo crear el usuario");
      err.code = 500;
      return next(err);
    }
    console.log(hashedPassword);
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contraseña: hashedPassword,
      activo,
    });
    try {
      await nuevoUsuario.save();
    } catch (error) {
      const err = new Error("No se han guardado los datos");
      err.code = 500;
      return next(err);
    }
    res.status(201).json({
      usuario: nuevoUsuario,
    });
  }
});

router.post("/login", async (req, res, next) => {
  const { email, contraseña} = req.body;
  let usuarioExiste;
  try {
    usuarioExiste = await Usuario.findOne({
      email: email,
    });
  } catch (error) {
    const err = new Error(
      "No se ha podido realizar la operación"
    );
    err.code = 500;
    return next(err);
  }
  console.log(usuarioExiste);
  if (!usuarioExiste) {
    const error = new Error(
      "No se ha podido identificar al usuario"
    ); 
    error.code = 422; 
    return next(error);
  }

  let esValidoPassword = false;
  esValidoPassword = bcrypt.compareSync(contraseña, usuarioExiste.contraseña);
  if (!esValidoPassword) {
    const error = new Error(
      "No se ha podido identificar al usuario"
    );
    error.code = 401; 
    return next(error);
  }
  res.json({
    mensaje: "usuario logueado", 
    email: usuarioExiste.email,
  });
});



module.exports = router;