import styled from "styled-components";

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  border-radius: 4px;
`;

const Base64Image = ({ title, base64Image }) => {
  return (
    <StyledImage src={`data:image/png;base64,${base64Image}`} alt={title} />
  );
};

export default Base64Image;
