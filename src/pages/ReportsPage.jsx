import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  FileBarChart,
  FileDown,
  Layers3,
  Printer,
  RefreshCw,
  ReceiptText,
  Target,
  TrendingUp,
  UsersRound,
  WalletCards,
  Warehouse,
} from "lucide-react";
import {
  exportGrossProfit,
  getAgingReport,
  getBalanceSheet,
  getExpensesSummary,
  getGrossProfit,
  getInventoryValue,
  getInventoryValuation,
  getInvoiceMargins,
  getNetInvoices,
  getPayrollSummary,
  getProfitLoss,
  getQuotationsSummary,
  getSalesSummary,
} from "../api/reports";
import { apiErrorMessage, formatDate, formatMoney } from "../utils/pageHelpers";

const today = new Date().toISOString().slice(0, 10);
const monthStart = `${today.slice(0, 8)}01`;
const tabs = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "sales", label: "المبيعات والفواتير", icon: ReceiptText },
  { id: "expenses", label: "المصروفات والرواتب", icon: WalletCards },
  { id: "aging", label: "أعمار الديون", icon: UsersRound },
  { id: "inventory", label: "تقييم المخزون", icon: Warehouse },
  { id: "quotes", label: "عروض الأسعار", icon: FileBarChart },
];

const payload = (response) => response?.data ?? response ?? {};
const money = (value) => formatMoney(value);
const percent = (value) => `${money(value)}%`;

function dateQuery(range) {
  return { from: range.from, to: range.to };
}

function asOfQuery(range) {
  return { asOf: range.to };
}

export default function ReportsPage() {
  const [range, setRange] = useState({ from: monthStart, to: today });
  const [activeTab, setActiveTab] = useState("overview");
  const [valuationMethod, setValuationMethod] = useState("actual_cost");
  const [reports, setReports] = useState({});
  const [state, setState] = useState({ loading: true, error: "" });

  const loadReports = async () => {
    if (!range.from || !range.to || range.from >= range.to) {
      setState({ loading: false, error: "يجب أن يكون تاريخ البداية قبل تاريخ النهاية." });
      return;
    }
    setState({ loading: true, error: "" });
    try {
      const period = dateQuery(range);
      const asOf = asOfQuery(range);
      const [profitLoss, grossProfit, sales, expenses, customerAging, supplierAging, payroll, quotations, balanceSheet, inventoryValue, netInvoices, invoiceMargins, inventoryValuation] = await Promise.all([
        getProfitLoss(period),
        getGrossProfit(period),
        getSalesSummary(period),
        getExpensesSummary(period),
        getAgingReport("customer", asOf),
        getAgingReport("supplier", asOf),
        getPayrollSummary(period),
        getQuotationsSummary(period),
        getBalanceSheet(asOf),
        getInventoryValue(asOf),
        getNetInvoices(period),
        getInvoiceMargins(period),
        getInventoryValuation({ ...asOf, method: valuationMethod }),
      ]);
      setReports({ profitLoss, grossProfit, sales, expenses, customerAging, supplierAging, payroll, quotations, balanceSheet, inventoryValue, netInvoices, invoiceMargins, inventoryValuation });
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error) });
    }
  };

  // التقارير يتم تحميلها عند فتح الصفحة أو الضغط على تحديث حتى لا نرسل طلباً مع كل تغيير في التاريخ.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadReports(); }, []);

  const valuationRows = payload(reports.inventoryValuation)?.data || [];
  const reportPeriod = useMemo(() => `${formatDate(range.from)} إلى ${formatDate(range.to)}`, [range]);
  const exportCurrentPdf = async () => {
    if (activeTab === "overview") {
      await downloadGrossProfitReport(range, "pdf");
      return;
    }
    window.print();
  };

  return <div className="page-container reports-page !pt-7">
    <header className="reports-toolbar mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><span className="eyebrow">التحليل المالي والمحاسبي</span><h2 className="!m-0 !text-[25px]">التقارير المالية</h2><p className="mt-2 text-xs text-slate-500">تقارير الأرباح، المبيعات، الديون، المخزون والرواتب في شاشة واحدة.</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <DateInput label="من" value={range.from} onChange={(from) => setRange((current) => ({ ...current, from }))} />
        <DateInput label="إلى" value={range.to} onChange={(to) => setRange((current) => ({ ...current, to }))} />
        <button onClick={loadReports} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-[#df2431]" title="تحديث التقارير"><RefreshCw size={16} /></button>
        <button onClick={exportCurrentPdf} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#df2431] px-3 text-[11px] font-bold text-white shadow-sm hover:bg-[#c91e2a]" title="حفظ التقرير الحالي بصيغة PDF"><Printer size={15} /> حفظ PDF</button>
      </div>
    </header>

    {state.error && <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-700">{state.error}</div>}
    <div className="reports-tabs mb-5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"><div className="flex flex-wrap gap-1">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] ${activeTab === id ? "bg-[#fff1f2] font-bold text-[#df2431]" : "text-slate-500 hover:bg-slate-50"}`}><Icon size={15} />{label}</button>)}</div></div>

    {state.loading ? <LoadingState /> : <>
      {activeTab === "overview" && <OverviewReport reports={reports} period={reportPeriod} range={range} onExport={() => downloadGrossProfitReport(range, "xlsx")} />}
      {activeTab === "sales" && <SalesReport reports={reports} />}
      {activeTab === "expenses" && <ExpensesReport reports={reports} />}
      {activeTab === "aging" && <AgingReport reports={reports} asOf={range.to} />}
      {activeTab === "inventory" && <InventoryReport reports={reports} method={valuationMethod} setMethod={setValuationMethod} onReload={loadReports} rows={valuationRows} />}
      {activeTab === "quotes" && <QuotesReport reports={reports} />}
    </>}
  </div>;
}

function DateInput({ label, value, onChange }) { return <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[10px] text-slate-500"><CalendarDays size={14} /><span>{label}</span><input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="bg-transparent text-xs outline-none" /></label>; }

function LoadingState() { return <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-xs text-slate-400 shadow-sm"><RefreshCw size={22} className="mx-auto mb-3 animate-spin text-[#df2431]" />جارٍ تحميل التقارير...</div>; }

function OverviewReport({ reports, period, onExport }) {
  const pl = payload(reports.profitLoss);
  const gross = payload(reports.grossProfit);
  const balance = payload(reports.balanceSheet);
  const inventory = payload(reports.inventoryValue);
  const margins = payload(reports.invoiceMargins);
  const cards = [
    { label: "إجمالي الإيرادات", value: pl.revenue?.totalRevenue, icon: <TrendingUp size={18} />, tone: "green" },
    { label: "صافي الربح", value: pl.netProfit, icon: <Target size={18} />, tone: "red" },
    { label: "قيمة المخزون", value: inventory.totalValue, icon: <Warehouse size={18} />, tone: "blue" },
    { label: "هامش ربح الفواتير", value: margins.totals?.marginPercent, suffix: "%", icon: <BarChart3 size={18} />, tone: "amber" },
  ];
  return <><div className="no-print mb-5 flex justify-end"><button onClick={onExport} className="inline-flex items-center gap-2 rounded-xl bg-[#1d282e] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#293b43]"><FileDown size={16} /> تصدير Excel</button></div><div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <ReportCard key={card.label} {...card} />)}</div><div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><ReportPanel title="الأرباح والخسائر" subtitle={period} rows={[["صافي المبيعات", pl.revenue?.netSales], ["تكلفة المنتجات", pl.directCosts?.productCost], ["عمولات الصنايعية", pl.directCosts?.workerCommission], ["إجمالي الربح", pl.grossProfit], ["المصروفات التشغيلية", pl.operatingExpenses], ["الديون المعدومة", pl.badDebt], ["صافي الربح", pl.netProfit]]} /><ReportPanel title="الميزانية العمومية" subtitle={`حتى ${formatDate(balance.asOf)}`} rows={[["النقدية والخزينة", balance.assets?.cash], ["المخزون", balance.assets?.inventory], ["العملاء / الذمم المدينة", balance.assets?.accountsReceivable], ["إجمالي الأصول", balance.assets?.totalAssets], ["الموردون / الذمم الدائنة", balance.liabilities?.accountsPayable], ["إجمالي الالتزامات", balance.liabilities?.totalLiabilities], ["حقوق الملكية التقديرية", balance.equity?.balancingEquity]]} /><ReportPanel title="ملخص إجمالي الربح" subtitle={period} rows={[["مبيعات المنتجات", gross.revenue?.productSales], ["مبيعات المصنعيات", gross.revenue?.laborSales], ["تكلفة المنتجات", gross.directCosts?.productCost], ["عمولات الصنايعية", gross.directCosts?.workerCommission], ["هامش الربح", gross.grossMarginPercent, "%"], ["صافي الربح", gross.netProfit]]} /></div></>;
}

function SalesReport({ reports }) {
  const sales = payload(reports.sales);
  const net = payload(reports.netInvoices);
  const margins = payload(reports.invoiceMargins);
  return <><div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4"><ReportCard label="عدد فواتير البيع" value={sales.totals?.invoiceCount} suffix="فاتورة" icon={<ReceiptText size={18} />} tone="blue" /><ReportCard label="صافي الفواتير" value={net.totals?.netInvoices} icon={<ArrowUp size={18} />} tone="green" /><ReportCard label="المبالغ المحصلة" value={net.totals?.paid} icon={<WalletCards size={18} />} tone="amber" /><ReportCard label="المتبقي للتحصيل" value={net.totals?.outstanding} icon={<ArrowDown size={18} />} tone="red" /></div><div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><DataTable title="المبيعات حسب العميل" columns={["العميل", "الفواتير", "المبيعات", "التكلفة", "الربح", "الهامش"]} rows={(sales.byCustomer || []).map((row) => [row.customer, row.invoiceCount, money(row.sales), money(row.directCost), money(row.grossProfit), percent(row.marginPercent)])} empty="لا توجد مبيعات خلال الفترة المحددة." /><DataTable title="صافي الفواتير" columns={["رقم الفاتورة", "العميل", "الإجمالي", "المدفوع", "المتبقي", "الحالة"]} rows={(net.data || []).map((row) => [row.invoiceNumber, row.party?.name || "—", money(row.netInvoice), money(row.paidAmount), money(row.outstanding), row.paymentStatus || "—"])} empty="لا توجد فواتير صادرة خلال الفترة المحددة." /></div><div className="mt-5"><DataTable title="تفاصيل هامش ربح الفواتير" columns={["الفاتورة", "الإيراد", "تكلفة المنتجات", "المصنعيات", "العمولة", "الربح", "الهامش"]} rows={(margins.data || []).map((row) => [row.invoiceNumber, money(row.netInvoice), money(row.productCost), money(row.laborRevenue), money(row.workerCommission), money(row.grossProfit), percent(row.marginPercent)])} empty="لا توجد تفاصيل هامش ربح." /></div></>;
}

function ExpensesReport({ reports }) {
  const expenses = payload(reports.expenses);
  const payroll = payload(reports.payroll);
  return <><div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4"><ReportCard label="إجمالي المصروفات" value={expenses.totals?.total} icon={<ArrowDown size={18} />} tone="red" /><ReportCard label="عدد المصروفات" value={expenses.totals?.count} suffix="عملية" icon={<ReceiptText size={18} />} tone="amber" /><ReportCard label="صافي الرواتب" value={payroll.totals?.netPaid} icon={<WalletCards size={18} />} tone="blue" /><ReportCard label="المسحوبات والسلف" value={payroll.totals?.withdrawals} icon={<ArrowDown size={18} />} tone="green" /></div><div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><DataTable title="المصروفات حسب التصنيف" columns={["التصنيف", "عدد العمليات", "الإجمالي", "النسبة"]} rows={(expenses.byCategory || []).map((row) => [row.category, row.count, money(row.total), percent(row.percentage)])} empty="لا توجد مصروفات خلال الفترة المحددة." /><DataTable title="ملخص الرواتب" columns={["البند", "القيمة"]} rows={[["المرتبات الأساسية", money(payroll.totals?.baseSalary)], ["عمولات الصنايعية", money(payroll.totals?.commissions)], ["الخصومات", money(payroll.totals?.deductions)], ["المسحوبات والسلف", money(payroll.totals?.withdrawals)], ["صافي المدفوع", money(payroll.totals?.netPaid)]]} empty="لا توجد دفعات رواتب." /></div></>;
}

function AgingReport({ reports, asOf }) { return <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><AgingPanel title="أعمار ديون العملاء" report={reports.customerAging} asOf={asOf} /><AgingPanel title="أعمار ديون الموردين" report={reports.supplierAging} asOf={asOf} /></div>; }
function AgingPanel({ title, report, asOf }) { const value = payload(report); const labels = [["الرصيد الافتتاحي", "openingBalance"], ["الحالي", "current"], ["من 1 إلى 30 يوم", "1_30"], ["من 31 إلى 60 يوم", "31_60"], ["من 61 إلى 90 يوم", "61_90"], ["أكثر من 90 يوم", "over_90"], ["إجمالي المستحق", "totalOutstanding"]]; return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-start justify-between"><div><span className="eyebrow">حتى {formatDate(asOf)}</span><h2 className="!m-0 !text-[17px]">{title}</h2></div><UsersRound size={19} className="text-[#df2431]" /></div><div className="mb-5 grid grid-cols-2 gap-2">{labels.map(([label, key]) => <div key={key} className="rounded-xl bg-slate-50 p-3"><span className="block text-[10px] text-slate-500">{label}</span><strong className="mt-1 block text-sm text-slate-800">{money(value.totals?.[key])} <small className="font-normal text-slate-400">ج.م</small></strong></div>)}</div><DataTable title="الأطراف المستحقة" columns={["الطرف", "الرصيد الافتتاحي", "المستحق", "أكثر من 90 يوم"]} rows={(value.data || []).map((row) => [row.party?.name || "—", money(row.openingBalance), money(row.totalOutstanding), money(row.buckets?.over_90)])} empty="لا توجد أرصدة مستحقة." /></section>; }

function InventoryReport({ reports, method, setMethod, onReload, rows }) { const value = payload(reports.inventoryValue); const valuation = payload(reports.inventoryValuation); return <><div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3"><ReportCard label="عدد الوحدات الحالية" value={value.totalUnits} suffix="وحدة" icon={<Layers3 size={18} />} tone="blue" /><ReportCard label="قيمة المخزون الحالية" value={value.totalValue} icon={<Warehouse size={18} />} tone="green" /><ReportCard label={`تقييم ${methodLabel(method)}`} value={valuation.totalValue} icon={<Target size={18} />} tone="amber" /></div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><span className="eyebrow">التقييم التاريخي حسب {methodLabel(method)}</span><h2 className="!m-0 !text-[17px]">طبقات تكلفة المخزون</h2></div><div className="flex items-center gap-2"><select value={method} onChange={(event) => setMethod(event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"><option value="actual_cost">التكلفة الفعلية</option><option value="fifo">FIFO</option><option value="weighted_average">المتوسط المرجح</option></select><button onClick={onReload} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:text-[#df2431]"><RefreshCw size={15} /></button></div></div><DataTable title="تفاصيل التقييم" columns={["المنتج", "المخزن", "الكمية", "تكلفة الوحدة", "قيمة المخزون", "المصدر"]} rows={rows.map((row) => [row.product?.name || row.productName || "—", row.warehouse?.name || row.warehouseName || "—", money(row.quantity), money(row.unitCost), money(row.value), row.sourceType || row.method || "—"])} empty="لا توجد طبقات مخزون للتقييم في التاريخ المحدد." /></section></>; }
function methodLabel(method) { return method === "fifo" ? "FIFO" : method === "weighted_average" ? "المتوسط المرجح" : "التكلفة الفعلية"; }

function QuotesReport({ reports }) { const quotes = payload(reports.quotations); return <><div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4"><ReportCard label="عدد عروض الأسعار" value={quotes.totals?.count} suffix="عرض" icon={<FileBarChart size={18} />} tone="blue" /><ReportCard label="قبل الخصم" value={quotes.totals?.totalBefore} icon={<ArrowUp size={18} />} tone="green" /><ReportCard label="إجمالي الخصومات" value={quotes.totals?.totalDiscount} icon={<ArrowDown size={18} />} tone="red" /><ReportCard label="بعد الخصم" value={quotes.totals?.totalAfter} icon={<Target size={18} />} tone="amber" /></div><DataTable title="عروض الأسعار حسب الحالة" columns={["الحالة", "العدد", "قبل الخصم", "الخصم", "بعد الخصم"]} rows={(quotes.byStatus || []).map((row) => [row.status, row.count, money(row.totalBefore), money(row.totalDiscount), money(row.totalAfter)])} empty="لا توجد عروض أسعار خلال الفترة المحددة." /></>; }

function ReportCard({ label, value, suffix = "ج.م", icon, tone }) { const tones = { green: "border-emerald-100 bg-emerald-50", red: "border-red-100 bg-red-50", blue: "border-blue-100 bg-blue-50", amber: "border-amber-100 bg-amber-50" }; return <div className={`rounded-2xl border p-5 shadow-sm ${tones[tone] || tones.blue}`}><span className="mb-4 grid h-9 w-9 place-items-center rounded-xl bg-white/80 text-slate-600">{icon}</span><span className="block text-[11px] text-slate-600">{label}</span><strong className="mt-2 block text-2xl text-slate-800">{money(value)} <small className="text-xs font-normal text-slate-400">{suffix}</small></strong></div>; }
function ReportPanel({ title, subtitle, rows }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="!m-0 !text-[17px]">{title}</h2><span className="text-[10px] text-slate-400">{subtitle}</span></div><div className="space-y-1">{rows.map(([label, value, suffix = "ج.م"]) => <div key={label} className="flex items-center justify-between rounded-xl px-3 py-3 odd:bg-slate-50"><span className="text-xs text-slate-600">{label}</span><strong className="text-sm text-slate-800">{suffix === "%" ? percent(value) : money(value)}{suffix !== "%" && <small className="mr-1 text-[10px] font-normal text-slate-400">{suffix}</small>}</strong></div>)}</div></section>; }
function DataTable({ title, columns, rows, empty }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="!m-0 !text-[17px]">{title}</h2><span className="text-[10px] text-slate-400">{rows.length} سجل</span></div><div className="overflow-x-auto"><table className="w-full min-w-[650px]"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={`${title}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className={cellIndex === 0 ? "font-semibold text-slate-800" : ""}>{cell}</td>)}</tr>)}</tbody></table>{!rows.length && <div className="p-8 text-center text-xs text-slate-400">{empty}</div>}</div></section>; }

async function downloadGrossProfitReport(range, format = "pdf") {
  const blob = await exportGrossProfit({ ...dateQuery(range), format });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gross-profit-${range.from}-${range.to}.${format === "pdf" ? "pdf" : "xlsx"}`;
  link.click();
  URL.revokeObjectURL(url);
}
