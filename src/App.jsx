import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import AppShell from "./components/AppShell";
import InvoiceModal from "./components/InvoiceModal";
import DashboardPage from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import WarehousesPage from "./pages/WarehousesPage";
import "./App.css";

function PlaceholderPage({ title }) {
  return <div className="page-container placeholder-page"><div className="placeholder-icon"><FilePlus2 size={26} /></div><span className="eyebrow">قريباً في النظام</span><h2>{title}</h2><p>هذه الشاشة جاهزة للربط مع خدمات الـ API وإدارة البيانات الفعلية.</p></div>;
}

export default function App() {
  const [activePage, setActivePage] = useState("لوحة التحكم");
  const [modalOpen, setModalOpen] = useState(false);
  const content = activePage === "لوحة التحكم" ? <DashboardPage onCreateInvoice={() => setModalOpen(true)} /> : activePage === "الفواتير" ? <InvoicesPage /> : activePage === "المخازن" ? <WarehousesPage /> : <PlaceholderPage title={activePage} />;
  return <AppShell activePage={activePage} onSelect={setActivePage}>{content}{modalOpen && <InvoiceModal onClose={() => setModalOpen(false)} />}</AppShell>;
}
