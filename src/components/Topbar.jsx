import { Bell, CalendarDays, ChevronDown, Menu, Search } from "lucide-react";

export default function Topbar({ onMenuClick, user }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenuClick} aria-label="فتح القائمة"><Menu size={21} /></button>
      <div className="topbar-heading"><span>الأربعاء، ١ أكتوبر ٢٠٢٦</span><h1>صباح الخير، {user?.name || "بك"} <span className="wave">✦</span></h1></div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={18} />
          <input placeholder="ابحث في النظام..." aria-label="البحث" />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button has-notification" aria-label="الإشعارات"><Bell size={20} /></button>
        <button className="date-filter"><CalendarDays size={18} /><span>هذا الشهر</span><ChevronDown size={15} /></button>
      </div>
    </header>
  );
}
