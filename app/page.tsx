'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import SummaryCards from '@/components/SummaryCards';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import { useTransactions, Transaction } from '@/hooks/useTransactions';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const {
    transactions,
    loading: txLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currentMonth,
    setCurrentMonth,
    currentYear,
  } = useTransactions(user?.id);

  const loading = authLoading || (user && txLoading);

  /* 
     MOVED HOOKS UP TO FIX "RULES OF HOOKS" VIOLATION 
     All hooks must be executed in the same order every render.
  */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(t =>
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Early return ONLY for rendering, after all hooks are called
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  // Open Add Modal
  const handleAddClick = () => {
    setEditingTx(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Layout (Triggered from Detail Modal)
  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
    setIsAddModalOpen(true);
    // Detail modal will be closed by its own internal logic or we close it here
    setDetailTx(null);
  };

  // Handle Save (Add or Update)
  const handleSave = async (txData: any) => {
    if (editingTx) {
      await updateTransaction(editingTx.id, txData);
    } else {
      await addTransaction(txData);
    }
  };

  // Handle Delete (Triggered from Detail Modal)
  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    setDetailTx(null);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="pt-20 px-4 max-w-md mx-auto">
        {/* Sticky Month Selector & Summary */}
        <div className="sticky top-14 bg-gray-50/95 backdrop-blur-sm z-30 py-2 -mx-4 px-4 border-b border-gray-100/50 mb-4 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <div className="relative">
              <select
                value={currentMonth}
                onChange={handleMonthChange}
                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl pl-3 pr-8 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })} {currentYear}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-icons text-gray-400 text-sm">expand_more</span>
              </div>
            </div>
          </div>

          <SummaryCards transactions={transactions} />

          {/* Search Bar */}
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-gray-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Transaction List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onTransactionClick={setDetailTx}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-icons text-2xl">add</span>
      </button>

      {/* Add/Edit Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
        initialData={editingTx}
      />

      {/* Detail Bottom Sheet */}
      <TransactionDetailModal
        isOpen={!!detailTx}
        transaction={detailTx}
        onClose={() => setDetailTx(null)}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
    </div>
  );
}
