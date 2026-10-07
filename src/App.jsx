import { useEffect, useState } from "react";
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
import LoginPage from "./pages/LoginPage";
import { getMe, logout } from "./api/auth";
import { getAuthToken } from "./api/client";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState({ loading: Boolean(getAuthToken()), error: "" });
  const [activePage, setActivePage] = useState("لوحة التحكم");
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (!getAuthToken()) return;
    getMe().then((result) => { setUser(result?.data || result?.user || result); setAuthState({ loading: false, error: "" }); }).catch(() => { logout(); setUser(null); setAuthState({ loading: false, error: "" }); });
  }, []);
  if (authState.loading) return <div className="grid min-h-screen place-items-center bg-[#f7f9fa] text-sm text-slate-500">جارٍ التحقق من الجلسة...</div>;
  if (!user) return <LoginPage onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); setAuthState({ loading: false, error: "" }); }} />;
  const content = activePage === "لوحة التحكم" ? <DashboardPage onCreateInvoice={() => setModalOpen(true)} /> : activePage === "الفواتير" ? <InvoicesPage /> : activePage === "المخازن" ? <WarehousesPage /> : activePage === "العملاء والموردون" ? <PartiesPage /> : activePage === "المنتجات والمخزون" ? <ProductsPage /> : activePage === "المشتريات" ? <PurchasesPage /> : activePage === "التدفقات النقدية" ? <CashFlowPage /> : activePage === "الرواتب والمسحوبات" ? <PayrollPage /> : activePage === "التقارير المالية" ? <ReportsPage /> : <SettingsPage />;
  const handleLogout = () => { logout(); setUser(null); setModalOpen(false); setActivePage("لوحة التحكم"); };
  return <AppShell activePage={activePage} onSelect={setActivePage} user={user} onLogout={handleLogout}>{content}{modalOpen && <InvoiceModal onClose={() => setModalOpen(false)} />}</AppShell>;
}
