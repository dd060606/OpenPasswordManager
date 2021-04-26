import React, { useState } from 'react';
import ResponsiveNav from './ResponsiveNav';
import "./css/ResponsiveButton.css"


let setMenuOpen;


const ResponsiveButton = () => {
  const [open, setOpen] = useState(false)
  setMenuOpen = setOpen
  return (
    <>
      <div className="responsive-btn" style={{ position: open ? "fixed" : "absolute" }} open={open} onClick={() => setOpen(!open)}>
        <div style={{ backgroundColor: open ? '#ccc' : '#333', transform: open ? 'rotate(45deg)' : 'rotate(0)' }} />
        <div style={{ backgroundColor: open ? '#ccc' : '#333', transform: open ? 'translateX(100%)' : 'translateX(0)', opacity: open ? 0 : 1 }} />
        <div style={{ backgroundColor: open ? '#ccc' : '#333', transform: open ? 'rotate(-45deg)' : 'rotate(0)' }} />
      </div>
      <ResponsiveNav open={open} />
    </>
  )
}

export default ResponsiveButton
export { setMenuOpen }