import styled from "styled-components";

import Aside from "../../components/shared/Aside/Aside.jsx";
import TrainingContainer from "../../components/Experience/TrainingContainer.jsx";

const StyledMainContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const TrainingMainContent = () => {
  return (
    <StyledMainContent>
      <Aside />
      <TrainingContainer />
    </StyledMainContent>
  );
};

export default TrainingMainContent;
