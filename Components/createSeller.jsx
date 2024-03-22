import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function CreateSellerEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [SellerName, setSellerName] = useState("NULL")
    const [TotalSellers, setTotalSellers] = useState(0)

    const { runContractFunction: createSeller } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "createSeller",
        params: { _sellerName: SellerName },
    })

    const { runContractFunction: retrieveTotalSellers } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveTotalSellers",
        params: {},
    })

    async function updateUIValues() {
        const totalSellerNum = (await retrieveTotalSellers()).toString()
        setTotalSellers(totalSellerNum)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, TotalSellers])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Seller Created!",
            title: "Seller Creation Notification",
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
                            placeholder="Seller Name"
                            onChange={(event) => {
                                setSellerName(event.target.value)
                            }}
                        />

                        <Button
                            style={{
                                color: "black",
                                backgroundColor: "lightblue",
                                marginLeft: "1rem",
                                padding: "10px",
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

                        <Typography
                            variant="custom"
                            style={{
                                color: "black",
                                marginLeft: "1rem",
                            }}
                        >
                            Total Number of Sellers: {TotalSellers}
                        </Typography>
                    </div>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
