//imports work with front end and require does not

import Image from "next/image"
import Head from "next/head"
import { Inter } from "next/font/google"
import Header from "../../Components/Header"
import styles from "../styles/Home.module.css"
import { userMoralis } from "react-moralis"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>E-Commerce Platform</title>
            </Head>
            <Header></Header>
        </div>
    )
}
