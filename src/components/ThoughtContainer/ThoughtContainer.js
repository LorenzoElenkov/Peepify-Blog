import React, { useEffect, useRef, useState } from 'react';

import styles from './ThoughtContainer.module.css';
import ThoughtCard from '../UI/ThoughtCard/ThoughtCard';
import { auth } from '../../firebase';

import { polyfill, scrollIntoView } from 'seamless-scroll-polyfill'; 


const ThoughtContainer = props => {

    polyfill();
    const loadingRef = useRef();
    const containerRef = useRef();
    const pRef = useRef();

    const [newPeeps, setNewPeeps] = useState(null);
    const [isLoadingAnim, setIsLoadingAnim] = useState(false);

    useEffect(() => {
        setNewPeeps(props.peeps);
    }, [props.peeps, auth.currentUser])

    useEffect(() => {
        onScrollContainer();
    },[]);

    let sortedPeeps = [];
    if (newPeeps) {
        sortedPeeps = newPeeps.sort((z, y) => y.data.postedAt - z.data.postedAt);
    }

    const onClickThought = (id, message, author, timeCreated, likes, comments) => {
        props.onClickThought(id, message, author, timeCreated, likes, comments);
    };

    let lastScrollPos = null;
    let scrolledDown = false;

    const onScrollContainer = () => {
        // console.log(containerRef.current.scrollTop);
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
        if (containerRef.current.scrollTop <= 0) {
            containerRef.current.scrollTop = 2;
            containerRef.current.style.overflowY = "hidden";
            setIsLoadingAnim(true);
            props.onRefresh();
            setTimeout(() => {
                if (isSafari) {
                    scrollIntoView(document.querySelector('#getThere'), { behavior: "smooth", block: 'start', inline: 'nearest'});
                } else {
                    pRef.current.scrollIntoView();
                }
                containerRef.current.style.overflowY = "";
                setIsLoadingAnim(false);
            }, 500);
            setTimeout(() => {
                pRef.current.style.color = '#050836';
                pRef.current.innerHTML = 'Refreshed! Scroll up to refresh again';
            }, 1200);
        } 
        else if (containerRef.current.scrollTop > 2 && containerRef.current.scrollTop < 110) {
            if (containerRef.current.scrollTop > 20 && containerRef.current.scrollTop < 110) {
                if (pRef.current.style.color != 'white') {
                    pRef.current.style.color = 'transparent';
                } 
            }
            if (lastScrollPos) {
                clearTimeout(lastScrollPos);
            }
            let last2ScrollPos = containerRef.current.scrollTop;
            lastScrollPos = setTimeout(() => {
                if (last2ScrollPos == containerRef.current.scrollTop) {
                    containerRef.current.style.overflowY = "hidden";
        
                    setTimeout(() => {
                        containerRef.current.scrollTo({top: 120, behavior: 'smooth'})
                        containerRef.current.style.overflowY = "";
                    }, 300);
                    setTimeout(() => {
                        pRef.current.style.color = '#050836';
                        pRef.current.innerHTML = 'Not enough! Scroll further up to refresh';
                    }, 1000);
                }
            }, 200);
        } else if (containerRef.current.scrollTop > 150) {
            if (scrolledDown == false) {
                scrolledDown = true;
            }
        } else if (containerRef.current.scrollTop >= 110 && containerRef.current.scrollTop < 120 && scrolledDown) { 
            containerRef.current.style.overflowY = "hidden";
            containerRef.current.scrollTop = 120;
            setTimeout(() => {
            containerRef.current.style.overflowY = "";
            containerRef.current.scrollTop = 120;
            scrolledDown = false;
            }, 500);
        }
    };

  return (
    <section className={styles.thoughtContainer} ref={containerRef} onScroll={onScrollContainer}>
        <img src='loadingImg.png' className={isLoadingAnim ? `${styles.loadingImg} ${styles.loadingAnim}` : `${styles.loadingImg}`} ref={loadingRef} />
        <span ref={pRef} id='getThere' className={styles.scrollToRefresh}></span>
        {sortedPeeps.length > 0 ? sortedPeeps.map(x => {
            return (<ThoughtCard onClick={onClickThought} key={x.id} identifier={x.id} message={x.data.message} author={x.data.author} timeCreated={x.data.postedAt} peepLikes={x.data.likes} peepComments={x.data.comments} />)
        }): <p className={styles.noPeeps}>No peeps yet</p>}
    </section>
  )
}

export default ThoughtContainer;