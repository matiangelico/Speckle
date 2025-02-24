import styled from "styled-components";

import Aside from "../../components/shared/Aside/Aside.jsx";
// import RequestContainer from "./RequestContainer.jsx";

const StyledMainContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const RequestMainContainer = () => {
  return (
    <StyledMainContent>
      <Aside />
      <span>ESTO ES UNA CONSULTAAAAAAAAAAAA</span>
      {/* <RequestContainer /> */}
    </StyledMainContent>
  );
};

export default RequestMainContainer;
