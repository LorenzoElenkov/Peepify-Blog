import React, { useEffect, useRef, useState } from 'react';
import styles from './ThoughtContainer.module.css';
import ThoughtCard from '../UI/ThoughtCard/ThoughtCard';
import { auth } from '../../firebase';

import { polyfill, scrollIntoView } from 'seamless-scroll-polyfill'; 
import RefreshPeeps from '../RefreshPeeps/RefreshPeeps';
import PlaceholderPeep from '../UI/PlaceholderPeep/PlaceholderPeep';


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

    const handleRefreshing = () => {
        setTimeout(() => {
            props.onRefresh();
        }, 1000);
        setNewPeeps(null);
    };

    const placeholderPeeps = [
        {id: 1}, {id: 2}, {id: 3}
    ];


  return (
        <section className={styles.thoughtContainer} ref={containerRef}>
            <RefreshPeeps isRefreshing={handleRefreshing} queryPeeps={newPeeps}/>
            {sortedPeeps.length > 0 ? sortedPeeps.map(x => {
                return (<ThoughtCard onClick={onClickThought} key={x.id} identifier={x.id} message={x.data.message} author={x.data.author} timeCreated={x.data.postedAt} peepLikes={x.data.likes} peepComments={x.data.comments} />)
            }): placeholderPeeps.map(y => {
                return (<PlaceholderPeep key={y.id}/>);
            })}
        </section>
  )
}

export default ThoughtContainer;