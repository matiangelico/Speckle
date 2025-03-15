import styled, { css } from "styled-components";

//Components
import Input from "../../common/Input";
import TaskCheckbox from "../../common/CheckBox";

//Icons
import ImageIcon from "../../../assets/svg/icon-image.svg?react";
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import LayerIcon from "../../../assets/svg/icon-layers.svg?react";

const getColor = (value) => {
  switch (value) {
    case 0:
      return "#FFFFFF";
    case 0.1:
      return "#E8E8E9";
    case 0.2:
      return "#D1D2D2";
    case 0.3:
      return "#BBBBBB";
    case 0.4:
      return "#A4A4A5";
    case 0.5:
      return "#8D8D8E";
    case 0.6:
      return "#767778";
    case 0.7:
      return "#5F6062";
    case 0.8:
      return "#49494B";
    case 0.9:
      return "#323335";
    case 1:
      return "#1B1C1E";
    default:
      return "#FFFFFF";
  }
}

const getBatchColor = (value) => {
  switch (true) {
    case value >= 0 && value <= 0.4:
      return "#080A11";
    case value >= 0.5 && value <= 1:
      return "#FFFFFF";
    default:
      return "#FFFFFF";
  }
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white);
  border-radius: 12px;
`;

const VisualContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 320px;
  border: 2px solid var(--dark-800);
  border-radius: 12px;
  margin-bottom: 10px;
  gap: 10px;
  overflow-x: auto;

  & > :nth-child(1) {
    margin-right: 10px;
  }

  & > :last-child {
    margin-left: 10px;
  }
`;

const ParametersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

const LayerContainer = styled.div`
  // height: 100%;
  display: flex;
  // flex-direction: column;
  flex-direction: row;
  align-items: center;
  margin: 10px;
  gap: 8px;

  > :nth-child(2) {
    margin-top: 20px;
  }
`;

const LayerWithIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Layer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;

  span {
    color: var(--dark-800);
    font-feature-settings: "calt" off;

    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 170%
    letter-spacing: -0.14px;
    margin-bottom: 5px;
  }
`;

const Neuron = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "dropout" && prop !== "batchNorm",
})`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ dropout }) =>
    getColor(dropout !== undefined ? dropout : 0)};
  border: 2px solid var(--dark-800);
  margin: 2px;
  position: relative;

  ${({ batchNorm }) =>
    batchNorm &&
    css`
      &::after {
        content: "N";
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: ${({ dropout }) =>
          getBatchColor(dropout !== undefined ? dropout : 0)};
      }
    `}
`;

const ExtraNeurons = styled.div`
  color: var(--dark-800);
  font-feature-settings: "calt" off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 170%
  letter-spacing: -0.14px;
  margin-top: 5px;
`;

const NeuralNetworkEditor = ({ layers, updateLayer }) => {
  return (
    <EditorContainer>
      <VisualContainer>
        <ImageIcon />
        <ArrowRightIcon />
        {layers.map((layer, index) => (
          <LayerWithIcon key={index}>
            <Layer>
              <span id={index}>{`Capa-${index + 1}`}</span>
              {Array.from({ length: Math.min(layer.neurons, 10) }).map(
                (_, i) => (
                  <Neuron
                    key={i}
                    batchNorm={layer.batchNorm}
                    dropout={layer.dropout}
                  />
                )
              )}
              {layer.neurons > 10 && (
                <ExtraNeurons>+{layer.neurons - 10}</ExtraNeurons>
              )}
            </Layer>
            <ArrowRightIcon />
          </LayerWithIcon>
        ))}
        <LayerIcon />
      </VisualContainer>
      <ParametersContainer>
        {layers.map((layer, index) => (
          <LayerContainer key={index}>
            <Input
              primaryLabel={`Neuronas`}
              secondaryLabel={`Capa-${index + 1}`}
              type='number'
              id={`neurons-${index}`}
              name={`neurons-${index}`}
              min='1'
              max='128'
              step='1'
              placeholder='Neuronas'
              value={layer.neurons !== undefined ? layer.neurons : 0}
              setValue={(value) =>
                updateLayer(
                  index,
                  "neurons",
                  value ? Number.parseInt(value) : ""
                )
              }
            />
            <TaskCheckbox
              key={index}
              label={`Batch normalization-${index + 1}`}
              checked={layer.batchNorm !== undefined ? layer.batchNorm : false}
              onChange={(value) => {
                updateLayer(index, "batchNorm", value);
              }}
            />
            <Input
              primaryLabel={`Dropout`}
              secondaryLabel={`Capa-${index + 1}`}
              type='number'
              id={`dropout-${index}`}
              name={`dropout-${index}`}
              min='0'
              max='1'
              step='0.1'
              value={layer.dropout || 0}
              setValue={(value) =>
                updateLayer(
                  index,
                  "dropout",
                  value ? Number.parseFloat(value) : ""
                )
              }
            />
          </LayerContainer>
        ))}
      </ParametersContainer>
    </EditorContainer>
  );
};

export default NeuralNetworkEditor;
