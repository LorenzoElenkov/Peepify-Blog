import React from 'react'

import styles from './PlaceholderPeep.module.css';


const PlaceholderPeep = (props) => {
  return (
    <div className={styles.placeholderPeepContainer} key={props.id}>
        <span className={styles.placeholderUser}/>
        <span className={styles.placeholderIcon}/>
        <span className={styles.placeholderMessage}/>
        <span className={styles.placeholderSocial}/>
    </div>
  )
}

export default PlaceholderPeep