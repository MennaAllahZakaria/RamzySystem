import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import { getMe, logout } from "./api/auth";
import { getAuthToken } from "./api/client";
import "./App.css";

const InvoiceModal = lazy(() => import("./components/InvoiceModal"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InvoicesPage = lazy(() => import("./pages/InvoicesPage"));
const WarehousesPage = lazy(() => import("./pages/WarehousesPage"));
const PartiesPage = lazy(() => import("./pages/PartiesPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const PurchasesPage = lazy(() => import("./pages/PurchasesPage"));
const CashFlowPage = lazy(() => import("./pages/CashFlowPage"));
const PayrollPage = lazy(() => import("./pages/PayrollPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const QuotesPage = lazy(() => import("./pages/QuotesPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function PageLoading() {
  return <div className="grid min-h-[40vh] place-items-center text-sm text-slate-500">جارٍ تحميل الصفحة...</div>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState({ loading: Boolean(getAuthToken()), error: "" });
  const [activePage, setActivePage] = useState("لوحة التحكم");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("sale");
  const verifySession = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const result = await getMe();
      setUser(result?.data || result?.user || result);
      setAuthState({ loading: false, error: "" });
    } catch (error) {
      if ([401, 403].includes(error?.status)) {
        logout();
        setUser(null);
        setAuthState({ loading: false, error: "" });
      } else {
        setAuthState({ loading: false, error: error?.message || "تعذر التحقق من الاتصال بالخادم." });
      }
    }
  }, []);
  useEffect(() => {
    if (!getAuthToken()) return undefined;
    const timer = setTimeout(verifySession, 0);
    return () => clearTimeout(timer);
  }, [verifySession]);
  const retrySession = () => { setAuthState({ loading: true, error: "" }); verifySession(); };
  if (authState.loading) return <div className="grid min-h-screen place-items-center bg-[#f7f9fa] text-sm text-slate-500">جارٍ التحقق من الجلسة...</div>;
  if (authState.error) return <main className="grid min-h-screen place-items-center bg-[#f7f9fa] p-6"><section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm"><h1 className="text-lg font-bold text-slate-800">تعذر الاتصال مؤقتًا</h1><p className="mt-3 text-sm leading-6 text-slate-600">{authState.error}</p><button type="button" onClick={retrySession} className="mt-5 rounded-xl bg-[#1d282e] px-5 py-3 text-sm font-bold text-white">إعادة المحاولة</button><button type="button" onClick={() => { logout(); setAuthState({ loading: false, error: "" }); }} className="mr-2 mt-5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">تسجيل الخروج</button></section></main>;
  if (!user) return <Suspense fallback={<PageLoading />}><LoginPage onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); setAuthState({ loading: false, error: "" }); }} /></Suspense>;
  const openInvoice = (type = "sale") => { setModalType(type); setModalOpen(true); };
  const content = activePage === "لوحة التحكم" ? <DashboardPage onCreateInvoice={() => openInvoice("sale")} onCreateInternalInvoice={() => openInvoice("internal")} onCreateExpense={() => setActivePage("المصروفات")} onNavigate={setActivePage} /> : activePage === "الفواتير" ? <InvoicesPage /> : activePage === "المخازن" ? <WarehousesPage /> : activePage === "العملاء والموردون" ? <PartiesPage /> : activePage === "المنتجات والمخزون" ? <ProductsPage /> : activePage === "المشتريات" ? <PurchasesPage onCreateInvoice={openInvoice} /> : activePage === "عروض الأسعار" ? <QuotesPage /> : activePage === "الموظفون والعمال" ? <TeamPage /> : activePage === "المصروفات" ? <ExpensesPage /> : activePage === "التدفقات النقدية" ? <CashFlowPage /> : activePage === "الرواتب والمسحوبات" ? <PayrollPage /> : activePage === "التقارير المالية" ? <ReportsPage /> : activePage === "المستخدمون" ? <UsersPage /> : <SettingsPage />;
  const handleLogout = () => { logout(); setUser(null); setModalOpen(false); setActivePage("لوحة التحكم"); };
  return <AppShell activePage={activePage} onSelect={setActivePage} user={user} onLogout={handleLogout}><Suspense fallback={<PageLoading />}>{content}{modalOpen && <InvoiceModal initialType={modalType} onClose={() => setModalOpen(false)} />}</Suspense></AppShell>;
}
