import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 h-14 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <span className="material-icons text-white text-lg leading-none">account_balance_wallet</span>
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">FinTrack</span>
            </Link>
            <Link href="/settings" className="p-2 -mr-2 text-gray-500 hover:text-blue-600 transition-colors">
                <span className="material-icons text-xl leading-none">settings</span>
            </Link>
        </nav>
    );
}
