import { Transaction } from '@/hooks/useTransactions';
import { formatMoney, formatDate, getIconForCategory } from '@/lib/utils';
import { useState } from 'react';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (t: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
    // Simple pagination for now
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const currentData = transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
                <div className="flex items-center gap-2">
                    {/* Export buttons could go here or parent. Leaving empty as per design they are separte or here */}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transactions found.</td>
                            </tr>
                        ) : currentData.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(t.date)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded text-xl">
                                            {getIconForCategory(t.category)}
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium block">{t.category}</span>
                                            {t.note && <span className="text-xs text-slate-400 block">{t.note}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.type === 'income'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500'
                                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-500'
                                        }`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'
                                        }`}>
                                        {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-primary transition-colors" title="Edit">
                                            <span className="material-icons text-lg">edit</span>
                                        </button>
                                        <button onClick={() => onDelete(t.id)} className="text-slate-400 hover:text-danger transition-colors" title="Delete">
                                            <span className="material-icons text-lg">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/20 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Showing {currentData.length} of {transactions.length} transactions
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-1 px-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary text-xs font-semibold disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-1 px-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary text-xs font-semibold disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
