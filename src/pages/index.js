//imports work with front end and require does not

import Image from "next/image"
import Head from "next/head"
import { Inter } from "next/font/google"
import Header from "../../Components/Header"
import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import MarketEntrance from "../../Components/MarketEntrance"

const inter = Inter({ subsets: ["latin"] })
const supportedChains = ["31337", "11155111"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            <Head>
                <title>E-Commerce Platform</title>
            </Head>
            <Header />
            <MarketEntrance />
        </div>
    )
}
