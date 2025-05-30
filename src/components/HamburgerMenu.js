import React, { useState } from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ handleUser, setShowCategories, isOpen, setIsOpen }) => {


    return (
        <>
            <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            <nav className={`menu ${isOpen ? 'show' : ''}`}>
                <ul>
                    <hr className='solid' />
                    <li onClick={() => { setShowCategories(true); setIsOpen(!isOpen) }}><a href="#home">فهرست</a></li>
                    <hr className='solid' />
                    {/* <li><a href="#features">افزودن لیست</a></li> */}
                    {/* <li><a href="#pricing">Pricing</a></li> */}
                    <li onClick={handleUser}><a href="#about">خروج</a></li>
                    <hr className='solid' />
                </ul>
            </nav>
        </>
    );
};

export default HamburgerMenu;