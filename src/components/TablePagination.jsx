import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({ page, pages, total, limit = 100, onPageChange }) {
  const safePages = Math.max(Number(pages) || 1, 1);
  const safePage = Math.min(Math.max(Number(page) || 1, 1), safePages);
  const safeTotal = Math.max(Number(total) || 0, 0);
  const first = safeTotal ? (safePage - 1) * limit + 1 : 0;
  const last = Math.min(safePage * limit, safeTotal);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
      <span>عرض {first}–{last} من {safeTotal}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={15} /> السابق
        </button>
        <span className="min-w-24 text-center">صفحة {safePage} من {safePages}</span>
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= safePages}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          التالي <ChevronLeft size={15} />
        </button>
      </div>
    </div>
  );
}
