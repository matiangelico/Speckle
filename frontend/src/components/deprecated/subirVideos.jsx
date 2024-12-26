import { useState } from "react";
import axios from "axios";
import DescriptorSelection from "./DescriptorSelection";
import ImageDisplay from "./ImageDisplay";

const UploadVideo = () => {
  const [defaultValues, setDefaultValues] = useState([]);
  const [descriptorList, setDescriptorList] = useState([]);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedDescriptors, setSelectedDescriptors] = useState({});
  const [descriptorsVisible, setDescriptorsVisible] = useState(false);
  const [descriptorParams, setDescriptorParams] = useState({});

  // Manejadores de eventos y funciones auxiliares
  const handleFileChange = async (event) => {
    const selectedVideo = event.target.files[0];
    setVideo(selectedVideo);

    try {
      const response = await fetch("http://localhost:5000/descriptor");
      if (!response.ok) throw new Error("Error en la red");
      const data = await response.json();
      const transformedData = transformResponse(data);
      setDefaultValues(transformedData.defaultValues);
      setDescriptorList(transformedData.descriptorList);
      setDescriptorsVisible(true);

      const initialSelectedDescriptors = {};
      const initialDescriptorParams = {};

      transformedData.descriptorList.forEach((descriptor) => {
        initialSelectedDescriptors[descriptor.name] = false;
        initialDescriptorParams[descriptor.name] = descriptor.params.map(
          (param) => ({
            paramName: param.paramName,
            value: param.value,
          })
        );
      });

      setSelectedDescriptors(initialSelectedDescriptors);
      setDescriptorParams(initialDescriptorParams);
    } catch (error) {
      console.error("Error al cargar los descriptores:", error);
      setMessage("Error al cargar los descriptores.");
    }
  };

  const transformResponse = (response) => {
    const result = {
      defaultValues: {},
      descriptorList: [],
    };

    response.forEach((item) => {
      const paramsArray = item.params.map((param) => ({
        paramName: param.paramName,
        value: param.value,
      }));

      result.descriptorList.push({
        _id: item._id,
        name: item.name,
        params: paramsArray,
      });

      result.defaultValues[item.name] = item.params;
    });

    return result;
  };

  const handleDescriptorChange = (event) => {
    const { name, checked } = event.target;
    setSelectedDescriptors((prev) => ({
      ...prev,
      [name]: checked,
    }));

    if (checked) {
      setDescriptorParams((prev) => ({
        ...prev,
        [name]: descriptorParams[name],
      }));
    } else {
      setDescriptorParams((prev) => {
        const { [name]: _, ...rest } = prev;

        console.log(_);

        return rest;
      });
    }
  };

  const handleParamChange = (descriptor, param, value) => {
    setDescriptorParams((prev) => ({
      ...prev,
      [descriptor]: prev[descriptor].map((p) =>
        p.paramName === param ? { ...p, value } : p
      ),
    }));
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage("Por favor, selecciona un video.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    /*const descriptors = Object.keys(selectedDescriptors).filter(
      (key) => selectedDescriptors[key]
    );*/
    //formData.append("descriptors", JSON.stringify(descriptors));
    //formData.append("params", JSON.stringify(descriptorParams));

    const formattedDescriptors = Object.keys(selectedDescriptors)
      .filter((descriptorName) => selectedDescriptors[descriptorName])
      .map((descriptorName) => ({
        name: descriptorName,
        params: descriptorParams[descriptorName] || [],
      }));
    
    
    console.log(formattedDescriptors);

    formData.append("descriptors", JSON.stringify(formattedDescriptors));

    

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/uploadVideo",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.result);
      console.log("Recibo data :", response.data);

      setImageUrls(
        Array.isArray(response.data.images) ? response.data.images : []
      );

      console.log("Envio data images:", response.data.images);

    } catch (error) {
      console.log(error);
      setMessage("Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  const isAnyDescriptorSelected = Object.values(selectedDescriptors).some(
    (checked) => checked
  );

  //BORRAR/////////////////////////
  console.log(defaultValues);
  ////////////////////////////////
  return (
    <div>
      <input type='file' accept='video/avi' onChange={handleFileChange} />
      {descriptorsVisible && (
        <DescriptorSelection
          descriptorList={descriptorList}
          selectedDescriptors={selectedDescriptors}
          descriptorParams={descriptorParams}
          onDescriptorChange={handleDescriptorChange}
          onParamChange={handleParamChange}
        />
      )}
      <button
        onClick={handleUpload}
        disabled={loading || !descriptorsVisible || !isAnyDescriptorSelected}
      >
        {loading ? "Cargando..." : "Enviar Descriptores"}
      </button>
      {message && <p>{message}</p>}
      <ImageDisplay imageUrls={imageUrls} /> {/* Usa el nuevo componente */}
    </div>
  );
};

export default UploadVideo;
