import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
import { getProductHistory } from "../api/products";
import { apiErrorMessage, formatDate, formatMoney, numberValue } from "../utils/pageHelpers";

const typeLabels = { purchase: "توريد / شراء", sale: "بيع", maintenance: "صيانة" };

export default function ProductHistoryModal({ product, onClose }) {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProductHistory(product._id)
      .then((response) => {
        if (active) setHistory(response?.data?.data || response?.data);
      })
      .catch((requestError) => {
        if (active) setError(apiErrorMessage(requestError));
      });
    return () => { active = false; };
  }, [product._id]);

  const details = history?.product || product;
  const entries = history?.entries || [];

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="invoice-modal max-w-5xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">متابعة الصنف</span>
            <h2>{details.name}</h2>
            <p className="mt-1 text-xs text-slate-500">الكود: {details.serialNumber || "—"} · سعر الشراء الحالي: {formatMoney(numberValue(details.purchasePrice))} ج.م</p>
          </div>
          <button type="button" className="close-button" onClick={onClose} aria-label="إغلاق"><X size={18} /></button>
        </div>

        {error ? <div className="page-error mt-4">{error}</div> : !history ? (
          <div className="p-10 text-center text-sm text-slate-400">جارٍ تحميل سجل الصنف...</div>
        ) : entries.length ? (
          <div className="mt-4 max-h-[65vh] overflow-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[800px]">
              <thead><tr><th>التاريخ</th><th>الحركة</th><th>رقم الفاتورة</th><th>{"المورد / العميل"}</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th><th>الحالة</th></tr></thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={`${entry.invoiceId}-${index}`}>
                    <td>{formatDate(entry.date)}</td>
                    <td className="font-semibold">{typeLabels[entry.invoiceType] || entry.invoiceType}</td>
                    <td>{entry.invoiceNumber || "—"}</td>
                    <td>{entry.party?.name || "—"}</td>
                    <td>{numberValue(entry.quantity)}</td>
                    <td>{formatMoney(numberValue(entry.unitPrice))} ج.م</td>
                    <td className="font-bold">{formatMoney(numberValue(entry.total))} ج.م</td>
                    <td><span className={`status-pill ${entry.status === "issued" ? "status-paid" : "status-due"}`}>{entry.status === "issued" ? "معتمدة" : "ملغاة"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
            <History size={20} className="mx-auto mb-2" />لا توجد فواتير توريد أو بيع مسجلة لهذا الصنف بعد.
          </div>
        )}
      </div>
    </div>
  );
}
