import styled from "styled-components";

const StyledNavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  font-family: Inter, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ isActive }) =>
    isActive ? "var(--dark-800)" : "var(--dark-400)"};
  text-decoration: none;
  border-bottom: ${({ isActive }) =>
    isActive ? "2px solid var(--dark-800)" : "2px solid transparent"};
  cursor: pointer;
  transition: color 0.3s ease, border-color 0.1s linear;

  &:hover {
    color: var(--dark-600);
  }
`;

const NavItem = ({ href, icon: Icon, text, isActive, onClick }) => {
  return (
    <StyledNavItem href={href} isActive={isActive} onClick={onClick}>
      {Icon && <Icon />}
      {text}
    </StyledNavItem>
  );
};

export default NavItem;
