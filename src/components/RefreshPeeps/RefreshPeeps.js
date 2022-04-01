import React, { useState, Fragment, useEffect } from 'react';
import styles from './RefreshPeeps.module.css';
import loadingImg from '../../../src/loadingImg.png';

const RefreshPeeps = (props) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefreshing = () => {
        setIsRefreshing(true);
        props.isRefreshing();
    };

    useEffect(() => {
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    },[props.queryPeeps]);

  return (
    <Fragment className={styles.refreshContainer}>
        {!isRefreshing && window.innerWidth < 700 && <button onClick={handleRefreshing} className={styles.refreshButton}>Tap to Refresh</button>}
        {!isRefreshing && window.innerWidth >= 700 && <button onClick={handleRefreshing} className={styles.refreshButton}>Click to Refresh</button>}
        {isRefreshing && <div className={styles.loadingImgContainer}><img src={loadingImg} className={styles.loadingImg} alt='Refreshing posts...' /></div>}
    </Fragment>
  )
}

export default RefreshPeeps;