// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import imageLogo from '../../images/F-logo.png';
import name from '../../images/flairbnb-logo.png';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav id="nav-bar-container">
      <li>
        <NavLink exact to="/"><img className='logo' src={imageLogo} alt="logo"/><img className="logo-name" src={name} alt="flairbnb"/></NavLink>
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