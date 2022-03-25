import React, { useEffect, useRef, useState } from 'react';
import styles from './ThoughtContainer.module.css';
import ThoughtCard from '../UI/ThoughtCard/ThoughtCard';
import { auth } from '../../firebase';

import { polyfill, scrollIntoView } from 'seamless-scroll-polyfill'; 


const ThoughtContainer = props => {

    polyfill();
    const containerRef = useRef();

    const [newPeeps, setNewPeeps] = useState(null);

    useEffect(() => {
        setNewPeeps(props.peeps);
    }, [props.peeps])


    let sortedPeeps = [];
    if (newPeeps) {
        sortedPeeps = newPeeps.sort((z, y) => y.data.postedAt - z.data.postedAt);
    }

    const onClickThought = (id, message, author, timeCreated, likes, comments) => {
        props.onClickThought(id, message, author, timeCreated, likes, comments);
    };


  return (
        <section className={styles.thoughtContainer} ref={containerRef}>
            {sortedPeeps.length > 0 ? sortedPeeps.map(x => {
                return (<ThoughtCard onClick={onClickThought} key={x.id} identifier={x.id} message={x.data.message} author={x.data.author} timeCreated={x.data.postedAt} peepLikes={x.data.likes} peepComments={x.data.comments} />)
            }): <p className={styles.noPeeps}>No peeps yet</p>}
        </section>
  )
}

export default ThoughtContainer;