# BasicAuth Frontend

Modern login/register UI for BasicAuth API.

## 🚀 Çalıştırma

### Gereksinimler
- Node.js (npx için)

### Development Server Başlatma

```bash
# Frontend dizinine git
cd frontend

# HTTP Server başlat (Port 3000)
npm start
```

Tarayıcıda otomatik açılır: http://localhost:3000

## 📦 Dosyalar

- `index.html` - Login/Register sayfası
- `dashboard.html` - Dashboard sayfası
- `style.css` - Modern dark theme
- `app.js` - Authentication logic
- `dashboard.js` - Dashboard logic

## 🔗 Backend Bağlantısı

API URL: `http://localhost:8080/api/auth`

Backend'i Docker ile başlat:
```bash
cd ..
docker-compose up -d
```

## 🎨 Özellikler

- ✨ Modern dark theme
- 🎴 Glassmorphism effects
- ⚡ Smooth animations
- 📱 Responsive design
- 🔒 JWT authentication
- 🔄 Token rotation support
