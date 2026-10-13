import { useState } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

export function ConfirmDialog({ title = "تأكيد العملية", message, onConfirm, onCancel }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={onCancel}>
    <section className="invoice-modal max-w-md" onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-header"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><AlertTriangle size={20} /></span><div><span className="eyebrow">تأكيد مطلوب</span><h2>{title}</h2></div></div><button type="button" className="close-button" onClick={onCancel} aria-label="إغلاق"><X size={17} /></button></div>
      <p className="mt-5 text-sm leading-7 text-slate-600">{message}</p>
      <div className="modal-actions"><button type="button" className="primary-button !bg-[#df2431]" onClick={onConfirm}>نعم، متابعة</button><button type="button" className="secondary-button" onClick={onCancel}>إلغاء</button></div>
    </section>
  </div>;
}

export function useConfirm() {
  const [request, setRequest] = useState(null);
  const confirm = (message, title) => new Promise((resolve) => setRequest({ message, title, resolve }));
  const close = (result) => { request?.resolve(result); setRequest(null); };
  const dialog = request ? <ConfirmDialog title={request.title} message={request.message} onConfirm={() => close(true)} onCancel={() => close(false)} /> : null;
  return { confirm, dialog };
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const notify = (message, type = "success") => { setToast({ message, type }); window.setTimeout(() => setToast(null), 3500); };
  return { toast, notify, clear: () => setToast(null) };
}

export function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return <div className={`app-toast app-toast-${type}`} role="status"><CheckCircle2 size={17} /><span>{message}</span><button type="button" onClick={onClose} aria-label="إغلاق"><X size={15} /></button></div>;
}
