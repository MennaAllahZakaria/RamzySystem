export const dashboardStats = [
  { label: "إجمالي المبيعات", value: "186,420", unit: "ج.م", change: "+12.8%", tone: "red", icon: "trending" },
  { label: "صافي الأرباح", value: "48,760", unit: "ج.م", change: "+8.4%", tone: "green", icon: "profit" },
  { label: "قيمة المخزون", value: "392,850", unit: "ج.م", change: "مستقر", tone: "blue", icon: "inventory" },
  { label: "المبالغ المستحقة", value: "74,320", unit: "ج.م", change: "12 فاتورة", tone: "amber", icon: "receivables" },
];

export const cashFlow = [
  { day: "السبت", inflow: 62, outflow: 34 },
  { day: "الأحد", inflow: 48, outflow: 28 },
  { day: "الإثنين", inflow: 76, outflow: 42 },
  { day: "الثلاثاء", inflow: 58, outflow: 36 },
  { day: "الأربعاء", inflow: 88, outflow: 48 },
  { day: "الخميس", inflow: 69, outflow: 31 },
  { day: "الجمعة", inflow: 94, outflow: 45 },
];

export const recentInvoices = [
  { number: "INV-2026-0184", party: "شركة النور للمقاولات", type: "بيع", amount: "24,850", status: "مدفوعة", date: "اليوم، 10:42 ص" },
  { number: "PUR-2026-0091", party: "مؤسسة الأمان للتوريدات", type: "شراء", amount: "18,400", status: "آجلة", date: "اليوم، 09:18 ص" },
  { number: "INV-2026-0183", party: "مكتب رامزي", type: "بيع داخلي", amount: "6,750", status: "مدفوعة", date: "أمس، 04:35 م" },
  { number: "INV-2026-0182", party: "أحمد حسن", type: "بيع", amount: "3,240", status: "جزئية", date: "أمس، 01:12 م" },
];

export const alerts = [
  { title: "فاتورة مستحقة اليوم", detail: "فاتورة INV-2026-0172 — شركة الأفق", amount: "12,500 ج.م", tone: "red" },
  { title: "منتجات قاربت على النفاد", detail: "8 منتجات وصلت لحد إعادة الطلب", amount: "عرض المنتجات", tone: "amber" },
  { title: "موعد جرد قريب", detail: "الجرد الدوري للمخزن الرئيسي بعد 3 أيام", amount: "4 أكتوبر", tone: "blue" },
];
