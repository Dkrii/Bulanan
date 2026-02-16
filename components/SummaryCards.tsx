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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 mt-4 mr-4 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-emerald-500 text-6xl">trending_up</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2 rounded-lg">
                        <span className="material-icons text-emerald-600 dark:text-emerald-500">payments</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Income</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatMoney(income)}</span>
                    <span className="text-emerald-600 dark:text-emerald-500 text-xs font-medium mt-1 flex items-center gap-1">
                        <span className="material-icons text-xs">arrow_upward</span> Trending up
                    </span>
                </div>
            </div>

            {/* Expense */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute right-0 top-0 mt-4 mr-4 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-rose-500 text-6xl">trending_down</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-rose-100 dark:bg-rose-500/10 p-2 rounded-lg">
                        <span className="material-icons text-rose-600 dark:text-rose-500">shopping_cart</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Expenses</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatMoney(expense)}</span>
                    <span className="text-rose-600 dark:text-rose-500 text-xs font-medium mt-1 flex items-center gap-1">
                        <span className="material-icons text-xs">arrow_downward</span> Track carefully
                    </span>
                </div>
            </div>

            {/* Balance */}
            <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 relative overflow-hidden group">
                <div className="absolute right-0 top-0 mt-4 mr-4 opacity-20 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-white text-6xl">account_balance</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-icons text-white">savings</span>
                    </div>
                    <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Current Balance</span>
                </div>
                <div className="flex flex-col text-white">
                    <span className="text-3xl font-bold">{formatMoney(balance)}</span>
                    <span className="text-white/70 text-xs font-medium mt-1">Based on current month</span>
                </div>
            </div>
        </div>
    );
}
