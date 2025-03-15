import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import { initializeDescriptorsResult } from "../../../reducers/requestReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Commons
import Input from "../../common/Input";
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Loader from "../../common/Loader";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

//Utils
import { extractTextBetweenParentheses } from "../../../utils/stringUtils";
import Select from "../../common/Select";

//Hooks
import useToken from "../../../Hooks/useToken";

const HyperparametersContainer = styled.div`
  display: grid;
  gap: 10px;
  grid-auto-rows: min-content;
  width: 100%;

  /* Personaliza el ancho de la barra */
  &::-webkit-scrollbar {
    width: 0px;
    box-sizing: content-box;
  }

  @media (min-height: 900px) {
    gap: 20px;
  }
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  input {
    margin-bottom: 0;
  }
`;

const EditHyperparameters = ({ send, chekedDescriptors }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const chekedHyperparameters = chekedDescriptors.filter(
    (descriptor) => descriptor.hyperparameters.length > 0
  );

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = async () => {
    if (chekedDescriptors.length === 0) {
      send({ type: "BACK" });
      return;
    }

    if (!tokenLoading && token) {
      setIsLoading(true);
      try {
        await dispatch(initializeDescriptorsResult(token));
        send({ type: "NEXT" });
        dispatch(
          createNotification(`Resultados generados correctamente.`, "success")
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error al procesar la petición:", error);
        dispatch(
          createNotification(
            `Ha ocurrido un error vuelve a intentarlo.`,
            "error"
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='steps-container'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>3. Hiperparámetros utilizados</h2>
            <h3>
              A continuacion se muestran los detalles de los hiperparametros
              correspondientes a los descriptores utilizados.
            </h3>
          </div>

          {chekedHyperparameters.length > 0 ? (
            <HyperparametersContainer>
              {chekedDescriptors.map(
                (descriptor, index) =>
                  descriptor.hyperparameters?.length > 0 && (
                    <StyledRow key={index}>
                      {descriptor.hyperparameters.map((param, paramIndex) =>
                        param.type === "select" ? (
                          <Select
                            key={paramIndex}
                            primaryLabel={param.paramName}
                            secondaryLabel={`(${extractTextBetweenParentheses(
                              descriptor.name
                            )})`}
                            id={`${index}-${paramIndex}`}
                            name={param.paramName}
                            placeholder='Seleccionar...'
                            value={param.value}
                            options={param.options}
                            error=''
                            searchable={true}
                            isEditable={false}
                          />
                        ) : (
                          <Input
                            key={paramIndex}
                            primaryLabel={param.paramName}
                            secondaryLabel={`(${extractTextBetweenParentheses(
                              descriptor.name
                            )})`}
                            type={param.type ? param.type : "number"}
                            id={`${index}-${paramIndex}`}
                            name={param.paramName}
                            min={param.min ? param.min : 0}
                            max={param.max ? param.max : 10000}
                            step={param.step ? param.step : 0.01}
                            value={param.value}
                            isEditable={false}
                          />
                        )
                      )}
                    </StyledRow>
                  )
              )}
            </HyperparametersContainer>
          ) : (
            <EmptyContainer
              message={
                "Los descriptores seleccionados no poseen hiperparámetros editables."
              }
            />
          )}

          <div className='two-buttons-container'>
            <SecondaryButton
              handleClick={handleBack}
              SVG={ArrowLeftIcon}
              text={"Descriptores seleccionados"}
            />

            <PrimaryButton
              handleClick={handleNext}
              RightSVG={ArrowRightIcon}
              text={"Generar resultados"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default EditHyperparameters;
