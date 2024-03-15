import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"

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
                <div>
                    <h1 className="py-4 px-4 font-bold text-3xl">
                        Contract Address: {storeAddress}
                    </h1>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
                        Create Seller
                    </button>
                </div>
            ) : (
                <div>No Store Address Detected </div>
            )}
        </div>
    )
}
