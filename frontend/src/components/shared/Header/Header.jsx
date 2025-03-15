import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

//Redux
// import { useDispatch } from "react-redux";
// import { resetRequest } from "../../../reducers/requestReducer";

//Components
import NavItem from "./NavItem";

//Icons
import SpeckleLogo from "../../../assets/svg/speckle-logo-40px.svg?react";
import IconDumbbel from "../../../assets/svg/icon-dumbbel.svg?react";
import IconBrain from "../../../assets/svg/icon-brain.svg?react";

//Images
import profilePicture from "../../../assets/webp/user.webp";

const StyledHeader = styled.header`
  height: 10vh;
  display: flex;
  padding: 1rem 2rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--dark-500);

  @media (min-height: 900px) {
    height: 8vh;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  gap: 0.25rem;
  pointer-events: none;
  user-select: none;

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const LogoTitle = styled.div`
  color: var(--dark-500);
  font-family: Geist;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.125rem;
`;

const NavigationContainer = styled.nav`
  display: flex;
  align-items: flex-start;
  gap: 32px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled.strong`
  color: var(--dark-500);
  text-align: right;
  font-size: 0.875rem;
  font-weight: 700;
`;

const UserEmail = styled.p`
  color: var(--dark-500);
  text-align: right;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 3px solid var(--dark-200);
  object-fit: cover;
  cursor: pointer;
`;

const Header = ({ userName, userEmail, userImage }) => {
  // const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (location.pathname.startsWith("/request")) {
      setActiveItem("Consulta");
    } else if (location.pathname.startsWith("/")) {
      setActiveItem("Entrenamiento");
    }
  }, [location.pathname]);

  const handleNavItemClick = (item) => {
    if (item === "Consulta") {
      // dispatch(resetRequest());
    }

    setActiveItem(item);
  };

  return (
    <StyledHeader>
      <LogoContainer>
        <SpeckleLogo />
        <LogoTitle>Speckle.</LogoTitle>
      </LogoContainer>
      <NavigationContainer>
        <NavItem
          href={"/training"}
          icon={IconDumbbel}
          text={"Entrenamiento"}
          isActive={activeItem === "Entrenamiento"}
          onClick={() => handleNavItemClick("Entrenamiento")}
        />
        <NavItem
          href={"/request"}
          icon={IconBrain}
          text={"Consulta"}
          isActive={activeItem === "Consulta"}
          onClick={() => handleNavItemClick("Consulta")}
        />
      </NavigationContainer>
      <UserInfo>
        <UserDetails>
          <UserName>{userName}</UserName>
          <UserEmail>{userEmail}</UserEmail>
        </UserDetails>
        <ProfileImage
          src={userImage ? userImage : profilePicture}
          alt={userName}
        />
      </UserInfo>
    </StyledHeader>
  );
};

export default Header;
