import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl"> E-Commerce Platform </h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

/**
 * Notes: this header comes from web3uikit. however, other libraries can be used including react moralis
 * the above code allows us to automatically re render the web page
 */
