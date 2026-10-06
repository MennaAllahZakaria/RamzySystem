import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpLeft, CalendarDays, RefreshCw, WalletCards } from "lucide-react";
import { getDailyCashFlow } from "../api/cashFlow";
import { apiErrorMessage, formatDate, formatMoney, numberValue, unwrapData } from "../utils/pageHelpers";

const today = new Date().toISOString().slice(0, 10);

export default function CashFlowPage() {
  const [date, setDate] = useState(today);
  const [data, setData] = useState(null);
  const [state, setState] = useState({ loading: true, error: "" });

  const load = async () => {
    setState({ loading: true, error: "" });
    try { setData(await getDailyCashFlow({ date })); setState({ loading: false, error: "" }); }
    catch (error) { setState({ loading: false, error: apiErrorMessage(error) }); }
  };
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [date]);

  const summary = data?.data?.summary || data?.summary || data?.data || {};
  const rows = useMemo(() => unwrapData(data), [data]);
  const inflow = numberValue(summary.inflow ?? summary.totalInflow ?? data?.inflow);
  const outflow = numberValue(summary.outflow ?? summary.totalOutflow ?? data?.outflow);
  const net = inflow - outflow;

  return <div className="page-container !pt-7">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">الخزينة والسيولة</span><h2 className="!m-0 !text-[25px]">التدفقات النقدية</h2><p className="mt-2 text-xs text-slate-500">راجع حركة الداخل والخارج في أي يوم بدقة.</p></div><div className="flex items-center gap-2"><label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-500"><CalendarDays size={15} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="bg-transparent outline-none" /></label><button onClick={load} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-[#df2431]" title="تحديث"><RefreshCw size={16} /></button></div></div>
    {state.error && <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-700">{state.error}</div>}
    <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3"><Metric icon={<ArrowDownLeft size={18} />} label="إجمالي التدفقات الداخلة" value={inflow} tone="green" /><Metric icon={<ArrowUpLeft size={18} />} label="إجمالي التدفقات الخارجة" value={outflow} tone="amber" /><Metric icon={<WalletCards size={18} />} label="صافي التدفق" value={net} tone={net >= 0 ? "blue" : "red"} /></div>
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><span className="eyebrow">حركة يوم {formatDate(date)}</span><h2 className="!m-0 !text-[17px]">تفاصيل العمليات النقدية</h2></div><span className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] text-slate-500">{rows.length} عملية</span></div><div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr><th>البيان</th><th>النوع</th><th>المبلغ</th><th>الخزينة / البنك</th><th>التاريخ</th></tr></thead><tbody>{state.loading ? <tr><td colSpan="5" className="p-12 text-center text-xs text-slate-400">جارٍ تحميل التدفقات...</td></tr> : rows.map((row, index) => <tr key={row._id || row.id || index}><td className="font-semibold text-slate-800">{row.description || row.reference || row.type || "عملية مالية"}</td><td><span className={`status-pill ${String(row.direction || row.type || "").toLowerCase().includes("out") ? "status-due" : "status-paid"}`}>{row.direction === "outflow" || row.type === "outflow" ? "خارج" : "داخل"}</span></td><td className="font-bold text-slate-800">{formatMoney(row.amount || row.total)} <small className="font-normal text-slate-400">ج.م</small></td><td>{row.accountName || row.treasuryName || row.bankName || "—"}</td><td className="text-slate-400">{formatDate(row.date || row.createdAt)}</td></tr>)}</tbody></table>{!state.loading && !rows.length && <div className="p-12 text-center text-xs text-slate-400">لا توجد عمليات مسجلة لهذا اليوم.</div>}</div></section>
  </div>;
}

function Metric({ icon, label, value, tone }) { return <div className={`rounded-2xl border p-5 shadow-sm ${tone === "green" ? "border-emerald-100 bg-emerald-50" : tone === "amber" ? "border-amber-100 bg-amber-50" : tone === "red" ? "border-red-100 bg-red-50" : "border-blue-100 bg-blue-50"}`}><div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/80 text-slate-600">{icon}</span><span className="text-[11px] text-slate-600">{label}</span></div><strong className="text-2xl text-slate-800">{formatMoney(value)} <small className="text-xs font-normal text-slate-500">ج.م</small></strong></div>; }
