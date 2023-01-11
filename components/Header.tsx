import Link from "next/link"

export default function Header() {
    return (
        <header className="flex justify-around w-full py-5 bg-yellow-400">
            <div className="flex items-center space-x-5">
                <Link href='/'>
                    <img
                        className="object-contain w-44 cursor-pointer"
                        src="https://links.papareact.com/yvf" alt="medium logo" />
                </Link>
            </div>
            <div className="flex items-center space-x-5">
                <div className="hidden md:inline-flex items-center space-x-5">
                    <h3>Our story</h3>
                    <h3>Membership</h3>
                    <h3>write</h3>
                </div>
                <div className="flex items-center space-x-5">
                    <h3>Sign In</h3>
                    <h3 className="border px-4 py-1 rounded-full border-black bg-black text-white">Get tarted</h3>
                </div>
            </div>


        </header>
    )
}
