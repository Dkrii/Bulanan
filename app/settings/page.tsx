'use client';
import Navbar from '@/components/Navbar';
import { useDeviceId } from '@/hooks/useDeviceId';
import { useTransactions } from '@/hooks/useTransactions';
import { exportToExcel, exportToWord } from '@/lib/export';
import { useState } from 'react';

export default function DataManagement() {
    const deviceId = useDeviceId();
    const { transactions, resetData } = useTransactions();
    const [resetting, setResetting] = useState(false);

    const handleCopyId = () => {
        if (deviceId) {
            navigator.clipboard.writeText(deviceId);
            alert('Device ID copied to clipboard!');
        }
    };

    const handleReset = async () => {
        if (window.confirm('CRITICAL WARNING: This will permanently delete ALL your transaction data associated with this device ID. This action cannot be undone. Are you absolutely sure?')) {
            setResetting(true);
            try {
                await resetData();
                alert('All data has been reset.');
            } catch (e) {
                console.error(e);
                alert('Failed to reset data.');
            } finally {
                setResetting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Data Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10">Manage your data, export reports, and device settings.</p>

                <div className="grid gap-8">
                    {/* Device Session Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg">
                                <span className="material-icons text-primary text-2xl">devices</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Device Session</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    Your data is synced to this specific device ID. Keep this ID safe to access your data on other devices or browsers.
                                </p>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <code className="text-primary font-mono font-bold flex-1">{deviceId || 'Loading...'}</code>
                                    <button onClick={handleCopyId} className="text-slate-500 hover:text-primary transition-colors" title="Copy ID">
                                        <span className="material-icons">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Export Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-100 dark:bg-emerald-500/10 p-3 rounded-lg">
                                <span className="material-icons text-emerald-600 dark:text-emerald-500 text-2xl">download</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Export Data</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Download your transaction history report in your preferred format.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => exportToExcel(transactions)}
                                        className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group"
                                    >
                                        <span className="material-icons text-emerald-600 dark:text-emerald-500 text-3xl group-hover:scale-110 transition-transform">table_view</span>
                                        <div className="text-left">
                                            <span className="block font-bold text-slate-700 dark:text-slate-200">Excel Format</span>
                                            <span className="text-xs text-slate-400">.xlsx spreadsheet</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => exportToWord(transactions)}
                                        className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group"
                                    >
                                        <span className="material-icons text-blue-600 dark:text-blue-500 text-3xl group-hover:scale-110 transition-transform">description</span>
                                        <div className="text-left">
                                            <span className="block font-bold text-slate-700 dark:text-slate-200">Word Format</span>
                                            <span className="text-xs text-slate-400">.docx document</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-6 border border-rose-100 dark:border-rose-900 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-rose-100 dark:bg-rose-900/50 p-3 rounded-lg">
                                <span className="material-icons text-rose-600 dark:text-rose-500 text-2xl">warning</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-rose-700 dark:text-rose-500 mb-1">Danger Zone</h2>
                                <p className="text-sm text-rose-600/80 dark:text-rose-400 mb-6">
                                    Irreversible actions. Tread carefully.
                                </p>
                                <button
                                    onClick={handleReset}
                                    disabled={resetting}
                                    className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-500 border border-rose-200 dark:border-rose-800 px-4 py-2 rounded-lg font-semibold hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-sm disabled:opacity-50"
                                >
                                    {resetting ? 'Resetting...' : 'Reset All Data'}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
