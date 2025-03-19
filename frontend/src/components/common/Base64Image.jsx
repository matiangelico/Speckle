import styled from "styled-components";

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 4px;
  max-width: 502px;
  max-height: 389px;
`;

const Base64Image = ({ base64Image, title }) => {
  return (
    <StyledImage src={`data:image/png;base64,${base64Image}`} alt={title} />
  );
};


export default Base64Image;
