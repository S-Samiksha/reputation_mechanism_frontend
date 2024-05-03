import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function PurchaseProductEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [ProductID, setProductID] = useState(0)
    const [sellerAddress, setSellerAddress] = useState("NULL")
    const [txnID, setTxnID] = useState(0)
    const [ProductPrice, setProductPrice] = useState(0)

    const { runContractFunction: purchaseProduct } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "purchaseProduct",
        msgValue: ProductPrice,
        params: { productID: ProductID, sellerAddress: sellerAddress },
    })

    const { runContractFunction: viewProductPrice } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewProductPrice",
        params: { _sellerAddress: sellerAddress, _productID: ProductID },
    })

    async function updateUIValues() {
        if (sellerAddress != "NULL") {
            const qProductPrice = (await viewProductPrice()).toString()
            setProductPrice(parseInt(qProductPrice))
            console.log(ProductPrice)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, sellerAddress])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: `Product ${ProductID} Purchased From Seller ${sellerAddress}!`,
            title: "Product Purchase Notification",
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
                            placeholder="Product ID"
                            onChange={(event) => {
                                setProductID(event.target.value)
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
                            placeholder="Seller's Address"
                            onChange={(event) => {
                                setSellerAddress(event.target.value)
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
                        text="Purchase Product"
                        theme="custom"
                        radius={50}
                        onClick={() =>
                            purchaseProduct({
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
