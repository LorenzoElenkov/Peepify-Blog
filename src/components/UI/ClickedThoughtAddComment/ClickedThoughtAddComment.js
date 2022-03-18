import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { forwardRef, useRef } from 'react';
import { auth, db } from '../../../firebase';

import styles from './ClickedThoughtAddComment.module.css';

const ClickedThoughtAddComment = forwardRef((props, ref) => {


    const commentRef = useRef();
    const commentContainerRef = useRef();

    const onAddComment = async (e) => {
        e.preventDefault();
        if (commentRef.current.innerHTML.replaceAll('&nbsp;', '').replaceAll('<div>', '').replaceAll('<br>', '').replaceAll('</div>', '').trim() != '') {
            try {
                const response = await getDoc(doc(db, 'peeps', props.thisPeepId));
                const response2 = await updateDoc(doc(db, 'peeps', props.thisPeepId), {
                    comments: [...response.data().comments, {
                        author: auth.currentUser.email,
                        comment: commentRef.current.innerHTML,
                        postedAt: new Date().getTime()
                    }]
                })
                props.onAddComment([...response.data().comments, {
                    author: auth.currentUser.email,
                    comment: commentRef.current.innerHTML,
                    postedAt: new Date().getTime()
                }]);
                commentRef.current.innerHTML = '';
            } catch (err) {
                console.log(err);
            }
        }
        
    };

    const onCommentInput = (e) => {
        if (commentRef.current.innerHTML == "<br>") {
            commentRef.current.innerHTML = ""
        }
    };


  return (
    <div className={styles.addCommentContainer} ref={ref}>
        <span className={styles.addCommentIcon}>You</span>
        <form className={styles.addCommentForm} action='' onSubmit={onAddComment}>
            <p className={styles.addCommentInput} role='textbox' ref={commentRef} onInput={onCommentInput} contentEditable/>
            {/* <p role="textbox" className={styles.textarea} ref={pText} onInput={onTextInput} contentEditable></p> */}
            <button className={styles.addCommentButton}>Add</button>
        </form>
    </div>
  )
});

export default ClickedThoughtAddComment;