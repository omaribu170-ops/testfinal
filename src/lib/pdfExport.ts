/* =====================================================
   PDF Export Utilities
   لتصدير التقارير كـ PDF
===================================================== */

"use client";

// نوع البيانات للتقرير
interface ReportData {
    title: string;
    subtitle?: string;
    date: string;
    headers: string[];
    rows: (string | number)[][];
    summary?: { label: string; value: string | number }[];
}

// إنشاء HTML للتقرير
function createReportHTML(data: ReportData): string {
    const summaryHTML = data.summary
        ? `
            <div class="summary">
                ${data.summary.map(item => `
                    <div class="summary-item">
                        <span class="label">${item.label}</span>
                        <span class="value">${item.value}</span>
                    </div>
                `).join("")}
            </div>
        `
        : "";

    return `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>${data.title}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, sans-serif;
                    padding: 40px;
                    direction: rtl;
                    background: white;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #E63E32;
                }
                .header h1 {
                    color: #E63E32;
                    font-size: 28px;
                    margin-bottom: 5px;
                }
                .header .subtitle {
                    color: #666;
                    font-size: 14px;
                }
                .header .date {
                    color: #999;
                    font-size: 12px;
                    margin-top: 10px;
                }
                .logo {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #E63E32, #FF6B5C);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    color: white;
                    font-size: 24px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    padding: 12px 16px;
                    text-align: right;
                    border-bottom: 1px solid #eee;
                }
                th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #333;
                }
                tr:hover td {
                    background: #fafafa;
                }
                .summary {
                    margin-top: 30px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                }
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .summary-item:last-child {
                    border-bottom: none;
                    font-weight: bold;
                    font-size: 18px;
                    color: #E63E32;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #999;
                    font-size: 12px;
                }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🏠</div>
                <h1>${data.title}</h1>
                ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ""}
                <div class="date">${data.date}</div>
            </div>

            <table>
                <thead>
                    <tr>
                        ${data.headers.map(h => `<th>${h}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${data.rows.map(row => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            ${summaryHTML}

            <div class="footer">
                تم إنشاء هذا التقرير بواسطة The Hub System
                <br>
                ${new Date().toLocaleString("ar-EG")}
            </div>
        </body>
        </html>
    `;
}

// فتح نافذة للطباعة
export function printReport(data: ReportData) {
    const html = createReportHTML(data);
    const printWindow = window.open("", "_blank");

    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();

        // الانتظار قليلاً ثم الطباعة
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}

// تحميل كـ HTML (يمكن تحويله لـ PDF)
export function downloadReportHTML(data: ReportData, filename: string) {
    const html = createReportHTML(data);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// تصدير كـ CSV
export function downloadCSV(headers: string[], rows: (string | number)[][], filename: string) {
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // إضافة BOM للعربية
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// =====================================================
// تقارير جاهزة
// =====================================================

// تقرير الأعضاء
export function exportMembersReport(members: { name: string; phone: string; wallet_balance: number; total_spent: number }[]) {
    printReport({
        title: "تقرير الأعضاء",
        subtitle: `إجمالي ${members.length} عضو`,
        date: new Date().toLocaleDateString("ar-EG"),
        headers: ["الاسم", "الهاتف", "رصيد المحفظة", "إجمالي الإنفاق"],
        rows: members.map(m => [m.name, m.phone, `${m.wallet_balance} ج.م`, `${m.total_spent} ج.م`]),
        summary: [
            { label: "إجمالي رصيد المحافظ", value: `${members.reduce((s, m) => s + m.wallet_balance, 0)} ج.م` },
            { label: "إجمالي الإنفاق", value: `${members.reduce((s, m) => s + m.total_spent, 0)} ج.م` }
        ]
    });
}

// تقرير الجلسات
export function exportSessionsReport(sessions: { table_name: string; start_time: string; end_time: string; total_price: number }[]) {
    printReport({
        title: "تقرير الجلسات",
        subtitle: `إجمالي ${sessions.length} جلسة`,
        date: new Date().toLocaleDateString("ar-EG"),
        headers: ["الترابيزة", "وقت البداية", "وقت النهاية", "المبلغ"],
        rows: sessions.map(s => [s.table_name, s.start_time, s.end_time, `${s.total_price} ج.م`]),
        summary: [
            { label: "إجمالي الإيرادات", value: `${sessions.reduce((s, ses) => s + ses.total_price, 0)} ج.م` }
        ]
    });
}

// تقرير المصروفات
export function exportExpensesReport(expenses: { description: string; category: string; amount: number; expense_date: string }[]) {
    printReport({
        title: "تقرير المصروفات",
        subtitle: `إجمالي ${expenses.length} مصروف`,
        date: new Date().toLocaleDateString("ar-EG"),
        headers: ["الوصف", "التصنيف", "المبلغ", "التاريخ"],
        rows: expenses.map(e => [e.description, e.category, `${e.amount} ج.م`, e.expense_date]),
        summary: [
            { label: "إجمالي المصروفات", value: `${expenses.reduce((s, e) => s + e.amount, 0)} ج.م` }
        ]
    });
}

// تقرير مالي شامل
export function exportFinancialReport(data: { revenue: number; expenses: number; profit: number; period: string }) {
    printReport({
        title: "التقرير المالي",
        subtitle: data.period,
        date: new Date().toLocaleDateString("ar-EG"),
        headers: ["البند", "المبلغ"],
        rows: [
            ["إجمالي الإيرادات", `${data.revenue} ج.م`],
            ["إجمالي المصروفات", `${data.expenses} ج.م`],
            ["صافي الربح", `${data.profit} ج.م`]
        ],
        summary: [
            { label: "صافي الربح", value: `${data.profit} ج.م` }
        ]
    });
}
