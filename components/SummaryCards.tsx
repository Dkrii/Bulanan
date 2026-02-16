import { formatMoney } from '@/lib/utils';
import { Transaction } from '@/hooks/useTransactions';

interface SummaryCardsProps {
    transactions: Transaction[];
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((a, b) => a + b.amount, 0);

    const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((a, b) => a + b.amount, 0);

    const balance = income - expense;

    return (
        <div className="grid grid-cols-2 gap-3 mb-2">
            {/* Balance Card - Full Width */}
            <div className="col-span-2 bg-blue-600 rounded-2xl p-4 shadow-lg shadow-blue-200 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-blue-100 text-xs font-medium uppercase tracking-wider block mb-1">Current Balance</span>
                    <span className="text-3xl font-bold block mb-1">{formatMoney(balance)}</span>
                    <span className="text-blue-200 text-xs">Available for this month</span>
                </div>
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2">
                    <span className="material-icons text-8xl">account_balance_wallet</span>
                </div>
            </div>

            {/* Income Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="material-icons text-emerald-600 text-sm">arrow_downward</span>
                    </div>
                    <span className="text-gray-500 text-xs font-medium">Income</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatMoney(income)}</span>
            </div>

            {/* Expense Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                        <span className="material-icons text-rose-600 text-sm">arrow_upward</span>
                    </div>
                    <span className="text-gray-500 text-xs font-medium">Expense</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatMoney(expense)}</span>
            </div>
        </div>
    );
}
