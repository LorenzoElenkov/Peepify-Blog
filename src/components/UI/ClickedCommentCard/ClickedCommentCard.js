import React from 'react';
import { auth } from '../../../firebase';

import styles from './ClickedCommentCard.module.css';

const ClickedCommentCard = (props) => {
  
  const timeDiff = (new Date().getTime() - props.postedAt)/3600000;

  let theMessage = props.message.replaceAll('<div>', '\n').replaceAll('</div>', '').replaceAll('<br>', '').replaceAll('&nbsp;', '');
  return (
    <div className={styles.clickedCommentCard}>
      <span className={styles.commentIcon}>{props.author == auth.currentUser.email ? 'You' : <>{props.author[0].toUpperCase()}{props.author.split('@')[0][props.author.split('@')[0].length - 1].toUpperCase()}</>}</span>
      <span className={styles.commentAuthor}>@{props.author.split('@')[0].toUpperCase()} &nbsp; &#68340; &nbsp;<span className={styles.timeCreated}> {timeDiff < 1 ? Math.round(timeDiff * 60) + 'mins ago' : (timeDiff > 1 && timeDiff < 2) ? '1h ago' : (timeDiff >= 2 && timeDiff < 24) ? Math.floor(timeDiff) + 'hrs ago' : Math.floor(timeDiff/24) + 'd ago'}</span></span>
      <span className={styles.commentMessage}>{theMessage}</span>
    </div>
  )
}

export default ClickedCommentCard;