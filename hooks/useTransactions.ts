import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useDeviceId } from './useDeviceId';

export type Transaction = {
    id: string;
    created_at: string;
    device_id: string;
    date: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    note?: string;
};

export function useTransactions() {
    const deviceId = useDeviceId();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const fetchTransactions = useCallback(async () => {
        if (!deviceId) return;
        setLoading(true);

        const startDate = new Date(currentYear, currentMonth, 1).toISOString();
        const endDate = new Date(currentYear, currentMonth + 1, 1).toISOString();

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('device_id', deviceId)
            .gte('date', startDate)
            .lt('date', endDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
        } else {
            setTransactions(data as Transaction[] || []);
        }
        setLoading(false);
    }, [deviceId, currentMonth, currentYear]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (tx: Omit<Transaction, 'id' | 'created_at' | 'device_id'>) => {
        if (!deviceId) return;
        const { error } = await supabase
            .from('transactions')
            .insert([{ ...tx, device_id: deviceId }]);

        if (error) throw error;
        fetchTransactions();
    };

    const deleteTransaction = async (id: string) => {
        if (!deviceId) return;
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('device_id', deviceId);

        if (error) throw error;
        fetchTransactions();
    };

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        if (!deviceId) return;
        const { error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .eq('device_id', deviceId);

        if (error) throw error;
        fetchTransactions();
    };

    const resetData = async () => {
        if (!deviceId) return;
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('device_id', deviceId);

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
