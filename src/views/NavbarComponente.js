import { NavLink } from 'react-router-dom';
import React from 'react';

export default function NavbarComponent() {    
    return (
        <div className="topnav">
            <NavLink to="/agendar">Reservas</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/integrantes">Integrantes</NavLink>
        </div> 
    );
}
