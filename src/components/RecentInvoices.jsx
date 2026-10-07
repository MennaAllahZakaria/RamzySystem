import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { recentInvoices } from "../data/dashboardData";

const statusClass = { مدفوعة: "status-paid", آجلة: "status-due", جزئية: "status-partial" };

export default function RecentInvoices() {
  return <section className="panel invoices-panel"><div className="panel-heading"><div><span className="eyebrow">آخر الحركات</span><h2>الفواتير الأخيرة</h2></div><button className="text-link">عرض كل الفواتير <ArrowLeft size={15} /></button></div><div className="table-wrap"><table><thead><tr><th>رقم الفاتورة</th><th>الطرف</th><th>النوع</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th><th /></tr></thead><tbody>{recentInvoices.map((invoice) => <tr key={invoice.number}><td><strong className="invoice-number">{invoice.number}</strong></td><td>{invoice.party}</td><td><span className="type-chip">{invoice.type}</span></td><td><strong>{invoice.amount}</strong> <small>ج.م</small></td><td><span className={`status-pill ${statusClass[invoice.status]}`}>{invoice.status}</span></td><td className="muted-cell">{invoice.date}</td><td><button className="row-menu" aria-label="خيارات الفاتورة"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div></section>;
}
