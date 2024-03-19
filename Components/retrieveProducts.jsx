import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function RetrieveProductsEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = "31337"
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [SellerName, setSellerName] = useState("NULL")
    const [SellerAddress, setSellerAddress] = useState("NULL")
    const [ProductPrice, setProductPrice] = useState(0)
    const [ProductID, setProductID] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)

    const { runContractFunction: retrieveSellerName } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveSellerName",
        params: { _sellerAddress: SellerAddress },
    })

    const { runContractFunction: retrieveSellerTotalProducts } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "retrieveSellerTotalProducts",
        params: { _sellerAddress: SellerAddress },
    })

    async function updateUIValues() {
        if (SellerName != "NULL") {
            const returnedSellerName = (await retrieveSellerName()).toString()
            const returnedTotalProducts = (await retrieveSellerTotalProducts()).toString()
            setSellerName(returnedSellerName)
            setTotalProducts(returnedTotalProducts)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, SellerName, totalProducts])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Seller Information Retreived!",
            title: "Seller Information Notification",
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
                            placeholder="Seller Address"
                            onChange={(event) => {
                                setSellerAddress(event.target.value)
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
                            placeholder="Product ID"
                            onChange={(event) => {
                                setProductID(event.target.value)
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
                        text="Retrieve Seller Name"
                        theme="custom"
                        radius={50}
                        onClick={() =>
                            retrieveSellerName({
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
                        Seller's Name: {SellerName}
                    </Typography>
                    <Typography
                        variant="custom"
                        style={{
                            color: "black",
                            padding: "10px",
                            marginLeft: "0.1rem",
                        }}
                    >
                        Seller's TotalProducts: {totalProducts}
                    </Typography>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
