import { useEffect, useMemo } from "react";
import { Download, Printer, X } from "lucide-react";

export default function PdfPreviewModal({ blob, filename, onClose }) {
  const url = useMemo(() => blob ? URL.createObjectURL(blob) : "", [blob]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  const print = () => document.getElementById("pdf-preview-frame")?.contentWindow?.print();
  if (!blob) return null;
  return <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 p-3 sm:p-6" onMouseDown={onClose}>
    <section className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div><strong className="block text-sm text-slate-800">معاينة PDF</strong><span className="text-xs text-slate-500">{filename}</span></div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><Printer size={15} /> طباعة</button>
          <a href={url || undefined} download={filename} className="inline-flex items-center gap-2 rounded-lg bg-[#df2431] px-3 py-2 text-xs font-bold text-white"><Download size={15} /> حفظ PDF</a>
          <button type="button" onClick={onClose} aria-label="إغلاق المعاينة" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600"><X size={17} /></button>
        </div>
      </header>
      {url ? <iframe id="pdf-preview-frame" title={`معاينة ${filename}`} src={url} className="min-h-0 flex-1 bg-slate-100" /> : <div className="grid flex-1 place-items-center text-sm text-slate-500">جارٍ تجهيز المعاينة...</div>}
    </section>
  </div>;
}
