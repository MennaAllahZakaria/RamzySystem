import { useEffect, useState } from "react";
import { Eye, FilePlus2, LogOut, Printer } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";
import InvoicePreviewModal from "../components/InvoicePreviewModal";
import PdfPreviewModal from "../components/PdfPreviewModal";
import { apiErrorMessage, formatDate, formatMoney, unwrapData } from "../utils/pageHelpers";
import { getInvoice, getInvoicePdf, listInvoices } from "../api/invoices";

const paymentLabel = { paid: "مدفوعة", partially_paid: "مدفوعة جزئياً", credit: "غير مدفوعة", overdue: "غير مدفوعة" };

export default function SellerWorkspacePage({ user, onLogout }) {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const loadInvoices = async () => {
    setState({ loading: true, error: "" });
    try {
      const [salesResponse, maintenanceResponse] = await Promise.all([
        listInvoices({ limit: 100, invoiceType: "sale" }),
        listInvoices({ limit: 100, invoiceType: "maintenance" }),
      ]);
      const sales = unwrapData(salesResponse);
      const maintenance = unwrapData(maintenanceResponse);
      setRows([...sales, ...maintenance].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)));
      setState({ loading: false, error: "" });
    } catch (error) {
      setState({ loading: false, error: apiErrorMessage(error) });
    }
  };

  useEffect(() => { loadInvoices(); }, []);

  const openPreview = async (invoice) => {
    setPreviewInvoice(invoice);
    try {
      const details = unwrapData(await getInvoice(invoice._id));
      if (details && !Array.isArray(details)) setPreviewInvoice(details);
    } catch (error) {
      setState((current) => ({ ...current, error: apiErrorMessage(error) }));
    }
  };

  const openPdf = async (invoice) => {
    try {
      const blob = await getInvoicePdf(invoice._id);
      setPdfPreview({ blob, filename: `${invoice.invoiceNumber}.pdf` });
    } catch (error) {
      setState((current) => ({ ...current, error: apiErrorMessage(error) }));
    }
  };

  return <div className="min-h-screen bg-[#f7f9fa]">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-8">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-100 bg-white"><img src="/assets/ramzy-logo.jpg" alt="رمزي سيستم" className="h-full w-full object-cover" /></div>
        <div><strong className="block text-base text-slate-800">رمزي سيستم</strong><span className="text-xs text-slate-500">واجهة المبيعات</span></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-left"><strong className="block text-xs text-slate-700">{user?.name || "البائع"}</strong><span className="text-[10px] text-slate-400">مبيعات</span></div>
        <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><LogOut size={15} /> تسجيل الخروج</button>
      </div>
    </header>

    <main className="page-container !pt-7">
      <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><span className="eyebrow">إصدار الفواتير</span><h1 className="!m-0 !text-[25px]">فواتير البيع والصيانة</h1><p className="mt-2 text-xs text-slate-500">أضيفي فاتورة، حددي حالة السداد، ثم عاينيها واطبعيها.</p></div>
        <button type="button" onClick={() => setInvoiceModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#df2431] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-red-200"><FilePlus2 size={17} /> فاتورة جديدة</button>
      </section>

      {state.error && <div className="page-error mb-4">{state.error}</div>}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="m-0 text-sm font-bold text-slate-800">الفواتير</h2><p className="mt-1 text-[10px] text-slate-400">{rows.length} فاتورة</p></div><button type="button" onClick={loadInvoices} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-500">تحديث</button></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead><tr className="bg-slate-50 text-right text-[10px] text-slate-500"><th className="px-5 py-3">رقم الفاتورة</th><th className="px-4 py-3">العميل</th><th className="px-4 py-3">النوع</th><th className="px-4 py-3">الإجمالي</th><th className="px-4 py-3">حالة السداد</th><th className="px-4 py-3">التاريخ</th><th className="px-4 py-3">طباعة</th></tr></thead>
            <tbody>{state.loading ? <tr><td colSpan="7" className="p-12 text-center text-xs text-slate-400">جارٍ تحميل الفواتير...</td></tr> : rows.map((invoice) => <tr key={invoice._id} className="border-t border-slate-100 text-[11px] text-slate-600"><td className="px-5 py-4 font-bold text-slate-800">{invoice.invoiceNumber}</td><td className="px-4 py-4">{invoice.party?.name || invoice.partyName || "—"}</td><td className="px-4 py-4">{invoice.invoiceType === "maintenance" ? "صيانة" : "بيع"}</td><td className="px-4 py-4 font-bold">{formatMoney(invoice.total)} ج.م</td><td className="px-4 py-4"><span className={`status-pill ${invoice.paymentStatus === "paid" ? "status-paid" : invoice.paymentStatus === "partially_paid" ? "status-partial" : "status-due"}`}>{paymentLabel[invoice.paymentStatus] || "غير مدفوعة"}</span></td><td className="px-4 py-4 text-slate-400">{formatDate(invoice.issueDate)}</td><td className="px-4 py-4"><div className="flex items-center gap-3"><button type="button" title="معاينة الفاتورة" aria-label="معاينة الفاتورة" onClick={() => openPreview(invoice)} className="text-slate-600"><Eye size={17} /></button><button type="button" title="معاينة PDF والطباعة" aria-label="معاينة PDF والطباعة" onClick={() => openPdf(invoice)} className="inline-flex items-center gap-1 font-bold text-emerald-700"><Printer size={16} /> طباعة</button></div></td></tr>)}{!state.loading && !rows.length && <tr><td colSpan="7" className="p-12 text-center text-xs text-slate-400">لا توجد فواتير بعد. اضغطي «فاتورة جديدة» للبدء.</td></tr>}</tbody>
          </table>
        </div>
      </section>
    </main>

    {invoiceModalOpen && <InvoiceModal initialType="sale" sellerMode onClose={() => setInvoiceModalOpen(false)} onSaved={loadInvoices} />}
    {previewInvoice && <InvoicePreviewModal invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />}
    {pdfPreview && <PdfPreviewModal blob={pdfPreview.blob} filename={pdfPreview.filename} onClose={() => setPdfPreview(null)} />}
  </div>;
}
