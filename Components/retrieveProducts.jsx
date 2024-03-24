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
    const [ProductName, setProductName] = useState("NULL")
    const [ProductReview, setProductReview] = useState(0)

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

    const { runContractFunction: viewProductName } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewProductName",
        params: { _sellerAddress: SellerAddress, _productID: ProductID },
    })

    const { runContractFunction: viewProductPrice } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewProductPrice",
        params: { _sellerAddress: SellerAddress, _productID: ProductID },
    })

    const { runContractFunction: viewProductReview } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "viewProductReview",
        params: { _sellerAddress: SellerAddress, _productID: ProductID },
    })

    async function updateUIValues() {
        if (SellerAddress != "NULL") {
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
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateUIValuesTwo() {
        if (SellerAddress != "NULL") {
            const RProductName = (await viewProductName()).toString()
            const RProductPrice = (await viewProductPrice()).toString()
            const RProductReview = (await viewProductReview()).toString()
            setProductPrice(RProductPrice)
            setProductName(RProductName)
            setProductReview(RProductReview)
        }
    }

    const handleNewNotificationTwo = () => {
        dispatch({
            type: "info",
            message: "Seller Product Information Retreived!",
            title: "Seller Product Information Notification",
            position: "topR",
            icon: "bell",
        })
    }
    const handleSuccessTwo = async (tx) => {
        try {
            updateUIValuesTwo()
            handleNewNotificationTwo(tx)
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
                        <Input
                            style={{
                                color: "black",
                            }}
                            placeholder="Seller Address"
                            onChange={(event) => {
                                setSellerAddress(event.target.value)
                            }}
                        />

                        <Button
                            style={{
                                color: "black",
                                backgroundColor: "lightblue",
                                marginLeft: "1rem",
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
                                marginLeft: "1rem",
                                display: "flex",
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
                                display: "flex",
                            }}
                        >
                            Seller's TotalProducts: {totalProducts}
                        </Typography>
                    </div>
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
                                placeholder="Seller Address"
                                onChange={(event) => {
                                    setSellerAddress(event.target.value)
                                }}
                            />

                            <Input
                                style={{
                                    color: "black",
                                    marginLeft: "1rem",
                                }}
                                placeholder="Product ID"
                                onChange={(event) => {
                                    setProductID(event.target.value)
                                }}
                            />

                            <Button
                                style={{
                                    color: "black",
                                    backgroundColor: "lightblue",
                                    marginLeft: "1rem",
                                }}
                                text="Retrieve Seller Product"
                                theme="custom"
                                radius={50}
                                onClick={() =>
                                    viewProductName({
                                        // onComplete:
                                        // onError:
                                        onSuccess: handleSuccessTwo,
                                        onError: (error) => console.log(error),
                                    })
                                }
                            />

                            <Typography
                                variant="custom"
                                style={{
                                    color: "black",
                                    padding: "10px",
                                    marginLeft: "1rem",
                                    display: "flex",
                                }}
                            >
                                Product Name: {ProductName}
                            </Typography>
                            <Typography
                                variant="custom"
                                style={{
                                    color: "black",
                                    padding: "10px",
                                    marginLeft: "0.1rem",
                                    display: "flex",
                                }}
                            >
                                Product Price: {ProductPrice}
                            </Typography>
                            <Typography
                                variant="custom"
                                style={{
                                    color: "black",
                                    padding: "10px",
                                    marginLeft: "0.1rem",
                                    display: "flex",
                                }}
                            >
                                Product Review: {ProductReview / 10 ** 18}
                            </Typography>
                        </div>
                    </div>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
