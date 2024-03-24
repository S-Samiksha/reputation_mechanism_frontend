import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function RetrieveBuyerEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [buyerName, setbuyerName] = useState("NULL")
    const [buyerAddress, setbuyerAddress] = useState("NULL")
    const [buyerTxn, setTotalTxn] = useState(0)
    const [queryTxn, setQueryTxn] = useState(0)
    const [queryTxnSellerId, setQueryTxnSellerID] = useState(0)
    const [queryTxnProductId, setQueryTxnProductID] = useState(0)
    const [queryTxnSellerAddress, setQueryTxnSellerAddress] = useState("NULL")
    const [buyerRepScore, setBuyerRepScore] = useState(0)

    const { runContractFunction: retrieveBuyerName } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveBuyerName",
        params: { buyerAddress: buyerAddress },
    })

    const { runContractFunction: retrieveBuyerTotalTransactions } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveBuyerTotalTransactions",
        params: { _buyerAddress: buyerAddress },
    })

    const { runContractFunction: retrieveBuyerRepScore } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveBuyerRepScore",
        params: { _buyerAddress: buyerAddress },
    })

    async function updateUIValues() {
        if (buyerAddress != "NULL") {
            const returnedbuyerName = (await retrieveBuyerName()).toString()
            const returnedTotalTxn = (await retrieveBuyerTotalTransactions()).toString()
            const returnedRepScore = (await retrieveBuyerRepScore()).toString()

            setbuyerName(returnedbuyerName)
            setTotalTxn(returnedTotalTxn)
            setBuyerRepScore(returnedRepScore)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, buyerName, buyerTxn, buyerRepScore])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "buyer Information Retreived!",
            title: "buyer Information Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const { runContractFunction: viewTransactions_SellerID } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewTransactions_SellerID",
        params: { _buyerAddress: buyerAddress, _txnID: queryTxn },
    })

    const { runContractFunction: viewTransactions_ProductID } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewTransactions_ProductID",
        params: { _buyerAddress: buyerAddress, _txnID: queryTxn },
    })

    const { runContractFunction: viewTransactions_SellerAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewTransactions_SellerAddress",
        params: { _buyerAddress: buyerAddress, _txnID: queryTxn },
    })

    async function updateUIValuesTwo() {
        if (buyerAddress != "NULL") {
            const txn_seller_id = (await viewTransactions_SellerID()).toString()
            const txn_product_id = (await viewTransactions_ProductID()).toString()
            const txn_seller_address = (await viewTransactions_SellerAddress()).toString()
            setQueryTxnSellerID(txn_seller_id)
            setQueryTxnProductID(txn_product_id)
            setQueryTxnSellerAddress(txn_seller_address)
        }
    }

    const handleNewNotificationTwo = () => {
        dispatch({
            type: "info",
            message: "Buyer Transaction Information Retreived!",
            title: "Buyer Transaction Information Notification",
            position: "topR",
            icon: "bell",
        })
    }
    const handleSuccessTwo = async (tx) => {
        try {
            updateUIValuesTwo()
            handleNewNotificationTwo(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-5">
            {storeAddress ? (
                <div
                    style={{
                        alignItems: "center",
                        color: "white",
                        display: "inline-block",
                        height: "50px",
                        justifyContent: "left",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            color: "white",
                            width: "100%",
                            display: "flex",
                        }}
                    >
                        <Input
                            style={{
                                color: "black",
                            }}
                            placeholder="buyer Address"
                            onChange={(event) => {
                                setbuyerAddress(event.target.value)
                            }}
                        />

                        <Button
                            style={{
                                color: "black",
                                backgroundColor: "lightblue",
                                marginLeft: "1rem",
                            }}
                            text="Retrieve Buyer Details"
                            theme="custom"
                            radius={50}
                            onClick={() =>
                                retrieveBuyerName({
                                    // onComplete:
                                    // onError:
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }
                        />

                        <Typography
                            variant="custom"
                            style={{
                                color: "black",
                                padding: "10px",
                                marginLeft: "1rem",
                                display: "flex",
                            }}
                        >
                            buyer's Name: {buyerName}
                        </Typography>
                        <Typography
                            variant="custom"
                            style={{
                                color: "black",
                                padding: "10px",
                                marginLeft: "0.1rem",
                                display: "flex",
                            }}
                        >
                            Buyer's Total Transactions: {buyerTxn}
                        </Typography>
                        <Typography
                            variant="custom"
                            style={{
                                color: "black",
                                padding: "10px",
                                marginLeft: "0.1rem",
                                display: "flex",
                            }}
                        >
                            Buyer's Reputation Score: {buyerRepScore / 10 ** 18}
                        </Typography>
                    </div>
                    <div
                        style={{
                            color: "white",
                            display: "block",
                            width: "200%",
                            marginTop: "2rem",
                        }}
                    >
                        <div
                            style={{
                                color: "white",
                                display: "flex",
                                width: "100%",
                            }}
                        >
                            <Input
                                style={{
                                    color: "black",
                                }}
                                placeholder="buyer Address"
                                onChange={(event) => {
                                    setbuyerAddress(event.target.value)
                                }}
                            />

                            <Input
                                style={{
                                    color: "black",
                                    marginLeft: "1rem",
                                }}
                                placeholder="Txn ID"
                                onChange={(event) => {
                                    setQueryTxn(event.target.value)
                                }}
                            />

                            <Button
                                style={{
                                    color: "black",
                                    backgroundColor: "lightblue",
                                    marginLeft: "1rem",
                                }}
                                text="Retrieve Transaction"
                                theme="custom"
                                radius={50}
                                onClick={() =>
                                    viewTransactions_SellerID({
                                        // onComplete:
                                        // onError:
                                        onSuccess: handleSuccessTwo,
                                        onError: (error) => console.log(error),
                                    })
                                }
                            />

                            <Typography
                                variant="custom"
                                style={{
                                    color: "black",
                                    padding: "10px",
                                    marginLeft: "1rem",
                                    display: "flex",
                                }}
                            >
                                Seller ID: {queryTxnSellerId}
                            </Typography>
                            <Typography
                                variant="custom"
                                style={{
                                    color: "black",
                                    padding: "10px",
                                    marginLeft: "0.1rem",
                                    display: "flex",
                                }}
                            >
                                Seller Address: {queryTxnSellerAddress}
                            </Typography>

                            <Typography
                                variant="custom"
                                style={{
                                    color: "black",
                                    padding: "10px",
                                    marginLeft: "0.1rem",
                                    display: "flex",
                                }}
                            >
                                Product ID: {queryTxnProductId}
                            </Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
