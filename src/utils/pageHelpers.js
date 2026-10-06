export function unwrapData(response) {
  const value = response?.data ?? response;
  if (Array.isArray(value)) return value;
  return value?.items ?? value?.docs ?? value?.results ?? value?.data ?? value ?? [];
}

export function numberValue(value) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value?.$numberDecimal ?? value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value) {
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 2 }).format(numberValue(value));
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(date);
}

export function apiErrorMessage(error) {
  if (error?.status === 401) return "يجب تسجيل الدخول أولاً لعرض البيانات الفعلية.";
  return error?.message || "تعذر تحميل البيانات حالياً.";
}
