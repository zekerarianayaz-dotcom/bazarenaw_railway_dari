bazarenaw_railway/
├── backend/
│   ├── src/
│   │   ├── index.js              → Express sunucu
│   │   ├── routes/
│   │   │   ├── auth.js           → Kullanıcı kayıt, login, e-posta onayı
│   │   │   ├── listings.js       → İlan ekleme/düzenleme/silme
│   │   │   └── profile.js        → Kullanıcı profili
│   │   └── middleware/
│   │       ├── auth.js           → JWT doğrulama
│   │       └── rateLimit.js      → API rate-limiting
│   ├── models/                   → MongoDB şemaları
│   ├── utils/email.js            → E-posta onay sistemi
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx (çoklu dil desteği)
│   │   └── i18n/
│   │       ├── tr.json
│   │       ├── en.json
│   │       ├── de.json
│   │       └── fa.json
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── railway.json (Railway auto-deploy ayarları)
└── README.md
