import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import { auth, db } from '../../../firebase'


import styles from './SignUpModal.module.css';

const SignUpModal = props => {

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const rePasswordRef = useRef(null);
    let numAccounts = null;

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    async function addRegisteredAccountCount() {
        try {
            const accountsNum = doc(db, "accountsCount", "accountsNum");
            const response = await getDoc(accountsNum);
            if (response.exists()) {
                numAccounts = response.data().count;
            } else {
                console.log('No such document!');
            }
            const response2 = await updateDoc(accountsNum, {
                count: numAccounts + 1
            });
            
        } catch (err) {
            alert(err.message);
        }
    }

    let emailSigned = null; 
    const onSignUp = (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (passwordRef.current.value === rePasswordRef.current.value && emailRef.current.value.includes('@')) {
            setIsLoading(true);
            emailSigned = emailRef.current.value;
            createUserWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            ).then(user => {
                addRegisteredAccountCount();
                setIsLoading(false);
                props.onClickOut();
            }).catch(err => {
                if (err.message.includes('already')) {
                    setErrorMessage(`${emailSigned} is already registered`);
                } else {
                    setErrorMessage(`Problem occurred! Try again later.`)
                }
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
            });
        } else {
            alert('Invalid email or passwords not matching!')
        }
    };

    const onSignUpAsGuest = (e) => {
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
            {!isLoading && <div className={styles.modal}>
                <span className={styles.spanSign}>Sign up</span>
                <span className={styles.underText}>Register with your email and password</span>
                <form onSubmit={onSignUp}>
                    <label>Email:</label>
                    <input ref={emailRef} type="email" placeholder="Type your email address..."/>
                    <label>Password:</label>
                    <input ref={passwordRef} type="password" placeholder="Don't tell anybody about it..."/>
                    <label>Re-enter password:</label>
                    <input ref={rePasswordRef} type="password" placeholder="Repeat your password, just in case..."/>
                    <div className={styles.buttons}>
                        <button onClick={onSignUp}>Register</button>
                        <button onClick={props.onClickOut}>Close</button>
                    </div>
                </form>
                <span className={styles.registerGuest}>Do not want to register? <button onClick={onSignUpAsGuest}>Login as guest</button></span>
                <span className={styles.signUpText}>Already a member? <button onClick={props.onClickSignIn}>Sign In</button></span>
            </div>}
            {isLoading && errorMessage != '' && <div className={styles.modal}>
                    <span className={styles.spanSign}>Error!</span>
                    <span className={styles.underText2}>{errorMessage}</span>
                </div>}
            {isLoading && errorMessage == '' && <div className={styles.modal}>
                    <span className={styles.spanSign}>Signing you up...!</span>
                    <img src="loadingImg.png" className={styles.loadingLogin}/>
                </div>}
            
        </div>, document.getElementById('overlay')
    );
};

export default SignUpModal;