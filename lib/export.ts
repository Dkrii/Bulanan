import { Transaction } from '@/hooks/useTransactions';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun } from 'docx';

// Helper to save blob (since file-saver might not be installed or needed if we use simple anchor)
const saveBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};

export const exportToExcel = (transactions: Transaction[]) => {
    const ws = XLSX.utils.json_to_sheet(transactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Type: t.type,
        Category: t.category,
        Amount: t.amount,
        Note: t.note || ''
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `finance_tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToWord = async (transactions: Transaction[]) => {
    const tableRows = transactions.map(t =>
        new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun(new Date(t.date).toLocaleDateString())] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(t.type)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(t.category)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(`Rp ${t.amount.toLocaleString('id-ID')}`)] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun(t.note || '-')] })] }),
            ],
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Finance Tracker Report",
                            bold: true,
                            size: 32,
                        }),
                    ],
                    spacing: { after: 400 },
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Amount", bold: true })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Note", bold: true })] })] }),
                            ],
                        }),
                        ...tableRows
                    ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveBlob(blob, `finance_tracker_${new Date().toISOString().split('T')[0]}.docx`);
};
