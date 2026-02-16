# 🔐 BasicAuth - Enterprise JWT Authentication System

Modern bir .NET 10 Web API projesi. Clean Architecture, CQRS Pattern, MediatR, FluentValidation, MassTransit (RabbitMQ) ve JWT Authentication ile geliştirilmiştir.

## ✨ Özellikler

### 🏗️ Mimari
- **Clean Architecture** (Domain, Application, Infrastructure, API katmanları)
- **CQRS Pattern** (Command Query Responsibility Segregation)
- **MediatR** ile command/query handling
- **FluentValidation** ile input validation
- **Event-Driven Architecture** (MassTransit + RabbitMQ)
- **Global Exception Handling Middleware**

### 🔒 Authentication & Authorization
- **JWT Access Token** (Short-lived, 60 dakika)
- **Refresh Token Rotation** (Long-lived, 7 gün, tek kullanımlık)
- **Role-Based Authorization** (User, Admin)
- **BCrypt** password hashing

### 📦 Teknolojiler
- .NET 10.0
- Entity Framework Core 10.0
- PostgreSQL 16
- RabbitMQ 3 (Management UI)
- Docker & Docker Compose
- Swagger/OpenAPI

## 🚀 Kurulum

### Gereksinimler
- Docker & Docker Compose
- (Opsiyonel) .NET 10 SDK (local development için)

### 1. Backend (API + Swagger) Çalıştırma

```bash
# Docker ile backend'i başlat
docker-compose up --build -d

# Logları izle
docker-compose logs -f api
```

**Backend Servisleri:**
- **Swagger UI**: http://localhost:8080
- **API Base URL**: http://localhost:8080/api
- **PostgreSQL**: localhost:5432
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### 2. Frontend (Web UI) Çalıştırma

```bash
# Frontend dizinine git
cd frontend

# HTTP Server başlat (Port 3000)
npm start
```

**Frontend:**
- **Web UI**: http://localhost:3000
- Login/Register sayfası otomatik açılır

## 📖 API Endpoints

### Public Endpoints (Authentication gerektirmez)

#### POST /api/auth/register
Yeni kullanıcı kaydı.

```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "dGVzdC...",
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "role": "User"
}
```

**Event:** Kayıt başarılı olduğunda `UserRegisteredEvent` RabbitMQ'ya publish edilir ve background worker "hoş geldin" maili gönderir (simülasyon).

---

#### POST /api/auth/login
Kullanıcı girişi.

```json
{
  "email": "ahmet@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "dGVzdC...",
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "role": "User"
}
```

---

#### POST /api/auth/refresh
Refresh token ile yeni access token alma (Token Rotation).

```json
{
  "refreshToken": "dGVzdC..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",  // YENİ TOKEN
  "refreshToken": "bmV3VG...",   // YENİ REFRESH TOKEN
  "userId": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "role": "User"
}
```

**Önemli:** Eski refresh token otomatik revoke edilir (tek kullanımlık).

---

### Protected Endpoints (JWT Bearer Token gerektirir)

#### GET /api/auth/me
Oturum açmış kullanıcının bilgilerini getirir.

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "role": "User",
  "isActive": true,
  "createdAt": "2026-02-15T12:00:00Z"
}
```

---

#### GET /api/auth/admin-only
Sadece Admin rolü erişebilir.

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (Admin ise):**
```json
{
  "message": "Burası sadece Admin'ler içindir!",
  "userId": 1,
  "role": "Admin"
}
```

**Response (User ise):**
```json
403 Forbidden
```

---

## 🎨 Web UI Kullanımı

### Frontend Başlatma
```bash
cd frontend
npm start
```

Tarayıcıda otomatik açılır: **http://localhost:3000**

### Kullanım Adımları
1. **Kayıt Ol** veya **Giriş Yap** formunu kullan
2. Başarılı girişten sonra **Dashboard** sayfası açılır
3. Dashboard'da:
   - Kullanıcı bilgilerini görüntüle
   - Access Token ve Refresh Token'ı gör
   - API endpoint'lerini test et:
     - `GET /api/auth/me` - Profil bilgileri
     - `GET /api/auth/admin-only` - Admin kontrolü
     - `POST /api/auth/refresh` - Token yenileme

### Port Ayrımı
- **Frontend**: http://localhost:3000 (Web UI)
- **Backend**: http://localhost:8080 (Swagger + API)

## 🏛️ Proje Yapısı

```
BasicAuth/
├── Controllers/
│   └── AuthController.cs              # API endpoints (MediatR orchestration)
├── Application/
│   ├── Commands/
│   │   ├── RegisterUserCommand.cs     # Kayıt command
│   │   ├── LoginUserCommand.cs        # Login command
│   │   └── RefreshTokenCommand.cs     # Refresh token command
│   ├── Queries/
│   │   └── GetCurrentUserQuery.cs     # Kullanıcı bilgisi query
│   ├── Validators/
│   │   ├── RegisterUserCommandValidator.cs
│   │   ├── LoginUserCommandValidator.cs
│   │   └── RefreshTokenCommandValidator.cs
│   └── Behaviors/
│       └── ValidationBehavior.cs      # FluentValidation pipeline
├── Domain/
│   ├── Entities/
│   │   ├── User.cs                    # User entity
│   │   ├── RefreshToken.cs            # Refresh token entity
│   │   └── BaseEntity.cs              # Base entity (Id, CreatedAt)
│   ├── Enums/
│   │   └── UserRole.cs                # User, Admin
│   ├── Events/
│   │   └── UserRegisteredEvent.cs     # RabbitMQ event
│   └── Interfaces/
│       └── IJwtService.cs             # JWT service interface
├── Infrastructure/
│   ├── Services/
│   │   └── JwtService.cs              # JWT token generation
│   └── Messaging/
│       └── UserRegisteredEventConsumer.cs  # RabbitMQ consumer
├── Data/
│   └── AppDbContext.cs                # EF Core DbContext
├── Middleware/
│   └── GlobalExceptionMiddleware.cs   # Global exception handling
├── wwwroot/
│   ├── index.html                     # Login/Register page
│   ├── dashboard.html                 # Dashboard page
│   ├── style.css                      # Styles
│   ├── app.js                         # Login/Register logic
│   └── dashboard.js                   # Dashboard logic
└── Program.cs                         # DI Configuration & Middleware
```

## 🔄 CQRS Pattern Örneği

### Traditional Service Layer (Eski Yöntem)
```csharp
// ❌ Tek bir AuthService, 500+ satır kod
public class AuthService {
    public async Task<LoginResult> LoginAsync(...) { }
    public async Task<RegisterResult> RegisterAsync(...) { }
    public async Task<RefreshResult> RefreshTokenAsync(...) { }
    // 10+ method daha...
}
```

### CQRS with MediatR (Bizim Kullandığımız)
```csharp
// ✅ Her işlem için ayrı handler, her biri 50-100 satır

// Login Handler
public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, LoginUserCommandResult>
{
    // SADECE login işleminden sorumlu
}

// Register Handler
public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, RegisterUserCommandResult>
{
    // SADECE register işleminden sorumlu
}

// Refresh Token Handler
public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenCommandResult>
{
    // SADECE refresh token işleminden sorumlu
}
```

**Avantajlar:**
- ✅ Single Responsibility Principle
- ✅ Her handler bağımsız test edilebilir
- ✅ FluentValidation otomatik çalışır (Pipeline Behavior)
- ✅ Yeni özellik eklemek çok kolay

## 🐰 RabbitMQ Event-Driven Flow

```
1. User register ediyor (POST /api/auth/register)
   ↓
2. RegisterUserCommandHandler çalışıyor:
   ├─ User kaydediliyor (Database)
   ├─ JWT token'lar üretiliyor
   └─ UserRegisteredEvent publish ediliyor (RabbitMQ)
   ↓
3. RabbitMQ queue'da event bekliyor
   ↓
4. UserRegisteredEventConsumer (Background Worker) eventi alıyor
   ↓
5. "Hoş geldin" maili gönderiliyor (simülasyon)
   ✅ Log: "Hoş geldin maili başarıyla 'ahmet@example.com' adresine gönderildi!"
```

**RabbitMQ Management UI'da görebilirsin:**
- http://localhost:15672
- Username: `guest`
- Password: `guest`

## 🔐 JWT Token Validation

### Java Spring Security'den Farkı

**Java'da (Manuel):**
```java
// ❌ Sen yazıyorsun:
JwtAuthenticationFilter
JwtTokenProvider.validateToken()
UserDetailsService.loadUserByUsername()  // Her istekte DATABASE!
```

**.NET'te (Otomatik):**
```csharp
// ✅ Framework yapıyor:
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            // ...
        };
    });

app.UseAuthentication(); // Bu satır yeter!
```

**Sonuç:**
- .NET'te **custom filter yazmaya gerek yok**
- Built-in middleware otomatik validation yapıyor
- Claims token'da, **her istekte DB'ye gitmeye gerek yok** → Çok daha performanslı!

## 🧪 Test Senaryoları

### 1. Kayıt Ol ve Token Al
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 2. Giriş Yap
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 3. Profil Bilgilerini Al (JWT ile)
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Token Yenile (Rotation)
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 📚 Dependency Injection (DI)

**Program.cs'te tüm DI kayıtları:**

```csharp
// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Custom Services
builder.Services.AddScoped<IJwtService, JwtService>();

// MediatR (tüm handler'ları otomatik kaydeder)
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

// FluentValidation (tüm validator'ları otomatik kaydeder)
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

// Validation Pipeline Behavior
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// MassTransit & RabbitMQ
builder.Services.AddMassTransit(x => {
    x.AddConsumer<UserRegisteredEventConsumer>();
    x.UsingRabbitMq((context, cfg) => { ... });
});
```

**Lifecycle'lar:**
- **Scoped**: AppDbContext, JwtService (Her HTTP request için yeni instance)
- **Transient**: Handlers, ValidationBehavior (Her istekte yeni instance)
- **Singleton**: Kullanılmamış

## 🛠️ Development

### Local Development (without Docker)

```bash
# appsettings.json'da connection string güncelle
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=basicauth;Username=postgres;Password=postgres"
}

# Migration çalıştır
dotnet ef database update

# Uygulamayı başlat
dotnet run
```

### Database Migration Oluşturma

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

## 📝 Notlar

### Token Rotation Neden Önemli?
- Eski refresh token **tek kullanımlık** (use-once principle)
- Her refresh işleminde eski token **revoke** edilir
- Yeni access + refresh token çifti döner
- **Security:** Token çalınsa bile sınırlı süre geçerli

### FluentValidation Pipeline
- Her command/query otomatik validate edilir
- Validation hatası varsa `400 Bad Request` döner
- Controller'da manuel validation yapmaya gerek yok

### Global Exception Handling
- Tüm exception'lar `GlobalExceptionMiddleware` tarafından yakalanır
- `ValidationException` → 400 Bad Request
- `UnauthorizedAccessException` → 401 Unauthorized
- `KeyNotFoundException` → 404 Not Found
- Diğer hatalar → 500 Internal Server Error

## 🎤 Mülakat İçin Önemli Noktalar

1. **Clean Architecture**: Domain, Application, Infrastructure, API katmanları ayrı
2. **CQRS Pattern**: Read (Query) ve Write (Command) işlemleri ayrı
3. **MediatR**: Command/Query handler'lar business logic içerir, controller'lar sadece orchestration yapar
4. **Dependency Injection**: IoC Container ile loose coupling
5. **Event-Driven**: MassTransit ile asenkron event processing
6. **Security Best Practices**:
   - BCrypt password hashing
   - JWT access token (short-lived)
   - Refresh token rotation (long-lived, one-time use)
   - Role-based authorization

## 📖 Ek Dökümanlar

Proje root'unda detaylı açıklama dökümanları:
- [CURRENT_ARCHITECTURE_EXPLAINED.md](CURRENT_ARCHITECTURE_EXPLAINED.md) - Mimari detayları
- [DEPENDENCY_INJECTION_EXPLAINED.md](DEPENDENCY_INJECTION_EXPLAINED.md) - DI/IoC açıklaması
- [JWT_VALIDATION_EXPLAINED.md](JWT_VALIDATION_EXPLAINED.md) - JWT validation, Java vs .NET karşılaştırması

## 🤝 Katkıda Bulunma

Bu proje bir staj görüşmesi için hazırlanmış örnek bir projedir.

## 📄 Lisans

MIT License

---

**Hazırlayan:** [Your Name]
**Tarih:** 2026-02-15
**Teknolojiler:** .NET 10, Clean Architecture, CQRS, MediatR, FluentValidation, MassTransit, RabbitMQ, PostgreSQL, Docker
