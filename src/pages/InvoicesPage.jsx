import { useMemo, useState } from "react";
import { CalendarDays, Download, FilePlus2, MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";

const invoices = [
  { number: "INV-2026-0184", party: "شركة النور للمقاولات", type: "بيع", amount: "24,850", paid: "مدفوعة", date: "01 أكتوبر 2026", due: "01 أكتوبر 2026" },
  { number: "PUR-2026-0091", party: "مؤسسة الأمان للتوريدات", type: "شراء", amount: "18,400", paid: "آجلة", date: "01 أكتوبر 2026", due: "15 أكتوبر 2026" },
  { number: "INV-2026-0183", party: "مكتب رامزي", type: "بيع داخلي", amount: "6,750", paid: "مدفوعة", date: "30 سبتمبر 2026", due: "30 سبتمبر 2026" },
  { number: "INV-2026-0182", party: "أحمد حسن", type: "بيع", amount: "3,240", paid: "جزئية", date: "30 سبتمبر 2026", due: "30 سبتمبر 2026" },
  { number: "PUR-2026-0090", party: "الشركة المتحدة", type: "شراء", amount: "42,100", paid: "آجلة", date: "29 سبتمبر 2026", due: "13 أكتوبر 2026" },
  { number: "INV-2026-0181", party: "محمود إبراهيم", type: "بيع", amount: "8,920", paid: "مدفوعة", date: "28 سبتمبر 2026", due: "28 سبتمبر 2026" },
];

const tabs = ["كل الفواتير", "مبيعات", "مشتريات", "مسودة"];
const statusClass = { مدفوعة: "status-paid", آجلة: "status-due", جزئية: "status-partial" };

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState("كل الفواتير");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const filteredInvoices = useMemo(() => invoices.filter((invoice) => {
    const matchesQuery = `${invoice.number} ${invoice.party}`.toLowerCase().includes(query.toLowerCase());
    const matchesTab = activeTab === "كل الفواتير" || (activeTab === "مبيعات" && invoice.type.includes("بيع")) || (activeTab === "مشتريات" && invoice.type === "شراء") || activeTab === "مسودة";
    return matchesQuery && matchesTab;
  }), [activeTab, query]);

  return <div className="page-container !pt-7">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6"><div><span className="eyebrow">الحركة المالية</span><h2 className="!text-[25px] !m-0">الفواتير</h2><p className="text-xs text-slate-500 mt-2">إدارة ومتابعة فواتير البيع والشراء بكل سهولة.</p></div><button className="inline-flex items-center gap-2 rounded-xl bg-[#df2431] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5" onClick={() => setModalOpen(true)}><FilePlus2 size={17} /> فاتورة جديدة</button></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-5"><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[11px] text-slate-500">إجمالي الفواتير</span><strong className="mt-2 block text-2xl text-slate-800">١٨٤</strong></div><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[11px] text-slate-500">إجمالي المبيعات</span><strong className="mt-2 block text-2xl text-[#df2431]">١٨٦,٤٢٠ <small className="text-xs font-normal text-slate-400">ج.م</small></strong></div><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-[11px] text-slate-500">فواتير تحتاج متابعة</span><strong className="mt-2 block text-2xl text-[#be7614]">١٢</strong></div></div>
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-3 py-2 text-[11px] transition ${activeTab === tab ? "bg-white font-bold text-[#df2431] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{tab}</button>)}</div><div className="flex items-center gap-2"><label className="flex h-9 w-52 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث برقم الفاتورة..." className="w-full bg-transparent text-[11px] text-slate-700 outline-none" /></label><button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="الفلاتر"><SlidersHorizontal size={16} /></button><button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="تصدير"><Download size={16} /></button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse"><thead><tr className="text-right text-[10px] text-slate-400"><th className="px-5 py-4 font-medium">رقم الفاتورة</th><th className="px-4 py-4 font-medium">الطرف</th><th className="px-4 py-4 font-medium">النوع</th><th className="px-4 py-4 font-medium">المبلغ</th><th className="px-4 py-4 font-medium">الحالة</th><th className="px-4 py-4 font-medium"><CalendarDays size={14} className="inline" /> التاريخ</th><th className="px-4 py-4" /></tr></thead><tbody>{filteredInvoices.map((invoice) => <tr key={invoice.number} className="border-t border-slate-100 text-[11px] text-slate-600 transition hover:bg-red-50/30"><td className="px-5 py-4 font-bold text-slate-800">{invoice.number}</td><td className="px-4 py-4">{invoice.party}</td><td className="px-4 py-4"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px]">{invoice.type}</span></td><td className="px-4 py-4 font-bold text-slate-800">{invoice.amount} <small className="font-normal text-slate-400">ج.م</small></td><td className="px-4 py-4"><span className={`status-pill ${statusClass[invoice.paid]}`}>{invoice.paid}</span></td><td className="px-4 py-4 text-slate-400">{invoice.date}</td><td className="px-4 py-4"><button className="text-slate-400 hover:text-[#df2431]" aria-label="خيارات"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table>{filteredInvoices.length === 0 && <div className="p-12 text-center text-xs text-slate-400">لا توجد فواتير مطابقة للبحث الحالي.</div>}</div></section>
    {modalOpen && <InvoiceModal onClose={() => setModalOpen(false)} />}
  </div>;
}
