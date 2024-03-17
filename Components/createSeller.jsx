import { useState, useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input, useNotification } from "web3uikit"

export default function CreateSellerEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()
    const [SellerName, setSellerName] = useState(0)

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "seller updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        setSellerName(SellerName)
    }

    const { runContractFunction: createSeller } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "createSeller",
        params: { _sellerName: SellerName },
    })

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
                        onClick={() => {
                            createSeller({
                                onError: (error) => {
                                    console.log(error)
                                },
                                onSuccess: handleUpdateListingSuccess,
                            })
                        }}
                    />
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
