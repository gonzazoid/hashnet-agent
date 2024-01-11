import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  width: 100%;
  border-radius: 9px;
  height:50px;
  box-shadow: 5px 5px 5px darkgrey, -5px -5px 5px darkgrey;
  background-image: radial-gradient(50% 50% at top center,rgba(0,0,0,.66),#262626),linear-gradient(180deg,#fff,#262626);
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const NavbarLinkContainer = styled.div`
  display: flex;
`;

const NavbarLink = styled(Link)`
  color: ${props => (props.isActive ? "white" : "gray")};
  font-size: x-large;
  font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  margin: 10px;
  &:hover,
  &:focus{
    color: white;
  }
`;

export default () => (
  <NavbarContainer>
    <NavbarLinkContainer>
      <NavbarLink to="/welcome">
        #Net agent
      </NavbarLink>
      <NavbarLink to="/messages">
        Messages
      </NavbarLink>
      <NavbarLink to="/add">
        Add message
      </NavbarLink>
      <NavbarLink to="/add-torrent">
        Add torrent
      </NavbarLink>
    </NavbarLinkContainer>
  </NavbarContainer>
);
