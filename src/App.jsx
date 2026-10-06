import { useState } from "react";
import AppShell from "./components/AppShell";
import InvoiceModal from "./components/InvoiceModal";
import DashboardPage from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import WarehousesPage from "./pages/WarehousesPage";
import PartiesPage from "./pages/PartiesPage";
import ProductsPage from "./pages/ProductsPage";
import PurchasesPage from "./pages/PurchasesPage";
import CashFlowPage from "./pages/CashFlowPage";
import PayrollPage from "./pages/PayrollPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("لوحة التحكم");
  const [modalOpen, setModalOpen] = useState(false);
  const content = activePage === "لوحة التحكم" ? <DashboardPage onCreateInvoice={() => setModalOpen(true)} /> : activePage === "الفواتير" ? <InvoicesPage /> : activePage === "المخازن" ? <WarehousesPage /> : activePage === "العملاء والموردون" ? <PartiesPage /> : activePage === "المنتجات والمخزون" ? <ProductsPage /> : activePage === "المشتريات" ? <PurchasesPage /> : activePage === "التدفقات النقدية" ? <CashFlowPage /> : activePage === "الرواتب والمسحوبات" ? <PayrollPage /> : activePage === "التقارير المالية" ? <ReportsPage /> : <SettingsPage />;
  return <AppShell activePage={activePage} onSelect={setActivePage}>{content}{modalOpen && <InvoiceModal onClose={() => setModalOpen(false)} />}</AppShell>;
}
