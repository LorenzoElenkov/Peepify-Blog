import React, { useEffect, useMemo, useRef, useState } from 'react'

import styles from './UsersStatistics.module.css';

import { auth, db } from '../../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";


const UsersStatistics = props => {

    const [userCreatedTime, setUserCreatedTime] = useState(null);


    useEffect(() => {
        setUserCreatedTime(new Date(props.onSignedUser.metadata.creationTime).toLocaleDateString());
    },[auth.currentUser]);

    const handleOnClose = () => {
      props.onClose();
    };

  return (
    <div className={styles.backdrop}>
      <section className={styles.userStatsContainer}>
          <p className={styles.userStatsTitle}>Your account</p>
          <p className={styles.userStats} >Account name: @{props.onSignedUser.email.split('@')[0].toUpperCase()}</p>
          <p className={styles.userStats} >Account created: {userCreatedTime}</p>
          <button className={styles.closeAccountWindow} onClick={handleOnClose}>Close</button>
      </section>
    </div>
  )
}

export default UsersStatistics;