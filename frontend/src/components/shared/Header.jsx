import { useAuth0 } from "@auth0/auth0-react";
import { styled } from "styled-components";

import SpeckleLogo from "../../assets/svg/speckle-logo-40px.svg?react";

const StyledHeader = styled.header`
  display: flex;
  //max-width: 1512px;
  padding: 1rem 2rem;
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
  border-radius: 50%;
  border: 2px solid var(--dark-100);
  object-fit: cover;
  object-position: center;
  cursor: pointer;
`;

const Header = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
      <StyledHeader>
        <LogoContainer>
          <SpeckleLogo />
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
