import { X } from "lucide-react";

export function FormModal({ title, subtitle, onClose, onSubmit, loading, error, children, submitLabel = "حفظ البيانات" }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="invoice-modal max-h-[90vh] overflow-y-auto" onMouseDown={(event) => event.stopPropagation()} onSubmit={onSubmit}><div className="modal-header"><div><span className="eyebrow">إضافة إلى النظام</span><h2>{title}</h2>{subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}</div><button type="button" className="close-button" onClick={onClose} aria-label="إغلاق"><X size={19} /></button></div><div className="mt-6 space-y-4">{children}</div>{error && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}<button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-[#df2431] px-4 py-3 text-xs font-bold text-white disabled:opacity-60">{loading ? "جارٍ الحفظ..." : submitLabel}</button></form></div>;
}

export function Field({ label, value, onChange, type = "text", required = false, placeholder = "", children }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-slate-700">{label}</span>{children || <input required={required} type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-[#df2431]" />}</label>;
}

export function SelectField({ label, value, onChange, options, required = false }) {
  return <Field label={label}><select required={required} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#df2431]"><option value="">اختاري...</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>;
}
