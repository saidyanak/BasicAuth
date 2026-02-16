# 🚀 Quick Start Guide

## Hızlı Başlangıç (2 Adımda)

### 1️⃣ Backend'i Başlat

```bash
# Docker ile tüm servisleri başlat
docker-compose up -d

# Logları izle (opsiyonel)
docker-compose logs -f api
```

✅ **Backend hazır!**
- Swagger UI: http://localhost:8080
- API: http://localhost:8080/api
- RabbitMQ: http://localhost:15672 (guest/guest)

---

### 2️⃣ Frontend'i Başlat

```bash
# Frontend dizinine git
cd frontend

# HTTP server başlat
npm start
```

✅ **Frontend hazır!**
- Web UI: http://localhost:3000 (otomatik açılır)

---

## 🧪 Test Et

### Web UI'dan Test:

1. **http://localhost:3000** → Kayıt Ol
   - Ad: Test
   - Soyad: User
   - Email: test@example.com
   - Şifre: Test123456

2. Kayıt başarılı → **Dashboard**
   - Profil bilgilerini gör
   - Token'ları gör
   - API'yi test et

### Swagger'dan Test:

1. **http://localhost:8080** → Swagger UI
2. `POST /api/auth/register` → Try it out
3. Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Pass123456"
}
```
4. Execute → Token'ları al
5. `Authorize` butonuna tıkla → `Bearer YOUR_ACCESS_TOKEN`
6. `GET /api/auth/me` → Try it out → Execute

---

## 📊 Servisler

| Servis | URL | Kullanıcı/Şifre |
|--------|-----|-----------------|
| **Frontend (Web UI)** | http://localhost:3000 | - |
| **Backend (Swagger)** | http://localhost:8080 | - |
| **API Base** | http://localhost:8080/api | - |
| **RabbitMQ Management** | http://localhost:15672 | guest/guest |
| **PostgreSQL** | localhost:5432 | postgres/postgres |

---

## 🔄 Yeniden Başlatma

```bash
# Tüm servisleri durdur
docker-compose down

# Yeniden başlat
docker-compose up -d

# Frontend
cd frontend && npm start
```

---

## 🐞 Sorun Giderme

### Frontend API'ye bağlanamıyor?
```bash
# Backend'in çalıştığını kontrol et
curl http://localhost:8080/api/auth/login

# CORS hatası alıyorsan, backend'i yeniden başlat
docker-compose restart api
```

### RabbitMQ bağlanamıyor?
```bash
# RabbitMQ sağlık kontrolü
docker-compose ps

# RabbitMQ loglarını kontrol et
docker-compose logs rabbitmq
```

### Database migration hatası?
```bash
# Container'ları sıfırla
docker-compose down -v
docker-compose up -d
```

---

## 📖 Daha Fazla Bilgi

- [README.md](README.md) - Detaylı dokümantasyon
- [CURRENT_ARCHITECTURE_EXPLAINED.md](CURRENT_ARCHITECTURE_EXPLAINED.md) - Mimari açıklaması
- [DEPENDENCY_INJECTION_EXPLAINED.md](DEPENDENCY_INJECTION_EXPLAINED.md) - DI/IoC
- [JWT_VALIDATION_EXPLAINED.md](JWT_VALIDATION_EXPLAINED.md) - JWT validation

---

**Başarılar! 🎉**
