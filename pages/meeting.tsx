import Head from "next/head";
import { useRouter } from "next/router";
import useSwr from "swr";

import styles from "../styles/Home.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const joinMeeting = () => {
    const { data, error } = useSwr(`/api/meeting/join`, fetcher);
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>AWS Chime</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>AWS Chime</h1>
        <button onClick={joinMeeting}>Join Meeting</button>
      </main>
    </div>
  );
}
