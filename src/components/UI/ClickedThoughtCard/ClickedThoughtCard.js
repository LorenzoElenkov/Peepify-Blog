import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { auth, db } from '../../../firebase';
import ClickedCommentCard from '../ClickedCommentCard/ClickedCommentCard';
import ClickedThoughtAddComment from '../ClickedThoughtAddComment/ClickedThoughtAddComment';



import styles from './ClickedThoughtCard.module.css';

const ClickedThoughtCard = (props) => {

//   const timeDiff = (new Date().getTime() - props.data.postedAt)/3600000;
    const timeDiff = props.data.postedAt;

    const commentSection = useRef();
    const peepMessage = useRef();
    const peepSocial = useRef();
    const peepCommentAdd = useRef();

  const [peepLiked, setPeepLiked] = useState(false);
  const [likesPeep, setLikes] = useState([]);
    const [peepComments, setPeepComments] = useState([]);

  useEffect(() => {
      setLikes(props.data.likes);
      setPeepComments(props.data.comments);
  },[]);


    const onLikePeep = async () => {
        try {
          const response2 = await getDoc(doc(db, 'peeps', props.data.id));
          const response = await updateDoc(doc(db, 'peeps', props.data.id), {
            likes: [...response2.data().likes, auth.currentUser.email]
          })
          setLikes([...response2.data().likes, auth.currentUser.email]);
          setPeepLiked(true);
        } catch (err) {
          console.log(err);
        }
    };


    const onUnlikePeep = async () => {
        try {
          const response2 = await getDoc(doc(db, 'peeps', props.data.id));
          const newLikes = response2.data().likes.filter(x => x != auth.currentUser.email);
          const response = await updateDoc(doc(db, 'peeps', props.data.id), {
            likes: [...newLikes]
          })
          setLikes([...newLikes]);
          setPeepLiked(false);
        } catch (err) {
          console.log(err);
        }
    }

    const onAddComment = (newComments) => {
        setPeepComments(newComments);
    };

    let sortedPeeps = [];
    if (peepComments) {
        sortedPeeps = peepComments.sort((z, y) => y.postedAt - z.postedAt);
    }
  return (
    <section className={styles.clickedThoughtContainer}>
        <div className={styles.clickedThoughtCard} ref={peepMessage}>
            <button onClick={props.onClose} className={styles.closeThought} >Close</button>
            <span className={styles.thisIcon}>{props.data.author == auth.currentUser.email ? 'You' : <>{props.data.author[0].toUpperCase()}{props.data.author.split('@')[0][props.data.author.split('@')[0].length - 1].toUpperCase()}</>}</span>
            <span className={styles.thisAuthor}>@{props.data.author.split('@')[0].toUpperCase()} &nbsp; &#68340; &nbsp;<span className={styles.timeCreated}> {timeDiff < 1 ? Math.round(timeDiff * 60) + 'mins ago' : (timeDiff > 1 && timeDiff < 2) ? '1h ago' : (timeDiff >= 2 && timeDiff < 24) ? Math.floor(timeDiff) + 'hrs ago' : Math.floor(timeDiff/24) + 'd ago'}</span></span>
            <span className={styles.thisMessage}>{props.data.message.replaceAll('<div>', '\n').replaceAll('</div>', '').replaceAll('<br>', '').replaceAll('&nbsp;', '')}</span>
        </div>
        <div className={styles.socialCard} ref={peepSocial}>
            {likesPeep.includes(auth.currentUser.email) ? <button onClick={onUnlikePeep} className={styles.unlikeThisThought}>Unlike</button> :  <button onClick={onLikePeep} className={styles.likeThisThought}>Like</button>}
            <span className={styles.likeThisTotal}>{likesPeep.length} likes</span>
            <span className={styles.commentsThisTotal}>{peepComments.length} comments</span>
        </div>
        <ClickedThoughtAddComment thisPeepId={props.data.id} onAddComment={onAddComment} ref={peepCommentAdd}/>
        <div className={styles.commentsContainer} ref={commentSection}>
            {sortedPeeps.length > 0 ? <div className={styles.commentSectionCard}>
                {sortedPeeps.map(x => <ClickedCommentCard key={sortedPeeps.indexOf(x)} author={x.author} message={x.comment} postedAt={x.postedAt} />)}
            </div> : <span className={styles.noComments}>There are no comments.</span>}
        </div>
        
    </section>
  )
}

export default ClickedThoughtCard;