import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  max-width: 1512px;
  padding: 1.5rem 2.5rem;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  border-bottom: 2px solid var(--dark-500);
`;

const LogoContainer = styled.div`
  display: flex;
  height: 3rem;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const LogoTitle = styled.div`
  color: var(--dark-500);
  font-family: Geist;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.25rem; /* 83.333% */
  letter-spacing: 0.125rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const UserName = styled.strong`
  color: var(--dark-500);
  text-align: right;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.2rem;
`;

const UserEmail = styled.p`
  color: var(--dark-500);
  text-align: right;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
`;

const ProfileImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%; /* Hace la imagen circular */
  border: 2px solid var(--dark-100);
  object-fit: cover; /* Asegura que la imagen mantenga su proporción */
  cursor: pointer;
`;

const Header = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <StyledHeader>
        <LogoContainer>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
          >
            <path
              d='M4.81088 11.2237L20 2.44417L35.1892 11.2237V28.7763L20 37.5558L4.81088 28.7763V11.2237ZM7.96713 13.0262V26.9738L20 33.8746L32.033 26.9738V13.0262L20 6.08375L7.96713 13.0262Z'
              fill='#1B1C1E'
            />
          </svg>
          <LogoTitle>Speckle.</LogoTitle>
        </LogoContainer>
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
