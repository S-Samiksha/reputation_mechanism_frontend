import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function BuyerReviewEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [queryTxn, setQueryTxn] = useState(0)
    const [ratingGiven, setRating] = useState(0)

    const { runContractFunction: buyerReview } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "buyerReview",
        params: { buyerRating: ratingGiven, txnID: queryTxn },
    })

    async function updateUIValues() {
        //if needed later
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "buyer review left!",
            title: "buyer review Notification",
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

    return (
        <div className="p-5">
            {storeAddress ? (
                <div
                    style={{
                        alignItems: "center",
                        color: "white",
                        display: "flex",
                        height: "50px",
                        justifyContent: "left",
                        width: "200%",
                    }}
                >
                    <div
                        style={{
                            color: "white",
                            display: "flex",
                            width: "10%",
                            padding: "10px",
                        }}
                    >
                        <Input
                            style={{
                                color: "black",
                                padding: "10px",
                            }}
                            placeholder="Rating"
                            onChange={(event) => {
                                setRating(event.target.value)
                            }}
                        />
                    </div>
                    <div
                        style={{
                            color: "white",
                            display: "flex",
                            width: "10%",
                            padding: "10px",
                        }}
                    >
                        <Input
                            style={{
                                color: "black",
                                padding: "10px",
                            }}
                            placeholder="Transaction ID"
                            onChange={(event) => {
                                setQueryTxn(event.target.value)
                            }}
                        />
                    </div>
                    <Button
                        style={{
                            color: "black",
                            backgroundColor: "lightblue",
                            padding: "10px",
                            marginLeft: "0.1rem",
                        }}
                        text="Leave Review"
                        theme="custom"
                        radius={50}
                        onClick={() =>
                            buyerReview({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    />
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
