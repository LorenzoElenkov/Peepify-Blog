import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import SignInModal from '../UI/SignIn/SignInModal';
import SignUpModal from '../UI/SignUp/SignUpModal';

import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';


const Header = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isSignInClicked, setSignInClicked] = useState(false);
    const [isSignUpClicked, setSignUpClicked] = useState(false);
    const [isMenuOn, setIsMenuOn] = useState(false);


    const onSignInClick = () => {
        setSignUpClicked(false);
        setSignInClicked(true);
        props.onMenuClick();
        setIsMenuOn(false);
    };
    const onSignUpClick = () => {
        setSignInClicked(false);
        setSignUpClicked(true);
        props.onMenuClick();
        setIsMenuOn(false);

    };
    const onSignInClickOut = () => {
        setSignInClicked(false);
    };
    const onSignUpClickOut = () => {
        setSignUpClicked(false);
        setIsMenuOn(false);
    };
    const onSignedIn = () => {
        setSignUpClicked(false);
        setSignInClicked(false);
        setIsMenuOn(false);
    };
    const onLogout = () => {
        props.onMenuClick();
        signOut(auth).then(() => {
            props.onSignedUser(null);
            setUser(null);
            setIsLoggedIn(false);
            setIsMenuOn(false);
        }).catch(err => {
            alert(err.message);
        });
    };

    
    useEffect(() => {
        auth.onAuthStateChanged(async (userData) => {
            if (userData) {
                setUser(userData);
                setIsLoggedIn(true);
                props.onSignedUser(userData);
                console.log(userData);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        })
    }, []);


    const handleMenuState = () => {
        setIsMenuOn(!isMenuOn);
        props.onMenuClick(!isMenuOn);
    };

    const handleAccountState = () => {
        props.isAccountOnOff(true);
    }

    const handleStatisticsState = () => {
        props.isStatsOnOff(true);
    };

    

    return (
        <header>
            <span className={styles.siteTitleDesktop}>Peepify</span>
            <button onClick={handleMenuState} className={styles.hamburger}></button>
            <nav className={!isMenuOn ? styles.hamburgerMenuContainer + ' ' + styles.off : styles.hamburgerMenuContainer + ' ' + styles.on}>
                <button onClick={handleMenuState} className={styles.closeHamburgerMenu}>x</button>
                <span className={styles.siteTitle}>Peepify</span>
                {auth.currentUser && <button className={styles.accountStatisticsButton} onClick={handleAccountState}>Account</button>}
                {auth.currentUser && <button className={styles.siteStatisticsButton} onClick={handleStatisticsState}>Site statistics</button>}
                {!auth.currentUser ? <button onClick={onSignInClick} className={styles.loginButton}>Login</button> : null}
                {!auth.currentUser ? <button className={styles.signupButton} onClick={onSignUpClick}>Sign up</button> : null}
                {auth.currentUser && <button className={styles.logOut2} onClick={onLogout}>Logout</button>}
            </nav>
            {!isLoggedIn ? <button className={styles.signIn} onClick={onSignInClick}>Log in</button> : null}
            {!isLoggedIn ? <button className={styles.signUp} onClick={onSignUpClick}>Sign up</button> : <button className={styles.logOut} onClick={onLogout}>Logout</button>}
            {isSignInClicked && <SignInModal onClickOut={onSignInClickOut} onClickSignUp={onSignUpClick} onSignedIn={onSignedIn} onLogout={onLogout}/>}
            {isSignUpClicked && <SignUpModal onClickOut={onSignUpClickOut} onClickSignIn={onSignInClick} onRegisterLogout={onLogout}/>}
        </header>
    );
};

export default Header;