//At the moment not working

import { useState, useEffect, initialList } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function RetrieveAllProductsEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [SellerName, setSellerName] = useState("NULL")
    const [SellerAddress, setSellerAddress] = useState("NULL")
    const [SellerID, setSellerID] = useState(0)
    const [totalSellers, setTotalSellers] = useState(0)
    const [sellersList, setSellersList] = useState(initialList)

    const { runContractFunction: retrieveSellerName } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveSellerName",
        params: { _sellerAddress: SellerAddress },
    })

    const { runContractFunction: retrieveSellerAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveSellerAddress",
        params: { sellerID: SellerID },
    })

    const { runContractFunction: retrieveTotalSellers } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveTotalSellers",
        params: {},
    })

    async function updateUIValues() {
        const returnedTotalSellers = (await retrieveTotalSellers()).toString()
        for (var i = 1; i < returnedTotalSellers + 1; i++) {
            setSellerID(i)
            setSellerAddress((await retrieveSellerAddress()).toString())
            const newList = sellersList.concat(sellerAddress)
            setSellersList(newList)
            setTotalSellers(returnedTotalSellers)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, totalSellers])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Marketplace Information Retreived!",
            title: "Marketplace Information Notification",
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
                        <Typography
                            variant="custom"
                            style={{
                                color: "black",
                                padding: "10px",
                                marginLeft: "1rem",
                                display: "flex",
                                fontSize: "200%",
                            }}
                        >
                            Total Sellers on Platform: {totalSellers}
                        </Typography>
                        <Button
                            style={{
                                color: "black",
                                backgroundColor: "lightblue",
                                padding: "10px",
                                marginLeft: "0.1rem",
                            }}
                            text="Refresh Marketplace"
                            theme="custom"
                            radius={50}
                            onClick={() =>
                                retrieveTotalSellers({
                                    // onComplete:
                                    // onError:
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }
                        />
                    </div>
                    <div
                        style={{
                            color: "white",
                            display: "block",
                            width: "200%",
                            marginTop: "2rem",
                        }}
                    >
                        <Typography
                            variant="custom"
                            style={{
                                color: "black",
                                padding: "10px",
                                marginLeft: "1rem",
                                display: "flex",
                                fontSize: "200%",
                            }}
                        >
                            {/* Total Sellers on Platform: {sellersList[0]} */}
                        </Typography>
                        <ul>
                            {sellersList.map((item) => (
                                <li key={item.id}>{item.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
