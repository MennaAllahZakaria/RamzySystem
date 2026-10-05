import { ArrowUpLeft, Boxes, CircleDollarSign, CreditCard, TrendingUp } from "lucide-react";

const icons = { trending: TrendingUp, profit: CircleDollarSign, inventory: Boxes, receivables: CreditCard };

export default function StatCard({ stat }) {
  const Icon = icons[stat.icon];
  return (
    <article className={`stat-card stat-${stat.tone}`}>
      <div className="stat-card-top"><span className="stat-icon"><Icon size={20} /></span><button className="more-button" aria-label="المزيد">•••</button></div>
      <p>{stat.label}</p>
      <div className="stat-value"><strong>{stat.value}</strong><span>{stat.unit}</span></div>
      <div className="stat-footer"><span className="stat-change"><ArrowUpLeft size={13} /> {stat.change}</span><span>مقارنة بالشهر السابق</span></div>
    </article>
  );
}
