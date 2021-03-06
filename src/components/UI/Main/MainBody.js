import React from "react";

import styles from './MainBody.module.css';

const MainBody = (props) => {
    return (
        <section className={props.onHamburgerMenu ? styles.mainBody + ' ' + styles.onMenu : styles.mainBody}>
            {props.children}
        </section>
    );
};

export default MainBody;