import { styled } from "styled-components";

import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { removeTraining } from "../../../reducers/savedTrainingsReducer";
import { initializeSavedTraining } from "../../../reducers/requestReducer";
import { createNotification } from "../../../reducers/notificationReducer";
import { showConfirmationAlertAsync } from "../../../reducers/alertReducer";

// Components
import AsideLink from "./AsideLink";
import TimeItem from "./AsideLabel";
import ToolsContainer from "./ToolsContainer";
import AsideButton from "./AsideButton";

// Icons
import MoreIcon from "../../../assets/svg/icon-more-horizontal.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

// Date utils
import {
  convertToReadableDate,
  isToday,
  isYesterday,
  isThisWeek,
  isLastWeek,
  convertToTimestamp,
} from "../../../utils/dateUtils";

const AsideContainer = styled.aside`
  position: sticky;
  top: 0;
  height: 89vh;
  width: 16.25rem;
  flex-shrink: 0;
  background: var(--dark-100);
  border-right: 2px solid var(--dark-500);
  border-bottom: 1px solid var(--dark-500);
  display: grid;
  grid-template-rows: 1fr auto;

  @media (min-height: 900px) {
    height: 100%;
  }
`;

const TopContainer = styled.div`
  display: flex;
  width: 16.125rem;
  padding-top: 0.5rem;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: inset 0px -20px 5px rgba(238, 241, 243, 1);
  overflow-y: auto;
`;

const ExperiencesContainer = styled.div`
  display: flex;
  width: 16.125rem;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;

  /* Personaliza el ancho de la barra */
  &::-webkit-scrollbar {
    width: 6px;
    box-sizing: content-box;
  }

  /* Color del track (fondo de la barra) */
  &::-webkit-scrollbar-track {
    background: var(--dark-200);
    // border-radius: 6px;
  }

  /* Color y estilo de la “thumb” (la parte que se mueve) */
  &::-webkit-scrollbar-thumb {
    background-color: var(--dark-300);
    // border-radius: 6px;
  }

  /* Efecto hover para la thumb */
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--dark-300);
  }
`;

const BottomContainer = styled.div`
  display: flex;
  width: 16.125rem;
  border-top: 2px solid var(--dark-500);
  padding: 0.5rem 0rem;
  flex-direction: column;
  align-items: flex-start;
`;

const EmptyState = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  color: var(--dark-400);
  font-size: 0.875rem;
  width: 100%;
  text-align: center;
`;

const groupByDateRange = (experiences) => {
  return experiences.reduce((acc, exp) => {
    const experienceDate = new Date(exp.date);

    let group = "";
    if (isToday(experienceDate)) {
      group = "Hoy";
    } else if (isYesterday(experienceDate)) {
      group = "Ayer";
    } else if (isThisWeek(experienceDate)) {
      group = "Esta Semana";
    } else if (isLastWeek(experienceDate)) {
      group = "Semana Pasada";
    } else {
      group = convertToReadableDate(experienceDate.getTime());
    }

    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(exp);
    return acc;
  }, {});
};

const Aside = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const { token, loading: tokenLoading } = useToken();
  const experiences = useSelector((state) => state.savedTrainings);

  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilters, setDateFilters] = useState({
    startDate: null,
    endDate: null,
  });

  //Filtro
  useEffect(() => {
    if (experiences) {
      let filtered = [...experiences];

      // Filtrar por término de búsqueda
      if (searchTerm) {
        filtered = filtered.filter((exp) =>
          exp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filtrar por fechas usando timestamps
      if (dateFilters.startDate) {
        filtered = filtered.filter(
          (exp) => exp.date >= convertToTimestamp(dateFilters.startDate)
        );
      }
      if (dateFilters.endDate) {
        filtered = filtered.filter(
          (exp) => exp.date <= convertToTimestamp(dateFilters.endDate)
        );
      }

      setFilteredExperiences(filtered);
    }
  }, [experiences, searchTerm, dateFilters]);

  const handleDeleteExperience = async (id, title) => {
    const answer = await dispatch(
      showConfirmationAlertAsync({
        title: `¿Eliminar ${title}?`,
        message:
          "Estás a punto de eliminar este entrenamiento. Una vez eliminado, no se podrá recuperar. ¿Deseas continuar?",
      })
    );

    if (!answer) {
      return;
    }

    if (!tokenLoading && token) {
      try {
        await dispatch(removeTraining(token, id));

        dispatch(
          createNotification(
            `Entrenamiento eliminado correctamente.`,
            "success"
          )
        );
      } catch (error) {
        console.error("Error al procesar la petición:", error);
        dispatch(
          createNotification(
            `Hubo un error al intentar eliminar el entrenamiento, vuelve a intentarlo mas tarde.`,
            "error"
          )
        );
      }
    }

    dispatch(
      createNotification(`Entrenamiento eliminado correctamente.`, "success")
    );
  };

  const handleSelectExperience = async (id) => {
    if (!tokenLoading && token) {
      try {
        // await dispatch(saveTraining(token, newTraining));
        dispatch(initializeSavedTraining(token, id));
        setActiveItem((prev) => (prev === id ? null : id));
      } catch (error) {
        console.error("Error al procesar la petición:", error);
        dispatch(
          createNotification(
            `Ha ocurrido un error vuelve a intentarlo mas tarde.`,
            "error"
          )
        );
      }
    }
  };

  const groupedExperiences = groupByDateRange(filteredExperiences);

  return (
    <AsideContainer>
      <TopContainer>
        <ToolsContainer
          onSearch={setSearchTerm}
          onFilterChange={setDateFilters}
        />
        <ExperiencesContainer>
          {filteredExperiences.length === 0 ? (
            <EmptyState>No se encontraron experiencias</EmptyState>
          ) : (
            Object.keys(groupedExperiences).map((group) => (
              <React.Fragment key={group}>
                <TimeItem key={group} text={group} />
                {groupedExperiences[group].map((exp) => (
                  <AsideLink
                    key={exp.id}
                    id={exp.id}
                    icon={MoreIcon}
                    title={exp.name}
                    isActive={activeItem === exp.id}
                    onClick={(id) => handleSelectExperience(id)}
                    onDelete={(id, title) => handleDeleteExperience(id, title)}
                  />
                ))}
              </React.Fragment>
            ))
          )}
        </ExperiencesContainer>
      </TopContainer>
      <BottomContainer>
        <AsideButton
          onClick={() => logout({ returnTo: window.location.origin })}
        />
      </BottomContainer>
    </AsideContainer>
  );
};

export default Aside;
