import { useState } from "react";
import { X } from "lucide-react";
import { createCustomer, createCustomerSupplier } from "../api/customers";
import { createSupplier } from "../api/suppliers";
import { createEmployee } from "../api/employees";
import { createWorker } from "../api/workers";
import { apiErrorMessage } from "../utils/pageHelpers";

const configs = {
  customer: { title: "إضافة عميل", submit: createCustomer, fields: ["name", "phone", "email", "code", "openingBalance"] },
  supplier: { title: "إضافة مورد", submit: createSupplier, fields: ["name", "phone", "email", "code", "openingBalance"] },
  both: { title: "إضافة عميل ومورد", submit: createCustomerSupplier, fields: ["name", "phone", "email", "code", "openingBalance"] },
  employee: { title: "إضافة موظف", submit: createEmployee, fields: ["name", "code", "phone", "nationalId", "baseSalary", "department"] },
  worker: { title: "إضافة عامل", submit: createWorker, fields: ["name", "code", "phone", "nationalId", "baseSalary", "commissionRate"] },
};
const labels = { name: "الاسم", code: "الكود", phone: "رقم الهاتف", email: "البريد الإلكتروني", nationalId: "الرقم القومي", baseSalary: "المرتب الأساسي", openingBalance: "الرصيد الافتتاحي", commissionRate: "نسبة العمولة %", department: "القسم" };

export default function EntityModal({ type, onClose, onSaved }) {
  const config = configs[type];
  const [form, setForm] = useState({ name: "", code: "", phone: "", email: "", nationalId: "", baseSalary: "", openingBalance: "", commissionRate: "", department: "other" });
  const [state, setState] = useState({ saving: false, error: "" });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event) => { event.preventDefault(); setState({ saving: true, error: "" }); try { const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== "")); await config.submit(payload); onSaved?.(); onClose(); } catch (error) { setState({ saving: false, error: apiErrorMessage(error) }); } };
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="invoice-modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">دليل البيانات</span><h2>{config.title}</h2></div><button type="button" className="close-button" onClick={onClose}><X size={19} /></button></div>{state.error && <div className="page-error mt-4">{state.error}</div>}<div className="form-grid">{config.fields.map((field) => <div className={`form-field ${field === "email" ? "form-field-full" : ""}`} key={field}><label>{labels[field]}</label>{field === "department" ? <select value={form[field]} onChange={(event) => update(field, event.target.value)}><option value="other">أخرى</option><option value="management">الإدارة</option><option value="admin">إداري</option></select> : <input required={field === "name" || field === "code"} type={field === "email" ? "email" : ["baseSalary", "openingBalance", "commissionRate"].includes(field) ? "number" : "text"} value={form[field]} onChange={(event) => update(field, event.target.value)} placeholder={labels[field]} />}</div>)}</div><div className="modal-actions"><button className="primary-button" disabled={state.saving}>{state.saving ? "جارٍ الحفظ..." : "حفظ البيانات"}</button><button type="button" className="secondary-button" onClick={onClose}>إلغاء</button></div></form></div>;
}
