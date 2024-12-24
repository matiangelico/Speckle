import "../../../../styles/SideBar.css";
import { styled } from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

import AsideItem from "./AsideItem";
import TimeItem from "./TimeItem";
import ToolsContainer from "./ToolsContainer";

import MoreIcon from "../../../assets/svg/icon-more-horizontal.svg?react";
import SettingIcon from "../../../assets/svg/icon-settings.svg?react";
import LogOutIcon from "../../../assets/svg/icon-log-out.svg?react";

const AsideContainer = styled.aside`
  width: 16.25rem;
  /* height: 55.25rem; */
  flex-shrink: 0;
  background: var(--dark-100);
  border-right: 2px solid var(--dark-500);
  display: grid;
  grid-template-rows: 1fr auto;
`;

const TopContainer = styled.div`
  display: flex;
  width: 16.125rem;
  padding: 1.5rem 0rem 0.5rem 0rem;
  flex-direction: column;
  align-items: flex-start;
`;

const BottomContainer = styled.div`
  display: flex;
  width: 16.125rem;
  border-top: 2px solid var(--dark-500);
  padding: 1.5rem 0rem 1.5rem 0rem;
  flex-direction: column;
  align-items: flex-start;
`;

const Aside = () => {
  const { logout } = useAuth0();
  const [activeItem, setActiveItem] = useState(null);

  // Función para manejar el clic en un elemento
  const handleItemClick = (title) => {
    setActiveItem((prev) => (prev === title ? null : title)); // Activa/desactiva
  };

  return (
    <AsideContainer>
      <TopContainer>
        <ToolsContainer />

        <TimeItem text={"Hoy"} />
        <AsideItem
          icon={MoreIcon}
          title={"Experiencia 1"}
          isActive={activeItem === "Experiencia 1"}
          handleClick={() => handleItemClick("Experiencia 1")}
        />
        <AsideItem
          icon={MoreIcon}
          title={"Experiencia 2"}
          isActive={activeItem === "Experiencia 2"}
          handleClick={() => handleItemClick("Experiencia 2")}
        />
        <AsideItem
          icon={MoreIcon}
          title={"Experiencia 3"}
          isActive={activeItem === "Experiencia 3"}
          handleClick={() => handleItemClick("Experiencia 3")}
        />

        <TimeItem text={"Semana pasada"} />
        <AsideItem
          icon={MoreIcon}
          title={"Experiencia 5"}
          isActive={activeItem === "Experiencia 5"}
          handleClick={() => handleItemClick("Experiencia 5")}
        />
      </TopContainer>
      <BottomContainer>
        <AsideItem icon={SettingIcon} title={"Configuración"} isActive={true} />
        <AsideItem
          icon={LogOutIcon}
          title={"Cerrar sesión"}
          isActive={true}
          handleClick={() => logout({ returnTo: window.location.origin })}
        />
      </BottomContainer>
    </AsideContainer>
  );
};

export default Aside;
