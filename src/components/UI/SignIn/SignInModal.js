import { browserSessionPersistence, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, useRef } from "react";
import ReactDOM from 'react-dom';
import { auth, logInWithEmailAndPassword } from '../../../firebase'

import { firebase } from 'firebase/app'; 

import styles from './SignInModal.module.css';

const SignInModal = props => {

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSignIn = (e) => {
        e.preventDefault();
        auth.setPersistence(browserSessionPersistence);
        setErrorMessage('');
        if (emailRef.current.value.includes('@')) {
            let email = emailRef.current.value;
            let password = passwordRef.current.value;
            setIsLoading(true);
            setTimeout(() => {
                signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                ).then(() => {
                    props.onSignedIn();
                }).catch(err => {
                    if (err.message.includes('user-not-found')) {
                        setErrorMessage('Email address not found!');
                    } else if (err.message.includes('wrong-password')) {
                        setErrorMessage('You have entered an incorrect password!')
                    }
                    setTimeout(() => {
                        setIsLoading(false);
                        
                    }, 4000);
                })
            }, 1000);
        }
        
    };

    const onSignInAsGuest = (e) => {
        e.preventDefault();
        setErrorMessage('');
        let randomCharsDigits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomGuestName = '';
        setIsLoading(true);
        for (let i = 0; i < 9; i++) {
            randomGuestName += randomCharsDigits.charAt(Math.floor(Math.random() * randomCharsDigits.length));
        }
        randomGuestName = 'guest_' + randomGuestName + '@gmail.com';
        createUserWithEmailAndPassword(
            auth,
            randomGuestName,
            'guestlogin'
        ).then(() => {
            setIsLoading(false);
            props.onClickOut();
        }).catch(err => {
            if (err.message.includes('already')) {
                setErrorMessage(`Try again!`);
            }
        });
    };

    return ReactDOM.createPortal(
        <div className={styles.backdrop}>
            {!isLoading ? <div className={styles.modal}>
                <span className={styles.spanSign}>Log in</span>
                <span className={styles.underText}>Sign in with your email and password</span>
                <form onSubmit={onSignIn} action="" >
                    <label>Email:</label>
                    <input ref={emailRef} type="email" placeholder="Type your email address..."/>
                    <label>Password:</label>
                    <input ref={passwordRef} type="password" placeholder="And your password... secretly!"/>
                    <div className={styles.buttons}>
                        <button onClick={onSignIn}>Login</button>
                        <button onClick={props.onClickOut}>Close</button>
                    </div>
                </form>
                <span className={styles.registerGuest}>Do not want to register? <button onClick={onSignInAsGuest}>Login as guest</button></span>
                <span className={styles.signUpText}>Not a member yet? <button onClick={props.onClickSignUp}>Sign Up</button></span>
            </div> : <div className={styles.modal}>
                {errorMessage == '' ? <span className={styles.spanSign}>Logging you in...</span> : <span className={styles.spanSign}>Error</span>}
                {errorMessage != '' && <span className={styles.underText2}>{errorMessage}</span>}
                {errorMessage == '' && <img src="loadingImg.png" className={styles.loadingLogin}/>}
            </div>}
            
        </div>, document.getElementById('overlay')
    );
};

export default SignInModal;