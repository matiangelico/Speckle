import { styled } from "styled-components";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";

//Icons
import UploadFileIcon from "../../../assets/svg/icon-upload-file.svg?react";

const StyledFileDropArea = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  padding: 4rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1rem;
  align-self: center;
  border-radius: 8px;
  border: 2px dashed var(--dark-400);
  background: var(--white, #fff);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: var(--dark-100);
    border-color: var(--dark-600);
  }

  &:active {
    background-color: var(--dark-200);
    border-color: var(--dark-800);
  }

  &:focus {
    outline: 3px solid var(--dark-200);
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  gap: 4px;

  .select-button {
    margin-top: 15px;
    padding: 10px 20px;
    font-size: 14px;
    color: var(--dark-800);
    border: 2px solid var(--dark-500);
    border-radius: 8px;
    background-color: var(--white);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--dark-100);
    }
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const StyledFileData = styled.p`
  color: var(--dark-400);
  font-size: 14px;
`;

const FileDropArea = ({
  message,
  onFileDrop,
  fileName,
  fileSize,
  videoWidth,
  videoHeight,
  videoFrames,
}) => {
  const dispatch = useDispatch();

  // Función para manejar la selección del archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileDrop(file);
    } else {
      dispatch(
        createNotification(
          "No se seleccionó ningún archivo o el formato no es el correcto.",
          "error"
        )
      );
    }
  };

  return (
    <StyledFileDropArea>
      <input
        type="file"
        onChange={handleFileChange}
        aria-label="Cargar video"
        accept=".avi, .json"
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className="select-button">
        <UploadFileIcon />
        Seleccionar archivo
      </label>
      <DropzoneContent>
        {fileName ? (
          <>
            <p>{fileName}</p>
            <StyledFileData>{fileSize} MB</StyledFileData>
            {videoWidth && videoHeight && (
              <StyledFileData>
                {videoWidth} x {videoHeight} (WxH)
              </StyledFileData>
            )}
            {videoFrames && (
              <StyledFileData>{videoFrames} frames</StyledFileData>
            )}
          </>
        ) : (
          <p>{message}</p>
        )}
      </DropzoneContent>
    </StyledFileDropArea>
  );
};

export default FileDropArea;
