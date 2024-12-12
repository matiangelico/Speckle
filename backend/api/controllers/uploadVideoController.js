const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

exports.uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo" });
  }

  const filePath = req.file.path;
  const descriptors = req.body.descriptors;

  try {
    // Lee el archivo de video
    const fileStream = fs.createReadStream(filePath);

    // Construye los datos del formulario
    const formData = new FormData();
    formData.append("file", fileStream, req.file.originalname);

    // `descriptors` debe ser un string JSON válido
    const jsonData = JSON.stringify(descriptors);
    formData.append("jsonData", jsonData);

    // Envía la solicitud al servidor de FastAPI
    const response = await axios.post("http://localhost:8000/calc", formData, {
      headers: formData.getHeaders(),
    });

    // Devuelve la respuesta al frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error al enviar datos al servidor externo:", error);
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error al eliminar archivo temporal:", err);
    });
  }
};




/*exports.uploadVideo = (req, res) => {
  console.log("Entre aVA");
  if (!req.file) {
    console.log("No se recibió ningún archivo");
    return res.status(400).json({ error: "No se recibió ningún archivo" });
  }

  console.log("Entre a uploadVIdeo y recibi:", req.body.descriptors);

  const filePath = req.file.path;
  let descriptors = req.body.descriptors;
  let descriptorParams = req.body.params;

  if (descriptorParams) {
    descriptorParams = JSON.parse(descriptorParams);
    console.log(
      `Los parámetros de los descriptores ${JSON.stringify(descriptorParams)}`
    );
  }

  descriptors = descriptors
    .replace(/[\[\]"]/g, "")
    .split(",")
    .map((descriptor) => descriptor.trim());
  console.log(`Los descriptores limpios son ${descriptors}`);

  // Ajusta la ruta del archivo Python
  const scriptPath = path.join(
    __dirname,
    "../../descriptores/convertirAviaMat.py"
  );

  const processingPromises = descriptors.map((descriptor) => {
    console.log(`El descriptor sanitizado es ${descriptor}`);

    // Ajusta las rutas de salida para archivos MAT y PNG
    const outputMatPath = path.join(
      __dirname,
      "../../uploads",
      `${req.file.filename}_${descriptor}.mat`
    );
    const outputImgPath = path.join(
      __dirname,
      "../../uploads",
      `${req.file.filename}_${descriptor}.png`
    );

    const params = descriptorParams[descriptor]
      ? Object.values(descriptorParams[descriptor])
      : [];
    const paramArgs = params
      .map((param) => `${param.paramName}=${param.value}`)
      .join(" ");

    const command = `python "${scriptPath}" "${filePath}" "${outputMatPath}" "${outputImgPath}" "${descriptor}" ${paramArgs}`;
    console.log(`Ejecutando comando: ${command}`);

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        console.log(
          `Procesamiento de video con descriptor ${descriptor} iniciado`
        );
        if (error) {
          console.error(
            `Error al ejecutar el analizador para el descriptor ${descriptor}: ${error}`
          );
          return reject(
            `Error al procesar el video para descriptor ${descriptor}`
          );
        }
        console.log(stdout);
        console.error(stderr);

        if (fs.existsSync(outputImgPath)) {
          resolve(`/uploads/${req.file.filename}_${descriptor}.png`);
        } else {
          reject(`Error al generar la imagen para ${descriptor}`);
        }
      });
    });
  });

  Promise.all(processingPromises)
    .then((imageUrls) => {
      const result = imageUrls.map((url, index) => ({
        url,
        descriptor: descriptors[index],
      }));

      res.json({ result: "Videos procesados correctamente", images: result });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Hubo un error al procesar algunos descriptores" });
    });
};*/
