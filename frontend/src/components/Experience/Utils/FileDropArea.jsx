import { styled } from "styled-components";
import { useDropzone } from "react-dropzone";

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
`;

const StyledFileSize = styled.p`
  color: var(--dark-400);
  font-size: 14px;
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
    multiple: false,
    accept: { "video/avi": [".avi"] },
  });

  return (
    <StyledFileDropArea {...getRootProps()}>
      <input {...getInputProps()} aria-label='Cargar video' />
      <DropzoneContent>
        <UploadFileIcon />
        {fileName ? (
          <>
            <p>{fileName}</p>
            <StyledFileSize>{fileSize} MB</StyledFileSize>
          </>
        ) : (
          <p>
            Arrastra y suelta un archivo de video (.avi) o haz clic para
            seleccionar uno desde tu computadora.
          </p>
        )}
      </DropzoneContent>
    </StyledFileDropArea>
  );
};

export default FileDropArea;