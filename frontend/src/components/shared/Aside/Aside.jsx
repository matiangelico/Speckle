import "../../../../styles/SideBar.css";
import AsideItem from './AsideItem';
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
        <AsideItem expTitle={'Experiencia 1'} />
        <AsideItem expTitle={'Experiencia 2'} />
        <AsideItem expTitle={'Experiencia 3'} />
        <div className='time-container'>
          <strong>Semana pasada</strong>
        </div>
        <AsideItem expTitle={'Experiencia 1'} />
      </div>
      <div className='bottom-container'>
        <AsideItem expTitle={'Configuración'} />
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Aside;
