import { useAuth0 } from "@auth0/auth0-react";

import { styled } from "styled-components";

const StyledLogoutBtn = styled.button`
  display: flex;
  width: 100%;
  padding: 0.75rem 2.5rem;
  align-items: center;
  gap: 0.625rem;
  border: 0;
  color: var(--dark-500);

  &:hover {
    background-color: var(--dark-200);
  }

  &:active {
    color: var(--dark-500);
  }

  p {
    //flex: 1 0 0;
    font-feature-settings: "calt" off;
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 171.429% */
    letter-spacing: -0.00875rem;
  }

  svg {
    color: var(--dark-500);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <StyledLogoutBtn
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='icon-log-out'>
          <path
            id='Shape'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M3.33337 2.66665C3.15656 2.66665 2.98699 2.73688 2.86197 2.86191C2.73695 2.98693 2.66671 3.1565 2.66671 3.33331V12.6666C2.66671 12.8435 2.73695 13.013 2.86197 13.1381C2.98699 13.2631 3.15656 13.3333 3.33337 13.3333H6.00004C6.36823 13.3333 6.66671 13.6318 6.66671 14C6.66671 14.3682 6.36823 14.6666 6.00004 14.6666H3.33337C2.80294 14.6666 2.29423 14.4559 1.91916 14.0809C1.54409 13.7058 1.33337 13.1971 1.33337 12.6666V3.33331C1.33337 2.80288 1.54409 2.29417 1.91916 1.9191C2.29423 1.54403 2.80294 1.33331 3.33337 1.33331H6.00004C6.36823 1.33331 6.66671 1.63179 6.66671 1.99998C6.66671 2.36817 6.36823 2.66665 6.00004 2.66665H3.33337ZM10.1953 4.19524C10.4557 3.93489 10.8778 3.93489 11.1381 4.19524L14.4714 7.52858C14.7318 7.78892 14.7318 8.21103 14.4714 8.47138L11.1381 11.8047C10.8778 12.0651 10.4557 12.0651 10.1953 11.8047C9.93495 11.5444 9.93495 11.1223 10.1953 10.8619L12.3906 8.66665H6.00004C5.63185 8.66665 5.33337 8.36817 5.33337 7.99998C5.33337 7.63179 5.63185 7.33331 6.00004 7.33331H12.3906L10.1953 5.13805C9.93495 4.8777 9.93495 4.45559 10.1953 4.19524Z'
            fill='#2D3648'
          />
        </g>
      </svg>
      <p>Cerrar Sesion</p>
    </StyledLogoutBtn>
  );
};

export default LogoutButton;