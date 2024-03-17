import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification } from "web3uikit"

export default function CreateSellerEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const dispatch = useNotification()
    const [SellerName, setSellerName] = useState(0)

    const { runContractFunction: createSeller } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "createSeller",
        params: { inputSellerName: SellerName },
    })

    async function updateUIValues() {
        // const entranceFeeFromCall = (await getEntranceFee()).toString()
        // const numPlayersFromCall = (await getPlayersNumber()).toString()
        // const recentWinnerFromCall = await getRecentWinner()
        // setEntranceFee(entranceFeeFromCall)
        // setNumberOfPlayers(numPlayersFromCall)
        // setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            // updateUIValues()
            // handleNewNotification(tx)
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
                            placeholder="Seller Name"
                            onChange={(event) => {
                                setSellerName(event.target.value)
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
                        text="Create Seller"
                        theme="custom"
                        radius={50}
                        onClick={() =>
                            createSeller({
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
