//imports work with front end and require does not

import Image from "next/image"
import { Inter } from "next/font/google"
import Header from "../../Components/Header"
import styles from "../styles/Home.module.css"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <div className={styles.container}>
            <Header></Header>
        </div>
    )
}
