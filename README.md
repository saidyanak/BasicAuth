# BasicAuth - JWT Authentication API

Basit JWT tabanlı authentication sistemi. .NET 10.0, PostgreSQL ve Entity Framework Core kullanılarak geliştirilmiştir.

## Özellikler

- ✅ Kullanıcı kaydı (Register)
- ✅ Kullanıcı girişi (Login)
- ✅ JWT token authentication
- ✅ Kullanıcı bilgilerini getirme (Me endpoint)
- ✅ PostgreSQL veritabanı
- ✅ Docker desteği
- ✅ Swagger UI entegrasyonu

## Teknolojiler

- .NET 10.0
- ASP.NET Core Web API
- Entity Framework Core 10
- PostgreSQL
- JWT (JSON Web Tokens)
- BCrypt (Şifre hashleme)
- Swagger/OpenAPI
- Docker & Docker Compose

## API Endpoints

### POST /api/auth/register
Yeni kullanıcı kaydı oluşturur.

**Request Body:**
```json
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "createdAt": "2026-02-15T12:00:00Z"
  }
}
```

### POST /api/auth/login
Kullanıcı girişi yapar ve JWT token döner.

**Request Body:**
```json
{
  "email": "ahmet@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "email": "ahmet@example.com",
    "createdAt": "2026-02-15T12:00:00Z"
  }
}
```

### GET /api/auth/me
Oturum açmış kullanıcının bilgilerini döner (JWT token gerektirir).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "createdAt": "2026-02-15T12:00:00Z"
}
```

## Kurulum ve Çalıştırma

### Docker ile Çalıştırma (Önerilen)

1. Repository'yi klonlayın:
```bash
git clone <repository-url>
cd BasicAuth
```

2. Docker Compose ile başlatın:
```bash
docker-compose up --build
```

3. API şu adreste çalışacaktır:
- API: http://localhost:8080
- Swagger UI: http://localhost:8080

### Manuel Kurulum

1. PostgreSQL'in çalıştığından emin olun.

2. `appsettings.json` dosyasındaki connection string'i güncelleyin:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=basicauth;Username=postgres;Password=postgres"
  }
}
```

3. Database migration'ı uygulayın:
```bash
dotnet ef database update
```

4. Uygulamayı çalıştırın:
```bash
dotnet run
```

5. Swagger UI'a şu adresten erişin: https://localhost:7001

## Swagger UI ile Test

1. Uygulamayı başlatın (Docker veya manuel).

2. Tarayıcıdan Swagger UI'a gidin:
   - Docker: http://localhost:8080
   - Manuel: https://localhost:7001

3. **Register endpoint'ini test edin:**
   - `/api/auth/register` POST endpoint'ini genişletin
   - "Try it out" butonuna tıklayın
   - Request body'yi doldurun
   - "Execute" butonuna tıklayın
   - Response'dan `token` değerini kopyalayın

4. **Token ile authenticate olun:**
   - Sayfanın üst kısmındaki "Authorize" butonuna tıklayın
   - Değer alanına `Bearer {token}` yazın (token'ı yapıştırın)
   - "Authorize" butonuna tıklayın

5. **Me endpoint'ini test edin:**
   - `/api/auth/me` GET endpoint'ini genişletin
   - "Try it out" ve "Execute" butonlarına tıklayın
   - Kullanıcı bilgilerinizi görmelisiniz

## Güvenlik Notları

⚠️ **UYARI:** Bu proje eğitim amaçlıdır. Production'da kullanmadan önce:

1. `appsettings.json` içindeki `JwtSettings.SecretKey` değerini güçlü, rastgele bir key ile değiştirin
2. Şifre politikalarını güçlendirin (minimum uzunluk, karmaşıklık vb.)
3. Rate limiting ekleyin
4. HTTPS kullanın
5. Environment variables kullanarak hassas bilgileri saklayın
6. CORS ayarlarını yapılandırın

## Proje Yapısı

```
BasicAuth/
├── Controllers/
│   └── AuthController.cs      # Authentication endpoints
├── Data/
│   └── AppDbContext.cs        # EF Core DbContext
├── DTOs/
│   ├── LoginDto.cs            # Login request
│   ├── RegisterDto.cs         # Register request
│   └── AuthResponseDto.cs     # Authentication response
├── Models/
│   └── User.cs                # User entity
├── Services/
│   └── JwtService.cs          # JWT token generation
├── Migrations/                 # EF Core migrations
├── Program.cs                  # Application configuration
├── appsettings.json           # Configuration settings
├── Dockerfile                 # Docker image definition
└── docker-compose.yml         # Multi-container setup
```

## Database Schema

### Users Tablosu
| Kolon        | Tip          | Açıklama                |
|-------------|-------------|-------------------------|
| Id          | int         | Primary key             |
| FirstName   | varchar(100)| Kullanıcı adı           |
| LastName    | varchar(100)| Kullanıcı soyadı        |
| Email       | varchar(255)| Email (unique)          |
| PasswordHash| text        | BCrypt hash             |
| CreatedAt   | timestamp   | Kayıt tarihi            |

## Lisans

MIT