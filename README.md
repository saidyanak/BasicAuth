# BasicAuth - Enterprise JWT Authentication System

**Clean Architecture + CQRS + MediatR + FluentValidation + MassTransit (RabbitMQ)**

Modern .NET 10 ile geliştirilmiş, production-ready JWT authentication sistemi.

---

## ✨ Özellikler

- ✅ **Clean Architecture** (Domain, Application, Infrastructure, API katmanları)
- ✅ **CQRS Pattern** (MediatR ile Commands & Queries)
- ✅ **FluentValidation** (Girdi doğrulama)
- ✅ **MassTransit + RabbitMQ** (Async messaging & Worker Service)
- ✅ **JWT Access & Refresh Tokens**
- ✅ **Role-Based Authorization** (User, Admin)
- ✅ **Global Exception Handling Middleware**
- ✅ **PostgreSQL** (Entity Framework Core)
- ✅ **Docker Compose** (API + PostgreSQL + RabbitMQ)
- ✅ **Swagger UI** (Bearer token authentication)

---

## 🏗️ Proje Yapısı

```
BasicAuth/
├── Domain/                    # İş mantığı çekirdeği
│   ├── Entities/              # User, RefreshToken
│   ├── Enums/                 # UserRole
│   ├── Events/                # UserRegisteredEvent
│   └── Interfaces/            # IJwtService
├── Application/               # Use cases (CQRS)
│   ├── Commands/              # RegisterUserCommand, LoginUserCommand
│   ├── Queries/               # GetCurrentUserQuery
│   ├── Validators/            # FluentValidation rules
│   └── Behaviors/             # ValidationBehavior (MediatR pipeline)
├── Infrastructure/
│   ├── Persistence/           # EF Core DbContext
│   ├── Services/              # JwtService
│   └── Messaging/             # RabbitMQ Consumer
├── Controllers/               # AuthController (MediatR kullanarak)
├── Middleware/                # GlobalExceptionMiddleware
├── Data/                      # AppDbContext
├── Migrations/                # EF Core migrations
├── Program.cs                 # DI configuration
├── Dockerfile
└── docker-compose.yml         # API + PostgreSQL + RabbitMQ
```

Detaylı mimari dokümantasyonu için: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🚀 Hızlı Başlangıç

### Docker ile (Önerilen)

```bash
# Tüm servisleri başlat (API + PostgreSQL + RabbitMQ)
docker-compose up --build
```

**Servisler:**
- 🌐 API (Swagger): http://localhost:8080
- 🐘 PostgreSQL: localhost:5432
- 🐰 RabbitMQ Management: http://localhost:15672 (guest/guest)

### Manuel Kurulum

```bash
# PostgreSQL ve RabbitMQ'nun çalıştığından emin olun

# Database migration uygula
dotnet ef database update

# Uygulamayı çalıştır
dotnet run
```

---

## 📡 API Endpoints

| Endpoint | Method | Açıklama | Auth |
|----------|--------|----------|------|
| `/api/auth/register` | POST | Yeni kullanıcı kaydı | ❌ |
| `/api/auth/login` | POST | Kullanıcı girişi | ❌ |
| `/api/auth/me` | GET | Kullanıcı bilgilerini getir | ✅ JWT |
| `/api/auth/admin-only` | GET | Admin-only endpoint | ✅ Admin Role |

---

## 🧪 Örnek Kullanım

### 1️⃣ Kullanıcı Kaydı

**Request:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "refreshToken": "dGhpc2lzYXJlZnJlc2h0b2tlbg==",
  "user": {
    "id": 1,
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com"
  }
}
```

**🐰 RabbitMQ Consumer Logu:**
```
===========================================
📧 Hoş Geldin Maili Gönder command alındı!
Kullanıcı ID: 1
Email: ahmet@example.com
İsim: Ahmet Yılmaz
===========================================
✅ Hoş geldin maili başarıyla gönderildi!
```

### 2️⃣ Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

### 3️⃣ Me Endpoint (Authenticated)

```bash
GET http://localhost:8080/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "role": "User",
  "createdAt": "2026-02-15T12:00:00Z"
}
```

---

## 🔐 Teknolojiler

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|---------------|
| .NET | 10.0 | Framework |
| ASP.NET Core | 10.0 | Web API |
| Entity Framework Core | 10.0 | ORM (PostgreSQL) |
| **MediatR** | 14.0 | CQRS implementasyonu |
| **FluentValidation** | 12.1 | Girdi doğrulama |
| **MassTransit** | 9.0 | RabbitMQ entegrasyonu |
| PostgreSQL | 16 | Veritabanı |
| RabbitMQ | 3 | Message broker |
| BCrypt.Net | 4.0 | Şifre hashleme |
| Swashbuckle | 7.2 | Swagger UI |
| Docker | - | Konteynerizasyon |

---

## 🎯 CQRS Flow Örneği

**Register Flow:**
```
1. POST /api/auth/register
   ↓
2. AuthController → MediatR.Send(RegisterUserCommand)
   ↓
3. ValidationBehavior (FluentValidation)
   ↓
4. RegisterUserCommandHandler
   ├─→ User kaydı (EF Core)
   ├─→ JWT & RefreshToken üretimi
   └─→ RabbitMQ'ya UserRegisteredEvent publish (MassTransit)
   ↓
5. UserRegisteredEventConsumer (Worker Service)
   └─→ "Hoş geldin maili" simülasyonu
```

---

## 🔧 Konfigürasyon

`appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=basicauth;..."
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-min-32-chars",
    "Issuer": "BasicAuthAPI",
    "Audience": "BasicAuthClient",
    "ExpirationMinutes": "60"
  },
  "RabbitMQ": {
    "Host": "localhost",
    "Username": "guest",
    "Password": "guest"
  }
}
```

---

## 📚 Katman Sorumlulukları

| Katman | Sorumluluk | Bağımlılıklar |
|--------|-----------|---------------|
| **Domain** | İş mantığı, Entity'ler, Events | ❌ Hiçbiri |
| **Application** | Use cases, CQRS, Validators | ✅ Domain |
| **Infrastructure** | EF Core, JWT, RabbitMQ | ✅ Application, Domain |
| **API** | Controllers, Middleware | ✅ Tüm katmanlar |

---

## 🛡️ Güvenlik Özellikleri

1. ✅ **JWT Access Token** (60 dakika)
2. ✅ **Refresh Token** (7 gün, DB'de saklanır)
3. ✅ **Role-Based Authorization** ([Authorize(Roles = "Admin")])
4. ✅ **BCrypt Password Hashing**
5. ✅ **FluentValidation** (SQL Injection, XSS koruması)
6. ✅ **Global Exception Handling** (Güvenli hata mesajları)

---

## 📊 Database Schema

### Users Tablosu
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int | Primary key |
| FirstName | varchar(100) | Kullanıcı adı |
| LastName | varchar(100) | Kullanıcı soyadı |
| Email | varchar(255) | Email (unique) |
| PasswordHash | text | BCrypt hash |
| Role | enum | User, Admin |
| IsActive | bool | Hesap aktif mi? |
| CreatedAt | timestamp | Kayıt tarihi |

### RefreshTokens Tablosu
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int | Primary key |
| Token | text | Refresh token (unique) |
| UserId | int | Foreign key → Users |
| ExpiresAt | timestamp | Geçerlilik süresi |
| IsRevoked | bool | İptal edildi mi? |
| CreatedAt | timestamp | Oluşturulma tarihi |

---

## 🧪 Test (Swagger UI)

1. http://localhost:8080 adresine git
2. **POST /api/auth/register** ile kayıt ol
3. Response'daki `accessToken`'ı kopyala
4. Sağ üstteki **"Authorize"** butonuna tıkla
5. `Bearer {accessToken}` yaz ve **Authorize**
6. **GET /api/auth/me** endpoint'ini test et

---

## 🐳 Docker Commands

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f api

# RabbitMQ Management UI
http://localhost:15672 (guest/guest)

# Servisleri durdur
docker-compose down

# Volumeleri de sil
docker-compose down -v
```

---

## 🚧 Gelecek İyileştirmeler

- [ ] Refresh Token rotation endpoint
- [ ] Email verification (SMTP)
- [ ] Forgot password flow
- [ ] Rate limiting (Redis)
- [ ] Unit & Integration tests
- [ ] CI/CD pipeline
- [ ] Serilog (structured logging)
- [ ] Health checks
- [ ] API versioning

---

## 📖 Dokümantasyon

- **Mimari Detayları**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Swagger UI**: http://localhost:8080

---

## 📝 Lisans

MIT

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit atın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

**Geliştirici**: [Saidyan AK]  
**Tarih**: Şubat 2026  
**Framework**: .NET 10.0
