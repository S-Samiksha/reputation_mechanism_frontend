import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function SendIncentiveMechanismEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [TxnID, setTxnID] = useState("NULL")
    const [BuyerAddress, setBuyerAddress] = useState("NULL")
    const [RewardValue, setRewardValue] = useState(0)

    const { runContractFunction: sendIncentive } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "sendIncentive",
        msgValue: RewardValue + 10,
        params: { buyerAddress: BuyerAddress, txnID: TxnID },
    })

    const { runContractFunction: calculateIncentive } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "calculateIncentive",
        params: { buyerAddress: BuyerAddress, txnID: TxnID },
    })

    async function updateUIValues() {
        if (BuyerAddress != "NULL") {
            const qReward = (await calculateIncentive()).toString()
            console.log(qReward)
            setRewardValue(qReward)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Incentive Sent!",
            title: "Incentive Information Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            updateUIValues()
            await tx.wait(1)
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
                        display: "inline-block",
                        height: "50px",
                        justifyContent: "left",
                        width: "100%",
                    }}
                >
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
                                placeholder="Buyer Address"
                                onChange={(event) => {
                                    setBuyerAddress(event.target.value)
                                }}
                            />

                            <Input
                                style={{
                                    color: "black",
                                    marginLeft: "1rem",
                                }}
                                placeholder="Txn ID"
                                onChange={(event) => {
                                    setTxnID(event.target.value)
                                }}
                            />

                            <Button
                                style={{
                                    color: "black",
                                    backgroundColor: "lightblue",
                                    marginLeft: "1rem",
                                }}
                                text="Send Incentive"
                                theme="custom"
                                radius={50}
                                onClick={() =>
                                    sendIncentive({
                                        // onComplete:
                                        // onError:
                                        onSuccess: handleSuccess,
                                        onError: (error) => console.log(error),
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
