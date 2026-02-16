import { Transaction } from '@/hooks/useTransactions';
import { formatMoney, formatDate, getIconForCategory } from '@/lib/utils';
import { useState } from 'react';

interface TransactionListProps {
    transactions: Transaction[];
    onTransactionClick: (t: Transaction) => void;
}

export default function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="material-icons text-3xl text-gray-400">receipt_long</span>
                </div>
                <p className="text-sm font-medium">No transactions yet.</p>
                <p className="text-xs text-gray-400 mt-1">Tap the + button to add one.</p>
            </div>
        );
    }

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="space-y-6 pb-24"> {/* pb-24 for FAB space */}
            {sortedDates.map((date) => (
                <div key={date}>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <div className="space-y-3">
                        {groupedTransactions[date].map((t) => (
                            <div
                                key={t.id}
                                onClick={() => onTransactionClick(t)}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                        }`}>
                                        {getIconForCategory(t.category)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900">{t.category}</span>
                                        {t.note && <span className="text-xs text-gray-400 truncate max-w-[140px]">{t.note}</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {t.type === 'income' ? '+' : ''}{formatMoney(t.amount)}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium uppercase">{t.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
