# Clean Architecture + CQRS + RabbitMQ - Proje Mimari Dokümantasyonu

## 📐 Mimari Genel Bakış

Bu proje **Clean Architecture**, **CQRS Pattern**, **MediatR**, **FluentValidation** ve **MassTransit (RabbitMQ)** kullanılarak enterprise-level bir JWT authentication sistemidir.

## 🏗️ Katmanlar

### 1. **Domain** (İş Mantığı Çekirdeği)
En içteki katman, hiçbir dış bağımlılığı yoktur.

```
Domain/
├── Entities/
│   ├── BaseEntity.cs          # Tüm entityler için base class
│   ├── User.cs                # User entity (Role, RefreshTokens)
│   └── RefreshToken.cs        # Refresh token entity
├── Enums/
│   └── UserRole.cs            # User, Admin rolleri
├── Events/
│   └── UserRegisteredEvent.cs # RabbitMQ event mesajı
└── Interfaces/
    └── IJwtService.cs         # JWT service interface
```

**Sorumluluk**: İş kuralları, entity tanımları, domain events

---

### 2. **Application** (Use Cases & CQRS)
Domain katmanını kullanır, Infrastructure'dan bağımsızdır.

```
Application/
├── Commands/
│   ├── RegisterUserCommand.cs        # Register command
│   ├── RegisterUserCommandHandler.cs # Command handler + RabbitMQ publish
│   ├── LoginUserCommand.cs           # Login command
│   └── LoginUserCommandHandler.cs    # Command handler
├── Queries/
│   ├── GetCurrentUserQuery.cs        # Me endpoint query
│   └── GetCurrentUserQueryHandler.cs # Query handler
├── Validators/
│   ├── RegisterUserCommandValidator.cs # FluentValidation rules
│   └── LoginUserCommandValidator.cs    # FluentValidation rules
└── Behaviors/
    └── ValidationBehavior.cs          # MediatR pipeline behavior
```

**Sorumluluk**:
- **Commands**: Veri değiştiren işlemler (Register, Login)
- **Queries**: Veri okuma işlemleri (GetMe)
- **Validators**: Giriş doğrulama
- **Behaviors**: Cross-cutting concerns (validation, logging vb.)

---

### 3. **Infrastructure** (Teknik Detaylar)
Dış sistemlerle entegrasyon (DB, RabbitMQ, JWT).

```
Infrastructure/
├── Persistence/
│   └── (DbContext zaten Data/ klasöründe)
├── Services/
│   └── JwtService.cs              # JWT token üretimi ve validasyonu
└── Messaging/
    └── UserRegisteredEventConsumer.cs # RabbitMQ consumer (email gönderme simülasyonu)
```

**Sorumluluk**: EF Core, RabbitMQ, JWT implementasyonları

---

### 4. **API** (Presentation Layer)
Dış dünyaya açık katman.

```
Controllers/
└── AuthController.cs          # /api/auth endpoints (MediatR kullanarak)

Middleware/
└── GlobalExceptionMiddleware.cs # Tüm hataları yakalar
```

**Endpoints**:
- `POST /api/auth/register` → RegisterUserCommand
- `POST /api/auth/login` → LoginUserCommand
- `GET /api/auth/me` → GetCurrentUserQuery
- `GET /api/auth/admin-only` → [Authorize(Roles = "Admin")]

---

## 🔄 CQRS Flow

### Register Flow (Command)
```
1. POST /api/auth/register
   ↓
2. AuthController.Register()
   ↓
3. _mediator.Send(RegisterUserCommand)
   ↓
4. ValidationBehavior (FluentValidation)
   ↓
5. RegisterUserCommandHandler
   ├─→ User kaydı (EF Core)
   ├─→ JWT & RefreshToken üretimi
   └─→ RabbitMQ'ya UserRegisteredEvent gönderimi (MassTransit)
   ↓
6. Response (accessToken, refreshToken, user)
```

### RabbitMQ Background Worker
```
1. UserRegisteredEvent published
   ↓
2. RabbitMQ Queue
   ↓
3. UserRegisteredEventConsumer.Consume()
   ↓
4. Console'a "Hoş geldin maili gönderildi" logu
```

### GetMe Flow (Query)
```
1. GET /api/auth/me (Bearer token)
   ↓
2. AuthController.GetCurrentUser()
   ↓
3. _mediator.Send(GetCurrentUserQuery)
   ↓
4. GetCurrentUserQueryHandler
   ↓
5. User bilgilerini döner
```

---

## 🛠️ Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|---------------|
| **MediatR** | CQRS pattern implementasyonu |
| **FluentValidation** | Girdi doğrulama |
| **MassTransit** | RabbitMQ entegrasyonu (message broker) |
| **EF Core** | ORM (PostgreSQL) |
| **BCrypt** | Şifre hashleme |
| **JWT** | Access & Refresh Token |
| **Swagger** | API dokümantasyonu |
| **Docker** | Konteynerizasyon |

---

## 🔐 Security Features

1. **JWT Access Token** (60 dakika geçerlilik)
2. **Refresh Token** (7 gün geçerlilik, veritabanında saklanır)
3. **Role-Based Authorization** (User, Admin)
4. **BCrypt Password Hashing**
5. **FluentValidation** (XSS, SQL Injection koruması)
6. **Global Exception Handling** (Güvenli hata mesajları)

---

## 📦 Dependency Injection

`Program.cs` içinde:

```csharp
// MediatR (CQRS)
builder.Services.AddMediatR(cfg => ...);

// FluentValidation
builder.Services.AddValidatorsFromAssembly(...);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// MassTransit (RabbitMQ)
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<UserRegisteredEventConsumer>();
    x.UsingRabbitMq(...);
});

// Domain Services
builder.Services.AddScoped<IJwtService, JwtService>();
```

---

## 🚀 Çalıştırma

### Docker ile (Tüm servisler birlikte)
```bash
docker-compose up --build
```

Servisler:
- **API**: http://localhost:8080 (Swagger UI)
- **PostgreSQL**: localhost:5432
- **RabbitMQ**: localhost:5672 (AMQP), localhost:15672 (Management UI)

### Manuel
```bash
# PostgreSQL ve RabbitMQ'nun çalıştığından emin olun
dotnet ef database update
dotnet run
```

---

## 📝 Örnek Kullanım

### 1. Kullanıcı Kaydı
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
  "accessToken": "eyJhbGc...",
  "refreshToken": "dGhpc2lz...",
  "user": {
    "id": 1,
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com"
  }
}
```

**Console'da (Worker Service):**
```
===========================================
📧 Hoş Geldin Maili Gönder command alındı!
Kullanıcı ID: 1
Email: ahmet@example.com
İsim: Ahmet Yılmaz
Kayıt Tarihi: 2026-02-15T12:00:00Z
===========================================
✅ Hoş geldin maili başarıyla 'ahmet@example.com' adresine gönderildi!
```

### 2. Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

### 3. Me Endpoint (Authenticated)
```bash
GET http://localhost:8080/api/auth/me
Authorization: Bearer {accessToken}
```

### 4. Admin-Only Endpoint
```bash
GET http://localhost:8080/api/auth/admin-only
Authorization: Bearer {admin-user-token}
```

---

## 🎯 Clean Architecture Avantajları

1. **Testability**: Her katman bağımsız test edilebilir
2. **Maintainability**: İş mantığı teknik detaylardan ayrı
3. **Scalability**: Yeni feature'lar kolayca eklenebilir
4. **Flexibility**: Database/Framework değişiklikleri kolay

---

## 🔮 Gelecek İyileştirmeler

- [ ] RefreshToken rotation endpoint
- [ ] Email verification (gerçek SMTP)
- [ ] Rate limiting (Redis)
- [ ] Unit & Integration tests
- [ ] Health checks
- [ ] Distributed tracing (OpenTelemetry)
- [ ] API versioning
- [ ] CORS policy configuration

---

## 📚 Referanslar

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [MediatR Documentation](https://github.com/jbogard/MediatR)
- [MassTransit Documentation](https://masstransit.io/)
