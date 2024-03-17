import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { Button, Input } from "web3uikit"

export default function MarketEntrace() {
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const storeAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    const { runContractFunction: createSeller } = useWeb3Contract({
        abi: abi,
        contractAddress: storeAddress,
        functionName: "createSeller",
        params: {},
    })

    return (
        <div className="p-5">
            {storeAddress ? (
                <div className="p-5">
                    <h1 className="py-5 px-`1 font-bold text-3xl">
                        Contract Address: {storeAddress}
                    </h1>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
