import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [meetId, setMeetId] = useState("");
  const join = async (event) => {
    await router.push({
      pathname: "/attendee",
      query: { mode: event.target.dataset.mode, meetId, name: "Test" },
    });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>AWS Chime</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>AWS Chime</h1>
        <input
          id="meetId"
          type="text"
          placeholder="Enter Meet Id"
          onChange={(event) => setMeetId(event.target.value)}
          value={meetId}
        />
        <button data-mode="createMeeting" onClick={join}>
          Create Meeting
        </button>
        <button data-mode="createAttendee" onClick={join}>
          Join Meeting
        </button>
      </main>
    </div>
  );
}
