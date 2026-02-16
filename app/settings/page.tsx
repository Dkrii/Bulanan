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
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            <main className="max-w-md mx-auto px-4 pt-24 pb-10 animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Management</h1>
                <p className="text-gray-500 mb-8 text-sm">Manage your data, export reports, and device settings.</p>

                <div className="space-y-6">
                    {/* Device Session Section */}
                    <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl">
                                <span className="material-icons text-blue-600 text-xl">devices</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h2 className="text-base font-bold text-gray-900 mb-1">Device Session</h2>
                                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                    Your data is synced to this specific device ID. Keep this ID safe.
                                </p>
                                <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                                    <code className="text-blue-600 font-mono text-xs font-bold flex-1 truncate">{deviceId || 'Loading...'}</code>
                                    <button onClick={handleCopyId} className="text-gray-400 hover:text-blue-600 transition-colors bg-white p-1.5 rounded-lg shadow-sm border border-gray-100" title="Copy ID">
                                        <span className="material-icons text-sm">content_copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Export Section */}
                    <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-50 p-3 rounded-xl">
                                <span className="material-icons text-emerald-600 text-xl">download</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-base font-bold text-gray-900 mb-1">Export Data</h2>
                                <p className="text-xs text-gray-500 mb-4">
                                    Download your transaction history.
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => exportToExcel(transactions)}
                                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group bg-gray-50/50"
                                    >
                                        <span className="material-icons text-emerald-600 text-2xl group-hover:scale-110 transition-transform">table_view</span>
                                        <div className="text-center">
                                            <span className="block font-bold text-gray-700 text-xs">Excel</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => exportToWord(transactions)}
                                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all group bg-gray-50/50"
                                    >
                                        <span className="material-icons text-blue-600 text-2xl group-hover:scale-110 transition-transform">description</span>
                                        <div className="text-center">
                                            <span className="block font-bold text-gray-700 text-xs">Word</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-rose-100 p-3 rounded-xl">
                                <span className="material-icons text-rose-600 text-xl">warning</span>
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-rose-700 mb-1">Danger Zone</h2>
                                <p className="text-xs text-rose-600/80 mb-4">
                                    Irreversible actions. Tread carefully.
                                </p>
                                <button
                                    onClick={handleReset}
                                    disabled={resetting}
                                    className="w-full bg-white text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
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
