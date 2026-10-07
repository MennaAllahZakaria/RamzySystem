import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, LoaderCircle } from "lucide-react";
import { login } from "../api/auth";

export default function LoginPage({ onAuthenticated }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState({ loading: false, error: "" });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setState({ loading: false, error: "اكتبي البريد الإلكتروني وكلمة المرور أولاً." });
      return;
    }
    setState({ loading: true, error: "" });
    try {
      const result = await login({ email: form.email.trim(), password: form.password });
      onAuthenticated(result?.data?.user || result?.user);
    } catch (error) {
      setState({ loading: false, error: error.status === 401 ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : error.message || "تعذر تسجيل الدخول حالياً." });
    }
  };

  return <main className="grid min-h-screen place-items-center bg-[#f7f9fa] px-4 py-8" dir="rtl">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(28,45,58,.09)] md:grid-cols-[.9fr_1.1fr]">
      <section className="hidden bg-[#1d282e] p-10 text-white md:flex md:flex-col md:justify-between"><div><div className="mb-8 flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/20 bg-white"><img src="/assets/ramzy-logo.jpg" alt="رمزي سيستم" className="h-full w-full scale-[1.3] object-cover" /></div><div><strong className="block text-lg">رمزي سيستم</strong><span className="text-xs text-slate-300">نظامك المحاسبي بوضوح</span></div></div><span className="mb-3 block text-xs font-semibold text-[#ff9297]">إدارة أذكى لشركتك</span><h1 className="max-w-sm text-4xl font-bold leading-[1.35]">كل أرقام شركتك في مكان واحد.</h1><p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">تابعي المخزون، الفواتير، التدفقات النقدية والرواتب من لوحة واحدة آمنة وواضحة.</p></div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300"><ShieldCheck size={22} className="text-emerald-300" /><span>بياناتك محمية ويُسمح لكل مستخدم حسب صلاحياته.</span></div></section>
      <section className="p-7 sm:p-12"><div className="mb-9 md:hidden"><div className="mb-4 flex items-center gap-3"><div className="h-11 w-11 overflow-hidden rounded-xl border border-red-100"><img src="/assets/ramzy-logo.jpg" alt="رمزي سيستم" className="h-full w-full scale-[1.3] object-cover" /></div><strong className="text-lg">رمزي سيستم</strong></div></div><span className="eyebrow">تسجيل الدخول</span><h2 className="!m-0 text-3xl font-bold text-slate-800">أهلاً بعودتك</h2><p className="mt-3 text-sm leading-6 text-slate-500">سجّلي دخولك للوصول إلى لوحة التحكم والبيانات المحاسبية.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold text-slate-700">البريد الإلكتروني</span><span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-[#df2431] focus-within:ring-4 focus-within:ring-red-50"><Mail size={17} className="text-slate-400" /><input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@company.com" className="w-full bg-transparent text-sm text-slate-800 outline-none" dir="ltr" /></span></label><label className="block"><span className="mb-2 block text-xs font-bold text-slate-700">كلمة المرور</span><span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-[#df2431] focus-within:ring-4 focus-within:ring-red-50"><LockKeyhole size={17} className="text-slate-400" /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" className="w-full bg-transparent text-sm text-slate-800 outline-none" dir="ltr" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{state.error && <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">{state.error}</div>}<button type="submit" disabled={state.loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#df2431] text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:-translate-y-0.5 hover:bg-[#c91e2a] disabled:cursor-not-allowed disabled:opacity-70">{state.loading && <LoaderCircle size={17} className="animate-spin" />} {state.loading ? "جارٍ تسجيل الدخول..." : "دخول إلى النظام"}</button></form><p className="mt-7 text-center text-[11px] text-slate-400">إذا نسيتِ كلمة المرور، تواصلي مع مدير النظام لإعادة ضبطها.</p></section>
    </div>
  </main>;
}
