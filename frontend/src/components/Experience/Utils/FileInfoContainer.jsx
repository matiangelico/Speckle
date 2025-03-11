import { styled } from "styled-components";

// Icons
import VideoIcon from "../../../assets/svg/icon-video.svg?react";
import VideoOffIcon from "../../../assets/svg/icon-video-off.svg?react";

const StyledContainer = styled.div`
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
`;

const Content = styled.div`
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
`;

const StyledFileData = styled.p`
  color: var(--dark-400);
  font-size: 14px;
`;

const FileInfoContainer = ({
  fileName,
  fileSize = null,
  videoWidth,
  videoHeight,
  videoFrames,
}) => {
  return (
    <StyledContainer>
      <Content>
        {fileName ? (
          <>
            <VideoIcon />
            <p>{fileName}</p>
            {fileSize && <StyledFileData>{fileSize} MB</StyledFileData>}
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
          <>
            <VideoOffIcon />
            <p>
              No has seleccionado ningun entrenamiento. Si no tienes ninguno,
              puedes entrenar uno en la seccion de &quot;Entrenamiento&quot;.
            </p>
          </>
        )}
      </Content>
    </StyledContainer>
  );
};

export default FileInfoContainer;
