import Head from "next/head";
import CreateOrJoin from './CreateOrJoin';

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>AWS Chime</title>
      </Head>
      <CreateOrJoin />
    </div>
  );
}
