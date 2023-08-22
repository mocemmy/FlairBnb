// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav id="nav-bar-container">
      <li>
        <NavLink exact to="/"><img className='logo' src='/images/F-logo.png' alt="logo"/><img className="logo-name" src='/images/flairbnb-logo.png' alt="flairbnb"/></NavLink>
      </li>
      {isLoaded && (
        <li id="profile-button-container">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </nav>
  );
}

export default Navigation;