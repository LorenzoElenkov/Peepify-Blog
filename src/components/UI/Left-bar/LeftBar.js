import react from "react";

import styles from './LeftBar.module.css';

const LeftBar = props => {

    return (
        <section className={styles.leftBar}>
            {props.children}
        </section>
    );

};

export default LeftBar;