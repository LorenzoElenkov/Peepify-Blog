import React, { useEffect, useRef, useState } from "react";

import { auth, db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

import styles from './CreatePost.module.css'
import { FirebaseError } from "firebase/app";

const CreatePost = (props) => {
    const pText = useRef();
    const [peepMessage, setPeepMessage] = useState();

    useEffect(() => {
        if (peepMessage != null) {
            addPeep();
        }
    },[peepMessage])
    

    async function addPeep() {
        try {
            const peepRef = await addDoc(collection(db, 'peeps'), peepMessage);
            console.log('Peep written with ID: ' + peepRef.id);
            props.onCreatePost();
        } catch (err) {
            alert(err.message);
        }
    }

    const onTextInput = () => {
        if (pText.current.innerHTML == "<br>") {
            pText.current.innerHTML = ""
        }
    };

    const onShare = (e) => {
        e.preventDefault();
        if (pText.current.innerHTML != "") {
            setPeepMessage({
                message: pText.current.innerHTML,
                author: props.onSignedUser.displayName ? props.onSignedUser.displayName : props.onSignedUser.email,
                postedAt: new Date().getTime(),
                likes: [],
                comments: []
            });
        }
        pText.current.innerHTML = "";
    };

    return (
        <>{auth.currentUser.email.includes('lorenco94') && 
        <div className={styles.createPost}>
            <span className={styles.you}>You</span>
                <form onSubmit={onShare}>
                    <p role="textbox" className={styles.textarea} ref={pText} onInput={onTextInput} contentEditable></p>
                    <button>Share</button>
                </form>
        </div>}
        </>
        
    );
};

export default CreatePost;