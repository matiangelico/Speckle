import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";

// Icons
import SpeckleIcon from "../../assets/svg/speckle-favicon.svg?react";
import AlertIcon from "../../assets/svg/icon-alert.svg?react";
import CheckSquareIcon from "../../assets/svg/icon-check-square.svg?react";

const slideUp = keyframes`
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const StyledNotification = styled.div`
  display: flex;
  width: 800px;
  align-items: center;
  border-radius: 8px;
  border: 2px solid var(--dark-800);
  background-color: ${({ type }) => {
    switch (type) {
      case "success":
        return "var(--green-success-light);";
      case "error":
        return "var(--red-error-light);";
      default:
        return "var(--white)";
    }
  }};

  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1000;

  animation: ${slideUp} 0.5s ease-out;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 12px 12px 12px;
  border-right: 2px solid var(--dark-800);
  border-radius: 8px 0 0 8px;
  background-color: ${({ type }) => {
    switch (type) {
      case "success":
        return "var(--green-success);";
      case "error":
        return "var(--red-error);";
      default:
        return "var(--white)";
    }
  }};

  svg {
    width: 28px;
    height: 28px;
    color: var(--dark-800);
  }
`;

const TextWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  color: var(--dark-800);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  padding-left: 24px;
`;

const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckSquareIcon />;
    case "error":
      return <AlertIcon />;
    default:
      return <SpeckleIcon />;
  }
};

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  return (
    <>
      {notification && (
        <StyledNotification type={notification.type}>
          <IconWrapper type={notification.type}>{getIcon(notification.type)}</IconWrapper>
          <TextWrapper>
            <span>{notification.message}</span>
          </TextWrapper>
        </StyledNotification>
      )}
    </>
  );
};

export default Notification;
