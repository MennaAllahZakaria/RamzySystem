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
import QuotesPage from "./pages/QuotesPage";
import TeamPage from "./pages/TeamPage";
import ExpensesPage from "./pages/ExpensesPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import { getMe, logout } from "./api/auth";
import { getAuthToken } from "./api/client";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState({ loading: Boolean(getAuthToken()), error: "" });
  const [activePage, setActivePage] = useState("لوحة التحكم");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("sale");
  useEffect(() => {
    if (!getAuthToken()) return;
    getMe().then((result) => { setUser(result?.data || result?.user || result); setAuthState({ loading: false, error: "" }); }).catch(() => { logout(); setUser(null); setAuthState({ loading: false, error: "" }); });
  }, []);
  if (authState.loading) return <div className="grid min-h-screen place-items-center bg-[#f7f9fa] text-sm text-slate-500">جارٍ التحقق من الجلسة...</div>;
  if (!user) return <LoginPage onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); setAuthState({ loading: false, error: "" }); }} />;
  const openInvoice = (type = "sale") => { setModalType(type); setModalOpen(true); };
  const content = activePage === "لوحة التحكم" ? <DashboardPage onCreateInvoice={() => openInvoice("sale")} onCreateInternalInvoice={() => openInvoice("internal")} onCreateExpense={() => setActivePage("المصروفات")} /> : activePage === "الفواتير" ? <InvoicesPage /> : activePage === "المخازن" ? <WarehousesPage /> : activePage === "العملاء والموردون" ? <PartiesPage /> : activePage === "المنتجات والمخزون" ? <ProductsPage /> : activePage === "المشتريات" ? <PurchasesPage onCreateInvoice={openInvoice} /> : activePage === "عروض الأسعار" ? <QuotesPage /> : activePage === "الموظفون والعمال" ? <TeamPage /> : activePage === "المصروفات" ? <ExpensesPage /> : activePage === "التدفقات النقدية" ? <CashFlowPage /> : activePage === "الرواتب والمسحوبات" ? <PayrollPage /> : activePage === "التقارير المالية" ? <ReportsPage /> : activePage === "المستخدمون" ? <UsersPage /> : <SettingsPage />;
  const handleLogout = () => { logout(); setUser(null); setModalOpen(false); setActivePage("لوحة التحكم"); };
  return <AppShell activePage={activePage} onSelect={setActivePage} user={user} onLogout={handleLogout}>{content}{modalOpen && <InvoiceModal initialType={modalType} onClose={() => setModalOpen(false)} />}</AppShell>;
}
