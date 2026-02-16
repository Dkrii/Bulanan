'use client';
import Navbar from '@/components/Navbar';
// import { useDeviceId } from '@/hooks/useDeviceId'; // No longer needed
import { useTransactions } from '@/hooks/useTransactions';
import { exportToExcel, exportToWord } from '@/lib/export';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileSpreadsheet, FileText, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/hooks/useTransactions';

export default function DataManagement() {
    const { user } = useAuth();
    // Pass user?.id to enable resetData functionality
    const { resetData } = useTransactions(user?.id);

    const [resetting, setResetting] = useState(false);
    const [exportingExcel, setExportingExcel] = useState(false);
    const [exportingWord, setExportingWord] = useState(false);

    const fetchAllTransactions = async (): Promise<Transaction[]> => {
        if (!user?.id) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching export data:', error);
            alert('Failed to fetch data for export.');
            return [];
        }
        return data as Transaction[];
    };

    const handleExportExcel = async () => {
        if (!user) return;
        setExportingExcel(true);
        try {
            const allTransactions = await fetchAllTransactions();
            if (allTransactions.length > 0) {
                exportToExcel(allTransactions);
            } else {
                alert('No transactions found to export.');
            }
        } finally {
            setExportingExcel(false);
        }
    };

    const handleExportWord = async () => {
        if (!user) return;
        setExportingWord(true);
        try {
            const allTransactions = await fetchAllTransactions();
            if (allTransactions.length > 0) {
                await exportToWord(allTransactions);
            } else {
                alert('No transactions found to export.');
            }
        } finally {
            setExportingWord(false);
        }
    };

    const onConfirmReset = async () => {
        if (!user) return;
        setResetting(true);
        try {
            await resetData();
            // Optional: You could use a toast notification here instead of alert
            alert('All data has been reset successfully.');
        } catch (e) {
            console.error(e);
            alert('Failed to reset data.');
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 pt-24 pb-10 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-2 text-sm">Manage your data, export reports, and account settings.</p>
                </div>

                <div className="space-y-6">
                    {/* Export Section - Improved UI */}
                    <Card className="border-emerald-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100/80 rounded-lg text-emerald-600">
                                    <span className="material-icons">download</span>
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-emerald-950">Export Data</CardTitle>
                                    <CardDescription className="text-emerald-700/80">
                                        Download your complete transaction history.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button
                                    onClick={handleExportExcel}
                                    variant="outline"
                                    disabled={exportingExcel}
                                    className="h-auto py-4 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                                >
                                    {exportingExcel ? (
                                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                                    ) : (
                                        <FileSpreadsheet className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                                    )}
                                    <div className="text-center">
                                        <div className="font-semibold text-gray-900 group-hover:text-emerald-700">Excel Report</div>
                                        <div className="text-xs text-gray-500 mt-1">.xlsx format</div>
                                    </div>
                                </Button>

                                <Button
                                    onClick={handleExportWord}
                                    variant="outline"
                                    disabled={exportingWord}
                                    className="h-auto py-4 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    {exportingWord ? (
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                    ) : (
                                        <FileText className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                    )}
                                    <div className="text-center">
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-700">Word Document</div>
                                        <div className="text-xs text-gray-500 mt-1">.docx format</div>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-rose-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-rose-50/50 border-b border-rose-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-100/80 rounded-lg text-rose-600">
                                    <Trash2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-rose-950">Danger Zone</CardTitle>
                                    <CardDescription className="text-rose-700/80">
                                        Irreversible actions. Please proceed with caution.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 mb-4 flex gap-3 items-start">
                                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-rose-800">
                                    <strong>Warning:</strong> Resetting your data will permanently delete all transactions associated with your account. This action cannot be undone.
                                </p>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="w-full sm:w-auto"
                                        disabled={resetting}
                                    >
                                        {resetting ? 'Resetting...' : 'Reset All Data'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your
                                            transaction data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={onConfirmReset}
                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                        >
                                            {resetting ? 'Deleting...' : 'Yes, delete everything'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
