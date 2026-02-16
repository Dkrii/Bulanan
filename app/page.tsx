'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SummaryCards from '@/components/SummaryCards';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import { useTransactions, Transaction } from '@/hooks/useTransactions';

export default function Home() {
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const handleAddClick = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleSave = async (txData: any) => {
    if (editingTx) {
      await updateTransaction(editingTx.id, txData);
    } else {
      await addTransaction(txData);
    }
    // Modal closes via onSuccess in Modal component or here? Modal component calls onSave then onClose.
    // We should wait for update/add to finish. The hook functions are async.
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const localeMonth = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Financial Overview
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md ml-2 border border-slate-200 dark:border-slate-700">
                {localeMonth} {currentYear}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track your income and expenses effortlessly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currentMonth}
              onChange={handleMonthChange}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-icons text-sm">add</span>
              Add Transaction
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Transaction List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTx}
      />

      {/* Floating Help Button */}
      <button className="fixed bottom-6 right-6 bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform z-40">
        <span className="material-icons">help_outline</span>
      </button>
    </div>
  );
}
