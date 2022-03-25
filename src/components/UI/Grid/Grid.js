import react, { useEffect, useState } from "react";

import styles from './Grid.module.css';
import LeftBar from "../Left-bar/LeftBar";
import RightBar from "../Right-bar/RightBar";
import MainBody from "../Main/MainBody";
import CreatePost from "../../Post-Create/CreatePost";
import UsersStatistics from "../../Left-Sidebar/UsersStatistics";
import ThoughtCard from "../ThoughtCard/ThoughtCard";
import ThoughtContainer from "../../ThoughtContainer/ThoughtContainer";

import { auth, db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import SiteStatistics from "../../Right-Sidebars/SiteStatistics";
import ClickedThoughtCard from "../ClickedThoughtCard/ClickedThoughtCard";

const Grid = props => {

    const [peeps, setPeeps] = useState([]);
    const [clickedThought, setClickedThought] = useState(false);
    const [clickedThoughtMap, setClickedThoughtMap] = useState({});

    const [isAccountShown, setIsAccountShown] = useState(false);

    async function queryPeeps() {
        try {
            let newPeeps = [];
            const querySnapshot = await getDocs(collection(db, 'peeps'));
            querySnapshot.forEach(x => {
                newPeeps.push({
                    id: x.id,
                    data: x.data()
                })
            })
            setPeeps(newPeeps);
        } catch (err) {
            alert(err.message);
        }
    }

    
    const onClickedThought = (id, message, author, createdAt, likes, comments) => {
        setClickedThought(() => {
            if (clickedThought) {
                queryPeeps();
                return false;
            } else {
                return true;
            }
        });
        setClickedThoughtMap({
            id: id,
            message: message,
            author: author,
            postedAt: createdAt,
            likes: likes,
            comments: comments
        });
        // queryPeeps();
    };

    useEffect(() => {
        queryPeeps();
    },[]);

    useEffect(() => {
        setIsAccountShown(props.isMenuOnOff);
    },[props.isMenuOnOff]);

    const handleOnCloseAccountTab = () => {
        props.onMenuOff();
    };

    return(
        <section className={styles.gridBody}>
            <LeftBar>
                {props.onSignedUser && window.innerWidth > 700 && <UsersStatistics onSignedUser={props.onSignedUser}/>}
                {props.onSignedUser && window.innerWidth <= 700 && isAccountShown && <UsersStatistics onSignedUser={props.onSignedUser} onClose={handleOnCloseAccountTab}/>}
            </LeftBar>
            <MainBody>
                {!props.onSignedUser && <span className={styles.loginBefore}>Please login, register, or login as guest!</span>}
                {props.onSignedUser && !clickedThought && <CreatePost onSignedUser={props.onSignedUser} onCreatePost={queryPeeps}/>}
                {props.onSignedUser && !clickedThought && <ThoughtContainer peeps={peeps} onClickThought={onClickedThought} onRefresh={queryPeeps}/>}
                {props.onSignedUser && clickedThought && <ClickedThoughtCard onClose={onClickedThought} data={clickedThoughtMap}/>}
            </MainBody>
            <RightBar>
                <SiteStatistics onSignedUser={props.onSignedUser} onQuery={peeps}/>
            </RightBar>
        </section>
    )
};

export default Grid;