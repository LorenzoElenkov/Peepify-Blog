import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Grid from './components/UI/Grid/Grid';
import img from '../src/suntornado.svg';
import {auth} from './firebase';

function App() {
  let userDummy = null;
  const [user, setUser] = useState(null);
  const [isMenuOnOrOff, setIsMenuOnOrOff] = useState(false);

  const switchMenuOnOff = (state) => {
    setIsMenuOnOrOff(state);
  };

  const turnAccountOff = () => {
    setIsMenuOnOrOff(false);
  };

  const setNewUser = (user) => {
    setUser(user);
  };

  
  return (
    <div className="App">
      <Header onSignedUser={setNewUser} isAccountOnOff={switchMenuOnOff}/>
      <Grid onSignedUser={user} isMenuOnOff={isMenuOnOrOff} onMenuOff={turnAccountOff}/>
    </div>
  );
}

export default App;
