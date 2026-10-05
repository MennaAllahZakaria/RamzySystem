# RamzySystem Frontend

واجهة محاسبية عربية RTL مبنية بـ **React + Vite + Tailwind CSS** داخل مستودع `RamzySystem`.

## التصميم

- واجهة RTL friendly ومريحة للاستخدام اليومي.
- ألوان محايدة هادئة مع الأحمر الخاص بالهوية البصرية.
- خط عربي واضح: IBM Plex Sans Arabic مع Cairo كخيار احتياطي.
- Dashboard يركز على التدفقات النقدية، المبيعات، الأرباح، المخزون، المستحقات والتنبيهات.
- التصميم responsive للـ desktop والـ tablet والموبايل.

## التشغيل

```bash
npm install
npm run dev
```

## الفحص والبناء

```bash
npm run lint
npm run build
```

## هيكل المشروع

```text
src/
├── components/       # مكونات الواجهة القابلة لإعادة الاستخدام
├── data/             # بيانات العرض المؤقتة لحين ربط الـ API
├── App.jsx           # تركيب الصفحات وحالة التنقل
├── App.css           # نظام التصميم والتخطيط responsive
├── index.css         # إعدادات عامة وTailwind
└── main.jsx          # نقطة تشغيل التطبيق وRTL
public/
├── assets/           # الهوية البصرية واللوجو
└── manus-routes.json # تعريف مسارات الواجهة
```

## الربط بالـ Backend

الـ Dashboard الحالي يستخدم بيانات عرض منظمة في `src/data/dashboardData.js`. الخطوة التالية هي إضافة طبقة `api/` أو `services/` وربطها بـ API الباك إند الموجود في مستودع `RamzySystem-Backend` بدون تغيير مكونات العرض.
