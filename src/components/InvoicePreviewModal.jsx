import { CalendarDays, CreditCard, Package2, UserRound, X } from "lucide-react";
import { formatDate, formatMoney, numberValue } from "../utils/pageHelpers";

const typeLabel = { sale: "فاتورة بيع", maintenance: "فاتورة صيانة", purchase: "فاتورة توريد", internal: "فاتورة للمكتب" };
const statusLabel = { paid: "مدفوعة", partially_paid: "مدفوعة جزئيًا", credit: "آجلة", overdue: "متأخرة", draft: "مسودة", issued: "صادرة" };

export default function InvoicePreviewModal({ invoice, onClose, showCreator = false }) {
  if (!invoice) return null;
  const items = invoice.items || [];
  const total = numberValue(invoice.total);
  const paid = numberValue(invoice.paidAmount);
  const remaining = Math.max(total - paid, 0);
  const partyName = invoice.party?.name || invoice.partyName || (invoice.invoiceType === "internal" ? "المكتب" : "بدون طرف محدد");

  return <div className="modal-backdrop invoice-preview-backdrop" onMouseDown={onClose}>
    <section className="invoice-preview-modal" role="dialog" aria-modal="true" aria-label={`معاينة الفاتورة ${invoice.invoiceNumber || ""}`} onMouseDown={(event) => event.stopPropagation()}>
      <header className="invoice-preview-header">
        <div>
          <span className="eyebrow">معاينة قراءة فقط</span>
          <h2>{typeLabel[invoice.invoiceType] || "الفاتورة"}</h2>
          <strong className="invoice-preview-number">{invoice.invoiceNumber || "—"}</strong>
        </div>
        <button type="button" className="close-button" onClick={onClose} aria-label="إغلاق المعاينة"><X size={18} /></button>
      </header>

      <div className="invoice-preview-meta">
        <div><UserRound size={16} /><span>الطرف</span><strong>{partyName}</strong></div>
        <div><CalendarDays size={16} /><span>التاريخ</span><strong>{formatDate(invoice.issueDate || invoice.date)}</strong></div>
        <div><CreditCard size={16} /><span>الحالة</span><strong>{statusLabel[invoice.paymentStatus] || statusLabel[invoice.status] || "—"}</strong></div>
      </div>
      {showCreator && <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">أنشأها: <strong className="text-slate-800">{invoice.createdByName || invoice.createdBy?.name || invoice.createdBy?.username || "غير محدد"}</strong></div>}

      <div className="invoice-preview-table-wrap">
        <table className="invoice-preview-table">
          <thead><tr><th>#</th><th>الصنف / البيان</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
          <tbody>{items.length ? items.map((item, index) => {
            const quantity = numberValue(item.quantity ?? item.qty) || 1;
            const unitPrice = numberValue(item.unitPrice ?? item.price);
            const lineTotal = numberValue(item.total ?? item.lineTotal) || quantity * unitPrice;
            const itemName = item.description || item.product?.name || item.productName || item.name || item.product?.description || "صنف";
            return <tr key={`${item.product?._id || item.productId || index}`}><td>{index + 1}</td><td><strong>{itemName}</strong>{item.itemType === "labor" && <small>مصنعية</small>}</td><td>{formatMoney(quantity)}</td><td>{formatMoney(unitPrice)} ج.م</td><td className="font-bold">{formatMoney(lineTotal)} ج.م</td></tr>;
          }) : <tr><td colSpan="5" className="invoice-preview-empty"><Package2 size={22} />لا توجد تفاصيل أصناف متاحة للمعاينة</td></tr>}</tbody>
        </table>
      </div>

      <div className="invoice-preview-totals">
        <div><span>الإجمالي</span><strong>{formatMoney(total)} ج.م</strong></div>
        <div><span>المدفوع</span><strong className="paid">{formatMoney(paid)} ج.م</strong></div>
        <div className="remaining"><span>المتبقي</span><strong>{formatMoney(remaining)} ج.م</strong></div>
      </div>
      {invoice.notes && <div className="invoice-preview-notes"><strong>ملاحظات</strong><span>{invoice.notes}</span></div>}
      <footer className="invoice-preview-footer"><span>هذه معاينة فقط ولا تسمح بتعديل الفاتورة.</span><button type="button" className="secondary-button" onClick={onClose}>إغلاق</button></footer>
    </section>
  </div>;
}
