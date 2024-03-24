//imports work with front end and require does not

import Head from "next/head"
import Header from "../../Components/Header"
import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import MarketEntrance from "../../Components/MarketEntrance"
import CreateSellerEntrance from "../../Components/createSeller"
import CreateBuyerEntrance from "../../Components/createBuyer"
import UploadProductEntrance from "../../Components/uploadProduct.jsx"
import PurchaseProductEntrance from "../../Components/purchaseProduct"
import BuyerReviewEntrance from "../../Components/buyerReview"
import RetrieveProductsEntrance from "../../Components/retrieveProducts"
import RetrieveBuyerEntrance from "../../Components/retrieveBuyer"
import SendIncentiveMechanismEntrance from "../../Components/incentiveMechanism"
import RetrieveAllProductsEntrance from "../../Components/retrieveAllProducts"
import { TabList, Tab } from "web3uikit"

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
            <TabList isWidthAuto tabStyle="bulbUnion">
                <Tab tabKey={1} tabName="Seller's Page" lineHeight={30}>
                    <CreateSellerEntrance />
                    <UploadProductEntrance />
                    <RetrieveProductsEntrance />
                    <SendIncentiveMechanismEntrance />
                </Tab>
                <Tab tabkey={2} tabName="Buyer's Page" lineHeight={30}>
                    <CreateBuyerEntrance />
                    <RetrieveBuyerEntrance />
                    <PurchaseProductEntrance />
                    <BuyerReviewEntrance />
                </Tab>
            </TabList>
        </div>
    )
}
