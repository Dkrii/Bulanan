import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useDeviceId } from './useDeviceId';

export type Transaction = {
    id: string;
    created_at: string;
    // device_id: string; // Deprecated for frontend use, but kept in DB for migration
    user_id: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    note?: string;
};

export function useTransactions(userId?: string) {
    const deviceId = useDeviceId(); // Keep for migration
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Migration Logic
    useEffect(() => {
        const migrateData = async () => {
            if (!userId || !deviceId) return;

            // Check if there are orphaned transactions for this device
            // RLS policy "Allow claiming orphaned transactions" must be enabled
            const { error } = await supabase
                .from('transactions')
                .update({ user_id: userId, device_id: null }) // Claim them and clear device_id
                .eq('device_id', deviceId)
                .is('user_id', null);

            if (error) {
                console.error("Migration error:", error?.message, error)
            } else {
                // If successful, maybe trigger a refetch?
                // The main fetchTransactions will handle displaying the new data
            }
        };

        migrateData();
    }, [userId, deviceId]);

    const fetchTransactions = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);

        const startDate = new Date(currentYear, currentMonth, 1).toISOString();
        const endDate = new Date(currentYear, currentMonth + 1, 1).toISOString();

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lt('date', endDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
        } else {
            setTransactions(data as Transaction[] || []);
        }
        setLoading(false);
    }, [userId, currentMonth, currentYear]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (tx: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
        if (!userId) return;
        const { error } = await supabase
            .from('transactions')
            .insert([{ ...tx, user_id: userId }]);

        if (error) throw error;
        fetchTransactions();
    };

    const deleteTransaction = async (id: string) => {
        if (!userId) return;
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        fetchTransactions();
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        if (!userId) return;
        const { error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        fetchTransactions();
    };

    const resetData = async () => {
        if (!userId) return;
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        fetchTransactions();
    };

    return {
        transactions,
        loading,
        currentMonth,
        setCurrentMonth,
        currentYear,
        setCurrentYear,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        resetData,
        refresh: fetchTransactions
    };
}
