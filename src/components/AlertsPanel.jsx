import { AlertCircle, ArrowLeft, Boxes, CalendarClock, Plus, ReceiptText } from "lucide-react";
import { alerts } from "../data/dashboardData";

const icons = { red: AlertCircle, amber: Boxes, blue: CalendarClock };

export default function AlertsPanel({ onCreateInvoice }) {
  return <aside className="alerts-column"><section className="panel alerts-panel"><div className="panel-heading"><div><span className="eyebrow">يحتاج انتباهك</span><h2>التنبيهات</h2></div><span className="alert-count">٣</span></div><div className="alerts-list">{alerts.map((alert) => { const Icon = icons[alert.tone]; return <div className="alert-item" key={alert.title}><div className={`alert-icon alert-${alert.tone}`}><Icon size={18} /></div><div className="alert-copy"><strong>{alert.title}</strong><span>{alert.detail}</span><button>{alert.amount} <ArrowLeft size={13} /></button></div></div>; })}</div><button className="view-all-link">عرض كل التنبيهات <ArrowLeft size={15} /></button></section><section className="quick-actions"><div><span className="eyebrow">اختصارات سريعة</span><h2>إنجاز أسرع</h2></div><button onClick={onCreateInvoice}><span><Plus size={18} /></span><strong>فاتورة جديدة</strong><small>بيع أو شراء</small></button><button><span><ReceiptText size={18} /></span><strong>تسجيل مصروف</strong><small>إضافة حركة مالية</small></button></section></aside>;
}
