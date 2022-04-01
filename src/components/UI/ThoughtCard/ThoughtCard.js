import React, { useEffect, useState } from 'react';

import styles from './ThoughtCard.module.css';
import { auth, db } from '../../../firebase'; 
import { addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

const ThoughtCard = props => {

  const timeDiff = (new Date().getTime() - props.timeCreated)/3600000;
  // console.log(new Date(props.timeCreated).toLocaleString());

  const [likesPeep, setLikes] = useState([]);
  const [commentsPeep, setComments] = useState([]);
  const [peepLiked, setPeepLiked] = useState(false);
  const [thisId, setThisId] = useState(false);

  useEffect(() => {
    setThisId(props.identifier);
    setLikes(props.peepLikes);
    setComments(props.peepComments);
    setPeepLiked(() => {
      if (auth.currentUser != undefined) {
        if (props.peepLikes.includes(auth.currentUser.email)) {
          return true;
        } else {
          return false;
        }
      }
    })
    // console.log(props.identifier);
  },[props]);

   const onLikePeep = async (e) => {
    e.stopPropagation();
    try {
      const response2 = await getDoc(doc(db, 'peeps', props.identifier));
      const response = await updateDoc(doc(db, 'peeps', props.identifier), {
        likes: [...response2.data().likes, auth.currentUser.email]
      })
      setLikes([...response2.data().likes, auth.currentUser.email]);
      setPeepLiked(true);
    } catch (err) {
      console.log(err);
    }
  };

   const onUnlikePeep = async (e) => {
    e.stopPropagation();
    try {
      const response2 = await getDoc(doc(db, 'peeps', props.identifier));
      const newLikes = response2.data().likes.filter(x => x != auth.currentUser.email);
      const response = await updateDoc(doc(db, 'peeps', props.identifier), {
        likes: [...newLikes]
      })
      setLikes([...newLikes]);
      setPeepLiked(false);
    } catch (err) {
      console.log(err);
    }
  }

  const onClickThis = () => {
    props.onClick(props.identifier, props.message, props.author, timeDiff, likesPeep, commentsPeep);
  };


  let theMessage = props.message.replaceAll('<div>', '\n').replaceAll('</div>', '').replaceAll('<br>', '').replaceAll('&nbsp;', '');
  return (
    <div key={props.identifier} className={styles.thought} onClick={onClickThis}>
        <span className={styles.userIcon}>{props.author == auth.currentUser?.email ? 'You' : <>{props.author[0].toUpperCase()}{props.author.split('@')[0][props.author.split('@')[0].length - 1].toUpperCase()}</>}</span>
        <span className={styles.author}>@{props.author.split('@')[0].toUpperCase()} &nbsp; &#68340; &nbsp;<span className={styles.timeCreated}> {timeDiff < 1 ? Math.round(timeDiff * 60) + 'mins ago' : (timeDiff > 1 && timeDiff < 2) ? '1h ago' : (timeDiff >= 2 && timeDiff < 24) ? Math.floor(timeDiff) + 'hrs ago' : Math.floor(timeDiff/24) + 'd ago'}</span></span>
        <span className={styles.message}>{theMessage}</span>
        <span className={styles.likeContainer}>
          {peepLiked ? <button className={styles.unlikeButton} onClick={onUnlikePeep}>Unlike</button>: <button className={styles.likeButton} onClick={onLikePeep}>Like</button>}
          <span className={styles.likeTotal}>{likesPeep.length} likes</span>
          <span className={styles.commentsTotal}> {commentsPeep.length == 1 ? `${commentsPeep.length} comment` : `${commentsPeep.length} comments`} </span>
        </span>
    </div>
  )
}

export default ThoughtCard;