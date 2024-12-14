import "../../../../styles/SideBar.css";
import FavItem from './FavItem';

// import { styled } from "styled-components";

import LogoutButton from "./LogoutButton";

import SearchIcon from "../../../assets/svg/icon-search.svg?react";
import FilterIcon from "../../../assets/svg/icon-filter.svg?react";

// const StyledSideBar = styled.div``

const Aside = () => {
  return (
    <aside className='favs-aside'>
      <div className='top-container'>
        <div className='search-container'>
          <SearchIcon />
          <input
            type='text'
            placeholder='Buscar...'
            className='search-bar'
          />
          <FilterIcon />
        </div>
        <div className='time-container'>
          <strong>Hoy</strong>
        </div>
        <FavItem expTitle={'Experiencia 1'} />
        <FavItem expTitle={'Experiencia 2'} />
        <FavItem expTitle={'Experiencia 3'} />
        <div className='time-container'>
          <strong>Semana pasada</strong>
        </div>
        <FavItem expTitle={'Experiencia 1'} />
      </div>
      <div className='bottom-container'>
        <FavItem expTitle={'Configuración'} />
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Aside;
