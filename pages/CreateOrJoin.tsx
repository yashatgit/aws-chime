import React, {useState} from "react";
import {useRouter} from "next/router";

import styles from "../styles/Home.module.css";
import { Input, Button } from 'amazon-chime-sdk-component-library-react';

const CreateOrJoin = () => {
    const router = useRouter();
    const [title, setTitle] = useState("TestMeet");
    const [name, setName] = useState("GuestUser");
    const join = async () => {
        await router.push({
            pathname: "/attendee",
            query: { title, name },
        });
    };
    return <main className={styles.main}>
        <h1 className={styles.title}>AWS Chime</h1>
        <div className={styles.card}>
            <div className="m-2 flex flex-col">
                <Input
                    id="title"
                    type="text"
                    placeholder="Enter Meet Id"
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
                    className="m-2"
                />
                <Input
                    id="attendee"
                    type="text"
                    placeholder="Enter your name"
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    className="m-2"
                />
            </div>
            <div className="m-2 flex" style={{alignItems : "center"}}>
                <Button label="Create" data-mode="createMeeting" onClick={join} style={{margin: "0 10px"}}/>
                <span>Or</span>
                <Button label="Join" data-mode="createAttendee" onClick={join} style={{margin: "0 10px"}}/>
                <span>meeting</span>
            </div>
        </div>
    </main>
}

export default CreateOrJoin;
