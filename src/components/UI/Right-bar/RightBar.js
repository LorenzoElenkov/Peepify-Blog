import react from "react";

import styles from './RightBar.module.css';

const RightBar = props => {

    return (
        <section className={styles.rightBar}>
            {props.children}
        </section>

    );
};

export default RightBar;