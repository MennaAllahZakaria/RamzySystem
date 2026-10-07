import { ArrowDownLeft, ArrowUpLeft, ChevronDown } from "lucide-react";
import { cashFlow } from "../data/dashboardData";

export default function CashFlowChart() {
  return (
    <section className="panel cashflow-panel">
      <div className="panel-heading"><div><span className="eyebrow">نظرة سريعة</span><h2>التدفقات النقدية</h2></div><button className="select-button">آخر ٧ أيام <ChevronDown size={15} /></button></div>
      <div className="cashflow-summary"><div><span className="legend-dot inflow" /><span>التدفقات الداخلة</span><strong>١٩٨,٤٢٠ ج.م</strong><small className="positive"><ArrowUpLeft size={12} /> ١٢.٨٪</small></div><div><span className="legend-dot outflow" /><span>التدفقات الخارجة</span><strong>٨٤,٩٢٠ ج.م</strong><small><ArrowDownLeft size={12} /> ٣.٤٪</small></div></div>
      <div className="chart-area"><div className="chart-y-axis"><span>١٠٠k</span><span>٧٥k</span><span>٥٠k</span><span>٢٥k</span><span>٠</span></div><div className="chart-grid">{[100, 75, 50, 25, 0].map((n) => <div className="grid-line" key={n} style={{ bottom: `${n}%` }} />)}<div className="bars">{cashFlow.map((point) => <div className="bar-group" key={point.day}><div className="bar-stack"><div className="bar inflow" style={{ height: `${point.inflow}%` }} /><div className="bar outflow" style={{ height: `${point.outflow}%` }} /></div><span>{point.day}</span></div>)}</div></div></div>
    </section>
  );
}
