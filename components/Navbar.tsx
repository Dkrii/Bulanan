import Link from 'next/link';
import { useDeviceId } from '@/hooks/useDeviceId';

export default function Navbar() {
    const deviceId = useDeviceId();

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-white text-xl">account_balance_wallet</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">FinTrack</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Device Session</span>
                            <span className="text-primary font-mono font-semibold">{deviceId || 'Generating...'}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                        <Link href="/settings" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">
                            <span className="material-icons">settings</span>
                        </Link>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wide">Sync Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
