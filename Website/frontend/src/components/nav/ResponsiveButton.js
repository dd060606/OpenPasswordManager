import React, { useState } from 'react';
import styled from 'styled-components';
import ResponsiveNav from './ResponsiveNav';
import "./css/ResponsiveButton.css"


let setMenuOpen;
const StyledResponsiveButton = styled.div`

  
  div {

    background-color: ${({ open }) => open ? '#ccc' : '#333'};

    &:nth-child(1) {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    &:nth-child(2) {
      transform: ${({ open }) => open ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${({ open }) => open ? 0 : 1};
    }
    &:nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const ResponsiveButton = () => {
  const [open, setOpen] = useState(false)
  setMenuOpen = setOpen
  return (
    <>
      <StyledResponsiveButton className="responsive-btn" style={{ position: open ? "fixed" : "absolute" }} open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledResponsiveButton>
      <ResponsiveNav open={open} />
    </>
  )
}

export default ResponsiveButton
export { setMenuOpen }