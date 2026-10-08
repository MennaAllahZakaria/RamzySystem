import {
  BarChart3,
  Boxes,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  FileText,
  ReceiptText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Truck,
  UsersRound,
  UserCog,
  WalletCards,
} from "lucide-react";

const navigation = [
  { label: "لوحة التحكم", icon: LayoutDashboard, active: true },
  { label: "الفواتير", icon: FileText },
  { label: "العملاء والموردون", icon: UsersRound },
  { label: "المنتجات والمخزون", icon: Boxes },
  { label: "المشتريات", icon: ShoppingCart },
  { label: "المخازن", icon: Truck },
  { label: "عروض الأسعار", icon: ClipboardList },
  { label: "المصروفات", icon: ReceiptText },
];

const financeNavigation = [
  { label: "التدفقات النقدية", icon: WalletCards },
  { label: "الرواتب والمسحوبات", icon: CircleDollarSign },
  { label: "الموظفون والعمال", icon: UserCog },
  { label: "التقارير المالية", icon: BarChart3 },
  { label: "المستخدمون", icon: UserCog },
];

function NavItem({ item, onSelect }) {
  const Icon = item.icon;
  return (
    <button type="button" className={`nav-item ${item.active ? "nav-item-active" : ""}`} onClick={() => onSelect(item.label)}>
      <Icon size={19} strokeWidth={item.active ? 2.3 : 1.9} />
      <span>{item.label}</span>
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </button>
  );
}

export default function Sidebar({ activePage, onSelect, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark"><img src="/assets/ramzy-logo.jpg" alt="شعار محمد رمزي" /></div>
        <div className="brand-copy">
          <strong>رمزي سيستم</strong>
          <span>نظامك المحاسبي بوضوح</span>
        </div>
      </div>

      <div className="workspace-switcher">
        <div className="workspace-avatar">م</div>
        <div><strong>شركة رمزي</strong><span>الفرع الرئيسي</span></div>
        <ChevronDown size={16} />
      </div>

      <nav className="sidebar-nav" aria-label="التنقل الرئيسي">
        <p className="nav-label">الرئيسية</p>
        {navigation.map((item) => <NavItem key={item.label} item={{ ...item, active: activePage === item.label }} onSelect={onSelect} />)}
        <p className="nav-label nav-label-spaced">الإدارة المالية</p>
        {financeNavigation.map((item) => <NavItem key={item.label} item={{ ...item, active: activePage === item.label }} onSelect={onSelect} />)}
      </nav>

      <div className="sidebar-bottom">
        <button type="button" className={`nav-item ${activePage === "الإعدادات" ? "nav-item-active" : ""}`} onClick={() => onSelect("الإعدادات")}>
          <Settings size={19} /><span>الإعدادات</span>
        </button>
        <div className="help-card">
          <div className="help-icon"><ClipboardList size={18} /></div>
          <div><strong>محتاج مساعدة؟</strong><span>مركز الدعم متاح لك</span></div>
          <button aria-label="فتح مركز الدعم">←</button>
        </div>
        <div className="user-mini">
          <div className="user-avatar">{user?.name?.charAt(0) || "م"}</div>
          <div><strong>{user?.name || "المستخدم"}</strong><span>{user?.role || "مستخدم النظام"}</span></div>
          <span className="online-dot" />
        </div>
        <button type="button" className="nav-item mt-3 !text-slate-400 hover:!text-[#df2431]" onClick={onLogout}><LogOut size={18} /><span>تسجيل الخروج</span></button>
      </div>
    </aside>
  );
}
