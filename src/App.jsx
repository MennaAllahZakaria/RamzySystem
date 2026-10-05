import { useState } from "react";
import { ArrowLeft, BellRing, Check, FilePlus2, X } from "lucide-react";
import AppShell from "./components/AppShell";
import StatCard from "./components/StatCard";
import CashFlowChart from "./components/CashFlowChart";
import RecentInvoices from "./components/RecentInvoices";
import AlertsPanel from "./components/AlertsPanel";
import { dashboardStats } from "./data/dashboardData";
import "./App.css";

function InvoiceModal({ onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="invoice-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">إجراء سريع</span><h2>إنشاء فاتورة جديدة</h2></div><button className="close-button" onClick={onClose} aria-label="إغلاق"><X size={19} /></button></div><div className="invoice-choice-grid"><button><span className="choice-icon choice-sale"><FilePlus2 size={20} /></span><strong>فاتورة بيع</strong><small>للعملاء والمبيعات</small><ArrowLeft size={16} /></button><button><span className="choice-icon choice-purchase"><FilePlus2 size={20} /></span><strong>فاتورة شراء</strong><small>للموردين والمشتريات</small><ArrowLeft size={16} /></button></div><div className="modal-note"><BellRing size={16} /><span>يمكنك إضافة دفعة، خصم أو أكثر من منتج داخل الفاتورة.</span></div></div></div>;
}

function DashboardPage({ onCreateInvoice }) {
  return <div className="page-container"><section className="welcome-strip"><div><span className="eyebrow">ملخص اليوم</span><h2>كل أرقامك المهمة في مكان واحد</h2><p>تابع حركة شركتك واتخذ قراراتك بثقة ووضوح.</p></div><div className="welcome-meta"><span className="live-dot" /> البيانات محدثة الآن <button>تحديث <ArrowLeft size={14} /></button></div></section><section className="stats-grid">{dashboardStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</section><section className="main-grid"><CashFlowChart /><AlertsPanel onCreateInvoice={onCreateInvoice} /></section><RecentInvoices /><section className="bottom-note"><div className="note-icon"><Check size={17} /></div><div><strong>أنت على اطلاع كامل</strong><span>تمت مراجعة جميع العمليات المالية حتى نهاية أمس.</span></div><button>فتح سجل المراجعة <ArrowLeft size={15} /></button></section></div>;
}

function PlaceholderPage({ title }) {
  return <div className="page-container placeholder-page"><div className="placeholder-icon"><FilePlus2 size={26} /></div><span className="eyebrow">قريباً في النظام</span><h2>{title}</h2><p>هذه الشاشة جاهزة للربط مع خدمات الباك إند وإدارة البيانات الفعلية.</p></div>;
}

export default function App() {
  const [activePage, setActivePage] = useState("لوحة التحكم");
  const [modalOpen, setModalOpen] = useState(false);
  const content = activePage === "لوحة التحكم" ? <DashboardPage onCreateInvoice={() => setModalOpen(true)} /> : <PlaceholderPage title={activePage} />;
  return <AppShell activePage={activePage} onSelect={setActivePage}>{content}{modalOpen && <InvoiceModal onClose={() => setModalOpen(false)} />}</AppShell>;
}
