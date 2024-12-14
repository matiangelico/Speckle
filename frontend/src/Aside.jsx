import "../styles/SideBar.css";
import FavItem from './FavItem';

// import { styled } from "styled-components";

import LogoutButton from "./LogoutButton";

// const StyledSideBar = styled.div``

const Aside = () => {
  return (
    <aside className='favs-aside'>
      <div className='top-container'>
        <div className='search-container'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='icon-search'>
              <path
                id='Shape'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M3 7.33333C3 4.9401 4.9401 3 7.33333 3C9.72657 3 11.6667 4.9401 11.6667 7.33333C11.6667 8.49276 11.2113 9.54583 10.4697 10.3235C10.4432 10.3451 10.4175 10.3682 10.3928 10.3929C10.3681 10.4176 10.345 10.4433 10.3234 10.4698C9.54578 11.2113 8.49273 11.6667 7.33333 11.6667C4.9401 11.6667 3 9.72657 3 7.33333ZM11.0487 12.463C10.0051 13.2202 8.72134 13.6667 7.33333 13.6667C3.83553 13.6667 1 10.8311 1 7.33333C1 3.83553 3.83553 1 7.33333 1C10.8311 1 13.6667 3.83553 13.6667 7.33333C13.6667 8.72137 13.2201 10.0051 12.4629 11.0488L14.707 13.2929C15.0976 13.6834 15.0976 14.3166 14.707 14.7071C14.3165 15.0976 13.6834 15.0976 13.2928 14.7071L11.0487 12.463Z'
                fill='#2D3648'
              />
            </g>
          </svg>
          <input
            type='text'
            placeholder='Buscar...'
            className='search-bar'
          />
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='icon-filter'>
              <path
                id='Shape'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M0.728678 1.71941C0.837917 1.48397 1.07387 1.33333 1.33342 1.33333H14.6668C14.9263 1.33333 15.1623 1.48397 15.2715 1.71941C15.3807 1.95485 15.3434 2.23229 15.1758 2.43048L10.0001 8.55076V14C10.0001 14.231 9.88046 14.4456 9.68391 14.5671C9.48737 14.6886 9.24194 14.6996 9.03528 14.5963L6.36861 13.2629C6.14276 13.15 6.00009 12.9192 6.00009 12.6667V8.55076L0.824377 2.43048C0.656779 2.23229 0.61944 1.95485 0.728678 1.71941ZM2.77029 2.66666L7.1758 7.87618C7.27758 7.99653 7.33342 8.14905 7.33342 8.30666V12.2546L8.66676 12.9213V8.30666C8.66676 8.14905 8.7226 7.99653 8.82438 7.87618L13.2299 2.66666H2.77029Z'
                fill='#2D3648'
              />
            </g>
          </svg>
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
