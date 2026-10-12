import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarDays, ChevronDown, Menu, Search, X } from "lucide-react";
import { getDueInvoiceAlerts } from "../api/alerts";

const pages = [
  { label: "لوحة التحكم", keywords: "الرئيسية dashboard" },
  { label: "الفواتير", keywords: "فواتير مبيعات توريد" },
  { label: "المخازن", keywords: "مخزون جرد مستودعات" },
  { label: "العملاء والموردون", keywords: "عملاء موردون أطراف" },
  { label: "المنتجات والمخزون", keywords: "منتجات أصناف مخزون" },
  { label: "المشتريات", keywords: "شراء توريد" },
  { label: "عروض الأسعار", keywords: "عروض أسعار" },
  { label: "الموظفون والعمال", keywords: "موظفين عمال" },
  { label: "المصروفات", keywords: "مصروفات نفقات" },
  { label: "التدفقات النقدية", keywords: "نقدية كاش تدفق" },
  { label: "الرواتب والمسحوبات", keywords: "رواتب مسحوبات" },
  { label: "التقارير المالية", keywords: "تقارير إيرادات مستحقات" },
  { label: "المستخدمون", keywords: "مستخدمين صلاحيات" },
  { label: "الإعدادات", keywords: "إعدادات" },
];

export default function Topbar({ onMenuClick, onSelect, user }) {
  const today = new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [period, setPeriod] = useState("هذا الشهر");
  const [alerts, setAlerts] = useState({ data: [], overdueCount: 0, dueSoonCount: 0 });
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? pages.filter((page) => `${page.label} ${page.keywords}`.toLowerCase().includes(value)).slice(0, 5) : [];
  }, [query]);

  useEffect(() => {
    getDueInvoiceAlerts({ daysAhead: 30 }).then((response) => setAlerts(response || {})).catch(() => setAlerts({ data: [], overdueCount: 0, dueSoonCount: 0 }));
  }, []);

  const navigateToMatch = (page) => {
    if (!page) return;
    onSelect?.(page.label);
    setQuery("");
  };
  const totalAlerts = Number(alerts.overdueCount || 0) + Number(alerts.dueSoonCount || 0);

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenuClick} aria-label="فتح القائمة"><Menu size={21} /></button>
      <div className="topbar-heading"><span>{today}</span><h1>صباح الخير، {user?.name || "بك"} <span className="wave">✦</span></h1></div>
      <div className="topbar-actions">
        <div className="relative">
          <label className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") navigateToMatch(matches[0]); }} placeholder="ابحث في النظام..." aria-label="البحث في النظام" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="مسح البحث" className="text-slate-400"><X size={14} /></button>}
            {!query && <kbd>⌘ K</kbd>}
          </label>
          {matches.length > 0 && <div className="absolute left-0 right-0 top-11 z-30 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{matches.map((page) => <button key={page.label} type="button" onClick={() => navigateToMatch(page)} className="block w-full rounded-lg px-3 py-2 text-right text-[11px] text-slate-600 hover:bg-red-50 hover:text-[#df2431]">{page.label}</button>)}</div>}
        </div>
        <div className="relative">
          <button className={`icon-button ${totalAlerts ? "has-notification" : ""}`} onClick={() => setNotificationsOpen((value) => !value)} aria-label="الإشعارات"><Bell size={20} /></button>
          {notificationsOpen && <div className="absolute left-0 top-12 z-30 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><div className="mb-2 flex items-center justify-between"><strong className="text-xs text-slate-800">التنبيهات</strong><span className="text-[10px] text-slate-400">آخر 30 يومًا</span></div>{totalAlerts ? <><div className="mb-2 grid grid-cols-2 gap-2"><div className="rounded-lg bg-red-50 p-2 text-center"><strong className="block text-lg text-red-600">{alerts.overdueCount || 0}</strong><span className="text-[10px] text-red-700">متأخرة</span></div><div className="rounded-lg bg-amber-50 p-2 text-center"><strong className="block text-lg text-amber-600">{alerts.dueSoonCount || 0}</strong><span className="text-[10px] text-amber-700">تستحق قريبًا</span></div></div>{(alerts.data || []).slice(0, 4).map((alert) => <button key={alert.invoiceId} type="button" onClick={() => { navigateToMatch({ label: "الفواتير" }); setNotificationsOpen(false); }} className="block w-full border-t border-slate-100 py-2 text-right text-[10px] text-slate-600 hover:text-[#df2431]">{alert.invoiceNumber} — {alert.party?.name || "فاتورة"}<span className="mr-1 text-slate-400">({alert.outstanding} ج.م)</span></button>)}</> : <p className="py-5 text-center text-[11px] text-slate-400">لا توجد تنبيهات مستحقة حاليًا.</p>}</div>}
        </div>
        <div className="relative">
          <button className="date-filter" onClick={() => setPeriodOpen((value) => !value)} aria-label="اختيار الفترة"><CalendarDays size={18} /><span>{period}</span><ChevronDown size={15} /></button>
          {periodOpen && <div className="absolute left-0 top-12 z-30 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{["اليوم", "هذا الشهر", "الشهر الماضي", "هذه السنة"].map((item) => <button key={item} type="button" onClick={() => { setPeriod(item); setPeriodOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-right text-[11px] ${period === item ? "bg-red-50 font-bold text-[#df2431]" : "text-slate-600 hover:bg-slate-50"}`}>{item}</button>)}</div>}
        </div>
      </div>
    </header>
  );
}
