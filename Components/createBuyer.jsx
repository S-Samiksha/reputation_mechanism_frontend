import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function CreateBuyerEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const dispatch = useNotification()

    const [BuyerName, setBuyerName] = useState("NULL")
    const [TotalBuyers, setTotalBuyer] = useState(0)

    const { runContractFunction: createBuyer } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "createBuyer",
        params: { _buyerName: BuyerName.toString() },
    })

    const { runContractFunction: retrieveTotalBuyers } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveTotalBuyers",
        params: {},
    })

    async function updateUIValues() {
        const totalBuyerNum = (await retrieveTotalBuyers()).toString()
        setTotalBuyer(totalBuyerNum)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, TotalBuyers])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Buyer Created!",
            title: "Buyer Creation Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
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
                            placeholder="Buyer Name"
                            onChange={(event) => {
                                setBuyerName(event.target.value)
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
                        text="Create Buyer"
                        theme="custom"
                        radius={50}
                        onClick={() =>
                            createBuyer({
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
                            marginLeft: "0.1rem",
                        }}
                    >
                        Total Number of Buyer: {TotalBuyers}
                    </Typography>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
