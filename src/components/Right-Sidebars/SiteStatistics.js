import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styles from './SiteStatistics.module.css';

import { auth, db } from '../../firebase'; 

const SiteStatistics = (props) => {

    const [numAccounts, setNumAccounts] = useState();
    const [numComments, setNumComments] = useState(0);

    async function queryRegisteredAccounts() {
        const accountsNum = doc(db, "accountsCount", "accountsNum");
        const response = await getDoc(accountsNum);
        if (response.exists()) {
            setNumAccounts(response.data().count);
        }
    }

    let totalComments = 0;

    useEffect(() => {
        setTimeout(() => {
            queryRegisteredAccounts();
            if (props.onQuery.length > 0) {
                props.onQuery.forEach(elem => {
                    totalComments += elem.data.comments.length;
                });
                setNumComments(totalComments);
            }
        }, 1000);
    }, [auth.currentUser, props.onQuery]);


  return (
    <div className={styles.backdrop}>
        <section className={styles.siteStatsContainer}>
            <p className={styles.siteStatsTitle}>Site Statistics</p>
            <p className={styles.registeredUsers}>Registered users: {numAccounts}</p>
            {auth.currentUser && <p className={styles.totalPeeps}>Total posts: {props.onQuery.length > 0 ? props.onQuery.length : ''}</p>}
            {auth.currentUser && <p className={styles.totalComments}>Total comments: {numComments}</p>}
            <button className={styles.closeStats} onClick={props.onClose}>Close</button>
        </section>
    </div>
  )
}

export default SiteStatistics;