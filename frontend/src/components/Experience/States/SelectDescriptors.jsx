import { useState, useEffect } from "react";
import axios from "axios";

import styled from "styled-components";

import TaskCheckbox from "../../common/CheckBox";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const StyledDescriptorsContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: flex-start;
  gap: 10px 10px;
  flex-shrink: 0;
  flex-wrap: wrap;

  span {
  }
`;

const SelectDescriptors = ({ context, send }) => {
  const [descriptors, setDescriptors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/descriptors")
      .then((response) => {
        setDescriptors(response.data);
      })
      .catch((error) =>
        console.error("Error al cargar los descriptores:", error)
      );
  }, []);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    if (context.descriptors.length > 0) {
      send({ type: "NEXT" });
    } else {
      alert("Por favor, selecciona al menos un descriptor para continuar."); // Validación
    }
  };

  const handleDescriptorChange = (descriptorName) => {
    const newDescriptors = context.descriptors.includes(descriptorName)
      ? context.descriptors.filter((d) => d !== descriptorName) // Eliminar si ya está seleccionado
      : [...context.descriptors, descriptorName]; // Añadir si no está seleccionado
      
    send({
      type: "UPDATE_CONTEXT",
      data: { descriptors: newDescriptors },
    });
  };

  return (
    <>
      <div className='steps-container'>
        <h2>2. Seleccionar descriptores</h2>
        <h3>
          Explora y selecciona los descriptores relevantes para tu análisis.
        </h3>
      </div>

      <StyledDescriptorsContainer>
        {descriptors.map((descriptor, index) => (
          <TaskCheckbox
            key={index}
            text={descriptor.name}
            onChange={() => handleDescriptorChange(descriptor.name)}
          />
        ))}
      </StyledDescriptorsContainer>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Subir video"}
        />
        <PrimaryButton
          handleClick={handleNext}
          SVG={ArrowRightIcon}
          text={"Seleccionar hiperparametros"}
        />
      </div>
    </>
  );
};

export default SelectDescriptors;
