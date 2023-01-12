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
            <nav className="flex items-center space-x-5">
                <ul className="hidden md:inline-flex items-center space-x-5">
                    <li>Dummy</li>
                    <li>Dummy</li>
                    <li>Dummy</li>
                </ul>
                <ul className="flex items-center space-x-5">
                    <li>Dummy Sign In</li>
                    <li className="border px-4 py-1 rounded-full border-black bg-black text-white">Dummy</li>
                </ul>
            </nav>
        </header>
    )
}
