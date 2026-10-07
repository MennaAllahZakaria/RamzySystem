import { ArrowLeft, Check } from "lucide-react";
import CashFlowChart from "../components/CashFlowChart";
import RecentInvoices from "../components/RecentInvoices";
import AlertsPanel from "../components/AlertsPanel";
import StatCard from "../components/StatCard";
import { dashboardStats } from "../data/dashboardData";

export default function DashboardPage({ onCreateInvoice }) {
  return (
    <div className="page-container">
      <section className="welcome-strip">
        <div><span className="eyebrow">ملخص اليوم</span><h2>كل أرقامك المهمة في مكان واحد</h2><p>تابع حركة شركتك واتخذ قراراتك بثقة ووضوح.</p></div>
        <div className="welcome-meta"><span className="live-dot" /> البيانات محدثة الآن <button>تحديث <ArrowLeft size={14} /></button></div>
      </section>
      <section className="stats-grid">{dashboardStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</section>
      <section className="main-grid"><CashFlowChart /><AlertsPanel onCreateInvoice={onCreateInvoice} /></section>
      <RecentInvoices />
      <section className="bottom-note"><div className="note-icon"><Check size={17} /></div><div><strong>أنت على اطلاع كامل</strong><span>تمت مراجعة جميع العمليات المالية حتى نهاية أمس.</span></div><button>فتح سجل المراجعة <ArrowLeft size={15} /></button></section>
    </div>
  );
}
