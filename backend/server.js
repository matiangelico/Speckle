require('dotenv').config();

const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const { auth } = require("express-openid-connect");

const defaultValuesRoutes = require("./api/routes/defaultValuesRoutes");
const uploadVideoRoutes = require("./api/routes/uploadVideoRoutes");
const clusteringRoutes = require("./api/routes/clusteringRoutes");
const trainingRoutes = require("./api/routes/trainingRoutes");
const experienceRoutes = require("./api/routes/experienceRoutes");
const predictionRoutes = require("./api/routes/predictionRoutes");
const downloadRoutes = require("./api/routes/downloadRoutes");
const videoDimensionsRoutes = require("./api/routes/videoDimensionsRoutes");

app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
  console.log(`Método: ${req.method}, Ruta: ${req.originalUrl}`);
  next();
});

mongoose
  .connect("mongodb+srv://ignaciosuarez:hola123@speckle.grnl5.mongodb.net/Speckle")
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB", error);
  });

app.use("/defaultValues", defaultValuesRoutes);
app.use("/uploadVideo", uploadVideoRoutes);
app.use("/clustering", clusteringRoutes);
app.use("/training", trainingRoutes);
app.use("/experience", experienceRoutes);
app.use("/prediction", predictionRoutes);
app.use("/download", downloadRoutes);
app.use("/dimensions", videoDimensionsRoutes);


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
