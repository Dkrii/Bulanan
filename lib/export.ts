import { Transaction } from '@/hooks/useTransactions';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, AlignmentType, BorderStyle } from 'docx';
import { formatMoney } from './utils';

// Helper to save blob
const saveBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};

export const exportToExcel = (transactions: Transaction[]) => {
    // 1. Prepare Data with proper formatting
    const data = transactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString('id-ID'),
        Type: t.type.toUpperCase(),
        Category: t.category,
        Amount: t.amount, // Keep as number for Excel formulas
        Note: t.note || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // 2. Set Column Widths
    const wscols = [
        { wch: 15 }, // Date
        { wch: 10 }, // Type
        { wch: 20 }, // Category
        { wch: 15 }, // Amount
        { wch: 30 }, // Note
    ];
    ws['!cols'] = wscols;

    // 3. Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `finance_tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToWord = async (transactions: Transaction[]) => {
    // Helper for table cells
    const createCell = (text: string, bold = false, align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT) => {
        return new TableCell({
            children: [new Paragraph({
                children: [new TextRun({ text, bold, size: 24 })], // size 24 = 12pt
                alignment: align,
            })],
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
        });
    };

    const tableRows = transactions.map(t =>
        new TableRow({
            children: [
                createCell(new Date(t.date).toLocaleDateString('id-ID')),
                createCell(t.type.toUpperCase()),
                createCell(t.category),
                createCell(formatMoney(t.amount), false, AlignmentType.RIGHT),
                createCell(t.note || '-'),
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
                            size: 32, // 16pt
                            color: "2E7D32", // Emerald Green
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Generated on: ${new Date().toLocaleDateString('id-ID')}`,
                            italics: true,
                            size: 20,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                createCell("Date", true),
                                createCell("Type", true),
                                createCell("Category", true),
                                createCell("Amount", true, AlignmentType.RIGHT),
                                createCell("Note", true),
                            ],
                            tableHeader: true,
                        }),
                        ...tableRows
                    ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "aaaaaa" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "aaaaaa" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "aaaaaa" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "aaaaaa" },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "dddddd" },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "dddddd" },
                    }
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveBlob(blob, `finance_tracker_${new Date().toISOString().split('T')[0]}.docx`);
};
