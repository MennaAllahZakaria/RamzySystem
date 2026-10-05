import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children, activePage, onSelect }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="app-shell"><div className={`sidebar-dimmer ${sidebarOpen ? "is-visible" : ""}`} onClick={() => setSidebarOpen(false)} /><div className={`sidebar-wrap ${sidebarOpen ? "is-open" : ""}`}><Sidebar activePage={activePage} onSelect={(page) => { onSelect(page); setSidebarOpen(false); }} /></div><main className="main-content"><Topbar onMenuClick={() => setSidebarOpen(true)} />{children}</main></div>;
}
