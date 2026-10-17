import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CalendarDays, Check, ClipboardCheck, Pencil, Printer, RefreshCw } from "lucide-react";
import {
  approveStockCount,
  createStockCount,
  getStockAlerts,
  listStockCounts,
  listWarehouses,
  previewStockCount,
  updateStockCount,
} from "../api/warehouses";
import { apiErrorMessage, formatDate, formatMoney } from "../utils/pageHelpers";
import { useConfirm } from "../components/Feedback";

const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const localEndOfDayIso = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
};
const number = (value) => {
  const parsed = Number(value?.$numberDecimal ?? value?.toString?.() ?? value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};
const fixedQuantity = (value) => Math.round((number(value) + Number.EPSILON) * 1000) / 1000;
const displayQuantity = (value) => new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 3 }).format(number(value));
const responseRows = (response) => {
  const candidates = [response?.data?.data, response?.data, response?.items, response?.docs, response?.results];
  return candidates.find(Array.isArray) || [];
};
const responseObject = (response) => response?.data ?? response;
const productIdOf = (item) => String(item?.product?._id || item?.product || "");
const itemSummary = (items = []) => items.reduce((summary, item) => {
  const expected = fixedQuantity(item.expectedQuantity);
  const counted = fixedQuantity(item.countedQuantity);
  const difference = fixedQuantity(counted - expected);
  const shortage = Math.max(fixedQuantity(expected - counted), 0);
  const surplus = Math.max(difference, 0);
  summary.expected = fixedQuantity(summary.expected + expected);
  summary.counted = fixedQuantity(summary.counted + counted);
  summary.difference = fixedQuantity(summary.difference + difference);
  summary.shortage = fixedQuantity(summary.shortage + shortage);
  summary.surplus = fixedQuantity(summary.surplus + surplus);
  if (shortage > 0) summary.shortageItems += 1;
  if (surplus > 0) summary.surplusItems += 1;
  return summary;
}, { expected: 0, counted: 0, difference: 0, shortage: 0, surplus: 0, shortageItems: 0, surplusItems: 0 });
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const dateInputValue = (value) => {
  if (!value) return localDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? localDate() : `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

export default function WarehousesPage() {
  const { confirm, dialog } = useConfirm();
  const [warehouses, setWarehouses] = useState([]);
  const [alerts, setAlerts] = useState({ lowStock: [] });
  const [stockAlertFilter, setStockAlertFilter] = useState("out");
  const [counts, setCounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [counted, setCounted] = useState({});
  const [countMode, setCountMode] = useState("");
  const [editingCount, setEditingCount] = useState(null);
  const [lastCount, setLastCount] = useState(null);
  const [countForm, setCountForm] = useState({ warehouse: "", fromDate: localDate(), toDate: localDate() });
  const [state, setState] = useState({ loading: true, saving: false, error: "" });
  const [countLoading, setCountLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const previewSequence = useRef(0);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [warehouseResponse, alertResponse, countResponse] = await Promise.all([
        listWarehouses(), getStockAlerts({}), listStockCounts({ limit: 50 }),
      ]);
      const warehouseRows = responseRows(warehouseResponse);
      setWarehouses(warehouseRows);
      setAlerts(alertResponse || { lowStock: [] });
      setCounts(responseRows(countResponse));
      setCountForm((current) => ({ ...current, warehouse: current.warehouse || warehouseRows[0]?.warehouse?._id || warehouseRows[0]?._id || "" }));
      setState((current) => ({ ...current, loading: false }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: apiErrorMessage(error) }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadPreview = async (mode, toDate) => {
    const sequence = ++previewSequence.current;
    setCountLoading(true);
    setState((current) => ({ ...current, error: "" }));
    try {
      const response = await previewStockCount({ mode, toDate });
      if (sequence !== previewSequence.current) return;
      const rows = responseRows(response);
      setProducts(rows);
      setCounted(Object.fromEntries(rows.map((item) => [productIdOf(item), String(fixedQuantity(item.expectedQuantity))])));
    } catch (error) {
      if (sequence === previewSequence.current) setState((current) => ({ ...current, error: apiErrorMessage(error) }));
    } finally {
      if (sequence === previewSequence.current) setCountLoading(false);
    }
  };

  const openNewCount = async (mode) => {
    const date = localDate();
    setCountMode(mode);
    setEditingCount(null);
    setProducts([]);
    setCounted({});
    setCountForm((current) => ({ ...current, fromDate: date, toDate: date }));
    setNotice(null);
    await loadPreview(mode, mode === "period" ? localEndOfDayIso(date) : date);
  };

  const changePeriodEnd = async (toDate) => {
    setCountForm((current) => ({ ...current, toDate }));
    if (countMode === "period" && toDate) await loadPreview("period", localEndOfDayIso(toDate));
  };

  const openEditCount = (count) => {
    const mode = count.countMode || (dateInputValue(count.fromDate) === dateInputValue(count.toDate) ? "now" : "period");
    const rows = (count.items || []).map((item) => ({ ...item, product: item.product || { _id: item.product } }));
    setEditingCount(count);
    setCountMode(mode);
    setProducts(rows);
    setCounted(Object.fromEntries(rows.map((item) => [productIdOf(item), String(fixedQuantity(item.countedQuantity))])));
    setCountForm({
      warehouse: count.warehouse?._id || count.warehouse || "",
      fromDate: dateInputValue(count.fromDate),
      toDate: dateInputValue(count.toDate),
    });
    setNotice(null);
    setState((current) => ({ ...current, error: "" }));
  };

  const printCount = (count) => {
    const items = count?.items || [];
    const summary = itemSummary(items);
    const body = items.map((item) => {
      const values = itemSummary([item]);
      const product = item.product || {};
      return `<tr><td>${escapeHtml(product.name || item.serialNumber || "—")}</td><td>${escapeHtml(item.serialNumber || product.serialNumber || "—")}</td><td>${displayQuantity(item.expectedQuantity)}</td><td>${displayQuantity(item.countedQuantity)}</td><td>${displayQuantity(values.shortage)}</td><td>${displayQuantity(values.surplus)}</td></tr>`;
    }).join("");
    const range = count.countMode === "period"
      ? `${escapeHtml(formatDate(count.fromDate))} إلى ${escapeHtml(formatDate(count.toDate))}`
      : escapeHtml(formatDate(count.date || count.toDate));
    const win = window.open("", "_blank", "width=1100,height=750");
    if (!win) return;
    win.document.write(`<html dir="rtl"><head><meta charset="utf-8"><title>تقرير جرد ${escapeHtml(count.countNumber)}</title><style>body{font-family:Arial;padding:24px;color:#1d282e}h1{color:#df2431}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #dce3e6;padding:9px;text-align:right}th{background:#f3f6f7}.totals{display:flex;gap:20px;margin-top:18px;font-weight:bold}.shortage{color:#b91c1c}</style></head><body><h1>تقرير جرد المحل</h1><p>رقم الجرد: ${escapeHtml(count.countNumber)} | النطاق: ${range}</p><p>الرصيد الدفتري المتوقع يشمل الرصيد الافتتاحي والحركات حتى تاريخ الجرد.</p><div class="totals"><span>المتوقع: ${displayQuantity(summary.expected)}</span><span>المعدود: ${displayQuantity(summary.counted)}</span><span class="shortage">العجز: ${displayQuantity(summary.shortage)} وحدة في ${summary.shortageItems} صنف</span><span>الزيادة: ${displayQuantity(summary.surplus)} وحدة</span></div><table><thead><tr><th>الصنف</th><th>السيريال</th><th>المتوقع شامل الافتتاحي</th><th>المعدود فعليًا</th><th>العجز</th><th>الزيادة</th></tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
    win.document.close();
  };

  const saveCount = async (event) => {
    event.preventDefault();
    if (!countForm.warehouse) return setState((current) => ({ ...current, error: "لا يوجد موقع مخزون نشط مرتبط بالمحل." }));
    if (countMode === "period" && countForm.fromDate > countForm.toDate) return setState((current) => ({ ...current, error: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية." }));
    if (!products.length) return setState((current) => ({ ...current, error: "لا توجد أصناف ذات رصيد دفتري في تاريخ الجرد." }));
    setState((current) => ({ ...current, saving: true, error: "" }));
    try {
      const items = products.map((item) => ({
        product: productIdOf(item),
        expectedQuantity: fixedQuantity(item.expectedQuantity),
        countedQuantity: Math.max(fixedQuantity(counted[productIdOf(item)] ?? item.countedQuantity ?? item.expectedQuantity), 0),
        notes: item.notes || "",
      }));
      const response = editingCount
        ? await updateStockCount(editingCount._id, { items })
        : await createStockCount({
          countNumber: `COUNT-${Date.now()}`,
          countMode,
          warehouse: countForm.warehouse,
          fromDate: countMode === "now" ? localDate() : countForm.fromDate,
          toDate: countMode === "now" ? localDate() : localEndOfDayIso(countForm.toDate),
          items,
        });
      const saved = responseObject(response)?.data ?? responseObject(response);
      setLastCount(saved);
      setCountMode("");
      setEditingCount(null);
      setProducts([]);
      setCounted({});
      await load();
      setNotice({ type: "success", text: editingCount ? "تم تعديل مسودة الجرد. راجعي العجز ثم اعتمديها لتسوية المخزون." : "تم حفظ مسودة الجرد. راجعي العجز ثم اعتمديها لتسوية المخزون." });
      printCount(saved);
    } catch (error) {
      setState((current) => ({ ...current, error: apiErrorMessage(error) }));
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  const approveCount = async (count) => {
    const summary = itemSummary(count.items);
    const message = `سيتم اعتماد الجرد وتحديث رصيد المخزون. العجز: ${displayQuantity(summary.shortage)} وحدة في ${summary.shortageItems} صنف. لا يمكن تعديل الجرد بعد الاعتماد. هل تريدين المتابعة؟`;
    if (!await confirm(message, "تأكيد اعتماد الجرد")) return;
    setState((current) => ({ ...current, saving: true, error: "" }));
    try {
      await approveStockCount(count._id);
      await load();
      setNotice({ type: "success", text: `تم اعتماد الجرد وتسوية الرصيد. سُجل العجز ${displayQuantity(summary.shortage)} وحدة كحركة فقد.` });
    } catch (error) {
      setState((current) => ({ ...current, error: apiErrorMessage(error) }));
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  const totalUnits = warehouses.reduce((sum, entry) => sum + number(entry.units), 0);
  const stockAlertRows = (alerts.lowStock || []).filter((item) => (number(item.units) <= 0) === (stockAlertFilter === "out"));
  const outOfStockCount = (alerts.lowStock || []).filter((item) => number(item.units) <= 0).length;
  const runningLowCount = (alerts.lowStock || []).filter((item) => number(item.units) > 0).length;
  const shop = warehouses[0]?.warehouse || warehouses[0];
  const currentSummary = itemSummary(products.map((item) => ({ ...item, countedQuantity: counted[productIdOf(item)] ?? item.countedQuantity ?? item.expectedQuantity })));

  return <div className="page-container !pt-7">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><span className="eyebrow">إدارة المخزون</span><h2 className="!m-0 !text-[25px]">المخزون والجرد</h2><p className="mt-2 text-xs text-slate-500">الموقع الوحيد: المحل{shop?.name ? ` (${shop.name})` : ""} — الرصيد الدفتري يشمل الرصيد الافتتاحي والحركات المسجلة.</p></div>
      <div className="flex flex-wrap gap-2">
        <button onClick={load} disabled={state.loading} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white" title="تحديث"><RefreshCw size={16} /></button>
        <button onClick={() => openNewCount("now")} disabled={state.loading} className="inline-flex items-center gap-2 rounded-xl bg-[#df2431] px-4 py-3 text-xs font-bold text-white"><ClipboardCheck size={16} /> جرد حالًا</button>
        <button onClick={() => openNewCount("period")} disabled={state.loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700"><CalendarDays size={16} /> جرد لفترة</button>
        {lastCount && <button onClick={() => printCount(lastCount)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700"><Printer size={16} /> طباعة آخر جرد</button>}
      </div>
    </div>

    {state.error && <div className="page-error mb-5">{state.error}</div>}
    {notice && <div className={`mb-5 rounded-xl border p-4 text-xs ${notice.type === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}>{notice.text}</div>}
    {state.loading && <div className="mb-5 rounded-xl bg-white p-6 text-center text-sm text-slate-500">جارٍ تحميل بيانات المخزون والجرد…</div>}

    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      <Metric label="موقع المخزون" value={shop ? 1 : 0} suffix="المحل" />
      <Metric label="إجمالي الوحدات المتاحة" value={totalUnits} suffix="وحدة" />
      <Metric label={stockAlertFilter === "out" ? "أصناف نفد مخزونها" : "أصناف قاربت على النفاد"} value={stockAlertFilter === "out" ? outOfStockCount : runningLowCount} suffix="صنف" />
    </div>

    <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h2 className="!m-0 !text-[17px]">متابعة حالة المخزون</h2><p className="mt-1 text-xs text-slate-500">اختاري حالة واحدة لعرضها. يُقارن الرصيد الفعلي، بما فيه الافتتاحي، بحد إعادة الطلب المحدد لكل صنف.</p></div><div className="flex rounded-xl bg-slate-50 p-1"><button type="button" onClick={() => setStockAlertFilter("out")} className={`rounded-lg px-4 py-2 text-[11px] ${stockAlertFilter === "out" ? "bg-white font-bold text-[#df2431] shadow-sm" : "text-slate-500"}`}>نفد المخزون ({outOfStockCount})</button><button type="button" onClick={() => setStockAlertFilter("low")} className={`rounded-lg px-4 py-2 text-[11px] ${stockAlertFilter === "low" ? "bg-white font-bold text-[#df2431] shadow-sm" : "text-slate-500"}`}>قارب على النفاد ({runningLowCount})</button></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead><tr><th>المنتج</th><th>الرصيد الحالي</th><th>حد إعادة الطلب</th><th>الحالة</th></tr></thead><tbody>
        {stockAlertRows.map((item, index) => <tr key={`${item.name}-${item.sku || item.serialNumbers?.[0] || index}`}><td className="font-semibold">{item.name}{item.sku && <div className="text-[11px] font-normal text-slate-500">SKU: {item.sku}</div>}</td><td className="font-bold text-red-600">{displayQuantity(item.units)}</td><td>{displayQuantity(item.reorderLevel)}</td><td><span className="status-pill status-due">{stockAlertFilter === "out" ? "نفد المخزون" : "قارب على النفاد"}</span></td></tr>)}
      </tbody></table>{!stockAlertRows.length && <div className="p-12 text-center text-xs text-slate-400">لا توجد أصناف ضمن الحالة المختارة.</div>}</div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5"><h2 className="!m-0 !text-[17px]">سجل الجرد والعجز</h2><p className="mt-1 text-xs text-slate-500">يمكن تعديل المسودات فقط. اعتماد الجرد يرحّل فرق الكمية مرة واحدة؛ الجرد المعتمد يُحفظ كسجل تدقيق غير قابل للتعديل.</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px]"><thead><tr><th>رقم الجرد</th><th>النوع / التاريخ</th><th>الحالة</th><th>الأصناف</th><th>العجز</th><th>الزيادة</th><th>إجراءات</th></tr></thead><tbody>
        {counts.map((count) => {
          const summary = itemSummary(count.items);
          const period = count.countMode === "period" || (count.fromDate && count.toDate && dateInputValue(count.fromDate) !== dateInputValue(count.toDate));
          const stateLabel = count.status === "approved" ? "معتمد ومُسوّى" : count.status === "cancelled" ? "ملغي" : "مسودة";
          return <tr key={count._id}>
            <td className="font-semibold">{count.countNumber || "—"}</td>
            <td>{period ? "لفترة" : "حالي"}<div className="text-[11px] text-slate-500">{period ? `${formatDate(count.fromDate)} – ${formatDate(count.toDate)}` : formatDate(count.date || count.toDate)}</div></td>
            <td><span className={`status-pill ${count.status === "approved" ? "status-paid" : count.status === "cancelled" ? "status-due" : ""}`}>{stateLabel}</span></td>
            <td>{count.items?.length || 0}</td>
            <td className={summary.shortage > 0 ? "font-bold text-red-600" : ""}>{displayQuantity(summary.shortage)} وحدة{summary.shortageItems ? ` (${summary.shortageItems} صنف)` : ""}</td>
            <td>{displayQuantity(summary.surplus)} وحدة</td>
            <td><div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => printCount(count)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs"><Printer size={14} /> طباعة</button>
              {count.status === "draft" && <>
                <button type="button" onClick={() => openEditCount(count)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800"><Pencil size={14} /> تعديل</button>
                <button type="button" onClick={() => approveCount(count)} disabled={state.saving} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-800"><Check size={14} /> اعتماد وتسوية</button>
              </>}
            </div></td>
          </tr>;
        })}
      </tbody></table>{!counts.length && !state.loading && <div className="p-10 text-center text-xs text-slate-400">لا توجد عمليات جرد محفوظة حتى الآن.</div>}</div>
    </section>

    {dialog}
    {countMode && <div className="modal-backdrop" onMouseDown={() => { previewSequence.current += 1; setCountMode(""); }}>
      <form className="invoice-modal max-w-5xl" onSubmit={saveCount} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header"><div><span className="eyebrow">جرد المخزون</span><h2>{editingCount ? "تعديل مسودة الجرد" : countMode === "now" ? "جرد حالًا" : "جرد لفترة"}</h2><p className="mt-1 text-xs text-slate-500">الرصيد المتوقع محسوب من الرصيد الافتتاحي والحركات المسجلة حتى تاريخ الجرد؛ لا تغيّريه يدويًا.</p></div><button type="button" className="close-button" onClick={() => { previewSequence.current += 1; setCountMode(""); }}>×</button></div>
        {countMode === "period" && <div className="form-grid mt-5"><div className="form-field"><label>من تاريخ</label><input required type="date" max={localDate()} disabled={Boolean(editingCount)} value={countForm.fromDate} onChange={(event) => setCountForm({ ...countForm, fromDate: event.target.value })} /></div><div className="form-field"><label>إلى تاريخ (رصيد نهاية اليوم)</label><input required type="date" max={localDate()} disabled={Boolean(editingCount)} value={countForm.toDate} onChange={(event) => changePeriodEnd(event.target.value)} /></div></div>}
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <SummaryMetric label="الرصيد المتوقع" value={`${displayQuantity(currentSummary.expected)} وحدة`} />
          <SummaryMetric label="المعدود فعليًا" value={`${displayQuantity(currentSummary.counted)} وحدة`} />
          <SummaryMetric label={`العجز (${currentSummary.shortageItems} صنف)`} value={`${displayQuantity(currentSummary.shortage)} وحدة`} danger={currentSummary.shortage > 0} />
          <SummaryMetric label="الزيادة" value={`${displayQuantity(currentSummary.surplus)} وحدة`} />
        </div>
        {countLoading ? <div className="mt-5 rounded-xl border border-slate-100 p-8 text-center text-sm text-slate-500">جارٍ حساب الرصيد الافتتاحي والحركات حتى التاريخ المحدد…</div> : <div className="mt-5 max-h-[42vh] overflow-auto rounded-xl border border-slate-200"><table className="w-full min-w-[760px]"><thead><tr><th>الصنف</th><th>السيريال</th><th>الرصيد الدفتري</th><th>المعدود فعليًا</th><th>العجز</th><th>الزيادة</th></tr></thead><tbody>
          {products.map((item) => {
            const product = item.product || {};
            const productId = productIdOf(item);
            const expected = fixedQuantity(item.expectedQuantity);
            const actual = Math.max(fixedQuantity(counted[productId] ?? item.countedQuantity ?? expected), 0);
            const shortage = Math.max(fixedQuantity(expected - actual), 0);
            const surplus = Math.max(fixedQuantity(actual - expected), 0);
            return <tr key={productId}><td className="font-semibold">{product.name || "صنف غير متاح"}</td><td>{product.serialNumber || item.serialNumber || "—"}</td><td>{displayQuantity(expected)}</td><td><input aria-label={`الكمية المعدودة ${product.name || ""}`} type="number" min="0" max={product.isSerialized ? "1" : undefined} step={product.isSerialized ? "1" : "0.001"} value={counted[productId] ?? "0"} onChange={(event) => setCounted((current) => ({ ...current, [productId]: event.target.value }))} className="w-32 rounded-lg border border-slate-200 px-2 py-1" /></td><td className={shortage ? "font-bold text-red-600" : ""}>{shortage ? <span className="inline-flex items-center gap-1"><AlertTriangle size={13} />{displayQuantity(shortage)}</span> : "—"}</td><td>{surplus || "—"}</td></tr>;
          })}
        </tbody></table>{!products.length && !countLoading && <div className="p-8 text-center text-xs text-slate-500">لا توجد أصناف ذات رصيد دفتري في تاريخ الجرد.</div>}</div>}
        <div className="modal-actions"><button className="primary-button" disabled={state.saving || countLoading || !products.length}>{state.saving ? "جارٍ الحفظ…" : editingCount ? "حفظ التعديلات" : "حفظ كمسودة"}</button><button type="button" className="secondary-button" onClick={() => { previewSequence.current += 1; setCountMode(""); }}>إلغاء</button></div>
      </form>
    </div>}
  </div>;
}

function Metric({ label, value, suffix }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-xs text-slate-500">{label}</span><strong className="mt-3 block text-2xl text-slate-800">{formatMoney(value)} <small className="text-xs font-normal text-slate-400">{suffix}</small></strong></div>;
}
function SummaryMetric({ label, value, danger = false }) {
  return <div className={`rounded-xl border p-3 ${danger ? "border-red-200 bg-red-50" : "border-slate-100 bg-slate-50"}`}><span className="block text-[11px] text-slate-500">{label}</span><strong className={`mt-1 block text-sm ${danger ? "text-red-700" : "text-slate-800"}`}>{value}</strong></div>;
}
