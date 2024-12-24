import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";
import { useState } from "react";

import NavItem from "./NavItem";

import SpeckleLogo from "../../../assets/svg/speckle-logo-40px.svg?react";
import IconDumbbel from "../../../assets/svg/icon-dumbbel.svg?react";
import IconBrain from "../../../assets/svg/icon-brain.svg?react";

const StyledHeader = styled.header`
  display: flex;
  padding: 1rem 2rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--dark-500);
`;

const LogoContainer = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  gap: 0.25rem;
  pointer-events: none;

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
  gap: 0.75rem;
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
  border: 2px solid var(--dark-100);
  object-fit: cover;
  cursor: pointer;
`;

const Header = () => {
  const { user, isAuthenticated } = useAuth0();
  const [activeItem, setActiveItem] = useState("Consulta");

  // Función para cambiar el enlace activo
  const handleNavItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    isAuthenticated && (
      <StyledHeader>
        <LogoContainer>
          <SpeckleLogo />
          <LogoTitle>Speckle.</LogoTitle>
        </LogoContainer>
        <NavigationContainer>
          <NavItem
            href={"#"}
            icon={IconDumbbel}
            text={"Entrenamiento"}
            isActive={activeItem === "Entrenamiento"}
            onClick={() => handleNavItemClick("Entrenamiento")}
          />
          <NavItem
            href={"#"}
            icon={IconBrain}
            text={"Consulta"}
            isActive={activeItem === "Consulta"}
            onClick={() => handleNavItemClick("Consulta")}
          />
        </NavigationContainer>
        <UserInfo>
          <UserDetails>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserDetails>
          <ProfileImage src={user.picture} alt={user.name} />
        </UserInfo>
      </StyledHeader>
    )
  );
};

export default Header;
