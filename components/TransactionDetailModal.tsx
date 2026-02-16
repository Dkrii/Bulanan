import { Transaction } from '@/hooks/useTransactions';
import { formatMoney } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { slideUp } from '@/lib/animations';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: string, type: 'income' | 'expense') => Promise<void>;
}

export default function TransactionDetailModal({ isOpen, onClose, transaction, onEdit, onDelete }: TransactionDetailModalProps) {
    if (!transaction) return null;

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await onDelete(transaction.id, transaction.type);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                    />

                    {/* Bottom Sheet Modal */}
                    <motion.div
                        variants={slideUp as Variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-6 shadow-2xl safe-area-bottom max-w-md mx-auto"
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

                        {/* Header: Amount & Icon */}
                        <div className="text-center mb-8">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 shadow-sm ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                }`}>
                                <span className="material-icons text-3xl">
                                    {transaction.type === 'income' ? 'arrow_downward' : 'shopping_cart'}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                                {formatMoney(transaction.amount)}
                            </h2>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                {transaction.category}
                            </span>
                        </div>

                        {/* Details List */}
                        <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-2xl">
                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                <span className="text-gray-500">Date</span>
                                <span className="font-semibold text-gray-900">
                                    {new Date(transaction.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                                <span className="text-gray-500">Type</span>
                                <span className={`font-bold capitalize ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                    }`}>
                                    {transaction.type}
                                </span>
                            </div>
                            {transaction.note && (
                                <div className="flex flex-col gap-1 text-sm pt-1">
                                    <span className="text-gray-500">Note</span>
                                    <p className="font-medium text-gray-900 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 italic text-gray-700">
                                        "{transaction.note}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 pb-4">
                            <button
                                onClick={() => {
                                    onEdit(transaction);
                                    onClose();
                                }}
                                className="flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-600 font-semibold rounded-2xl hover:bg-blue-100 transition-colors"
                            >
                                <span className="material-icons text-sm">edit</span>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-600 font-semibold rounded-2xl hover:bg-rose-100 transition-colors"
                            >
                                <span className="material-icons text-sm">delete</span>
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
