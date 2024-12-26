import { styled } from "styled-components";
import { useDropzone } from "react-dropzone";

import UploadFileIcon from "../../assets/svg/icon-upload-file.svg?react";

const StyledFileDropArea = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  padding: 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  align-self: center;

  border-radius: 0.25rem;
  border: 1px dashed #b0b0b0;
  background: var(--white, #fff);

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e0e0e0;
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .select-button {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 14px;
    color: #333;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
  }
`;

const StyledFileSize = styled.p`
  color: var(--dark-400);
`;

const FileDropArea = ({ onFileDrop, fileName, fileSize }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileDrop(file);
      } else {
        alert("No se seleccionó ningún archivo.");
      }
    },
    multiple: false, // Solo permite un archivo
    accept: { "video/avi": [".avi"] }, // Restringe a archivos .avi
  });

  return (
    <StyledFileDropArea {...getRootProps()}>
      <input {...getInputProps()} />
      <DropzoneContent>
        <UploadFileIcon />
        {fileName ? (
          <>
            <p>{fileName}</p>
            <StyledFileSize>{fileSize} MB</StyledFileSize>
          </>
        ) : (
          <p>Explora y elige los archivos que deseas cargar desde tu computadora</p>
        )}
      </DropzoneContent>
    </StyledFileDropArea>
  );
};

export default FileDropArea;
