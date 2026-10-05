# Frontend API Collections

كل ملف داخل هذا المجلد يمثل collection/resource من Backend API. لا نكتب `fetch` داخل الصفحات أو المكونات؛ نستورد الدالة المطلوبة من الملف المناسب.

## الاستخدام

```js
import { invoicesApi } from "../api";

const response = await invoicesApi.listInvoices({ page: 1, limit: 20 });
```

## الملفات

- `client.js`: الاتصال المركزي، `VITE_API_BASE_URL`، التوكن، query params، والأخطاء.
- `apiClient.download`: مخصص لملفات PDF وExcel/CSV التي ترجع من الـ Backend كـ Blob.
- `auth.js`: تسجيل الدخول والمستخدمين.
- `products.js`, `categories.js`: المنتجات والتصنيفات.
- `customers.js`, `suppliers.js`: العملاء والموردون.
- `invoices.js`, `payments.js`: الفواتير والمدفوعات.
- `finance.js`, `cashFlow.js`: المصروفات والإيرادات والتسويات والتدفقات النقدية.
- `payroll.js`, `employees.js`: الرواتب والموظفون.
- `reports.js`, `partyBalances.js`: التقارير وكشوف الحسابات.
- `quotes.js`, `returns.js`: عروض الأسعار والمرتجعات.
- `accounting.js`, `accountingPeriods.js`, `reconciliations.js`: الحسابات والقيود والفترات والتسويات البنكية.
- `warehouses.js`: المخازن والتحويلات والجرد والتنبيهات.
- `alerts.js`, `auditLogs.js`: تنبيهات الاستحقاق وسجل المراجعة.
- `index.js`: نقطة تصدير واحدة لكل الـ collections.

## البيئة

أنشئي ملف `.env.local` في جذر المشروع:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

القيمة الافتراضية موجودة في `client.js`، ويمكن تغييرها بدون تعديل أي collection file.
