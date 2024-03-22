import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification, Typography } from "web3uikit"

export default function UploadProductEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const [ProductName, setProductName] = useState("NULL")
    const [ProductPrice, setProductPrice] = useState("0")

    const { runContractFunction: uploadProduct } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "uploadProduct",
        params: { _productName: ProductName, price: ProductPrice },
    })

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Product Uploaded!",
            title: "Product Upload Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
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
                        width: "100%",
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
                            placeholder="Product Name"
                            onChange={(event) => {
                                setProductName(event.target.value)
                            }}
                        />
                        <Input
                            style={{
                                color: "black",
                                padding: "10px",
                                marginLeft: "1rem",
                            }}
                            placeholder="Product Price"
                            onChange={(event) => {
                                setProductPrice(event.target.value)
                            }}
                        />
                        <Button
                            style={{
                                color: "black",
                                backgroundColor: "lightblue",
                                padding: "10px",
                                marginLeft: "1rem",
                            }}
                            text="Upload Product"
                            theme="custom"
                            radius={50}
                            onClick={() =>
                                uploadProduct({
                                    // onComplete:
                                    // onError:
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }
                        />
                    </div>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
