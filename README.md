<img width="1919" height="1021" alt="Screenshot 2025-12-17 155432" src="https://github.com/user-attachments/assets/85475188-00f5-4340-8719-b6f09eec265f" /># Praktikum 7 - Web Service Engineering
## Meningkatkan Keamanan, Logging, dan Monitoring pada RESTful API Express.js

---

## 📋 Informasi Mahasiswa

- **Nama**: Lira Anggraini
- **NIM**: 230104040207
- **Kelas**: TI23A
- **Mata Kuliah**: Web Service Engineering
- **Dosen Pengampu**: Muhayat, M.IT

---

## 📝 Deskripsi Project

Project ini merupakan kelanjutan dari **UTS Web Service Engineering** dengan penambahan fitur:
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Logging System** (Morgan)
- **Monitoring Endpoints** (Health Check & Metrics)
- **Global Error Handler**
- **Environment Variables** (.env)

Resource yang digunakan: **Movies** (title, genre, year)

---

## 🛠️ Tech Stack

| Kategori | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Security | helmet, cors, express-rate-limit |
| Logging | morgan |
| Environment | dotenv |
| Testing | Postman |

---

## 📂 Struktur Folder

```
P7-Hardening-230104040207/
├── src/
│   ├── controllers/
│   │   └── movieController.js
│   ├── routes/
│   │   └── movieRoutes.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── data/
│   │   └── movies.js
│   ├── logs/
│   │   └── access.log (auto-generated)
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Cara Instalasi

### 1. Clone atau Download Project
```bash
git clone <repository-url>
cd P7-Hardening-230104040207
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy file .env.example menjadi .env
cp .env.example .env

# Edit file .env sesuai kebutuhan
nano .env
```

### 4. Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di: `http://localhost:3000`

---

## 🔐 Konfigurasi Environment Variables

File `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# API Info
API_VERSION=1.0.0
API_NAME=Movies RESTful API with Security
AUTHOR_NAME=Lira Anggraini
AUTHOR_NIM=230104040207
```

---

## 📡 Daftar Endpoint

### 1. Resource Movies (CRUD)

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| GET | `/api/movies` | Mendapatkan semua data movies | 200 |
| GET | `/api/movies/:id` | Mendapatkan movie berdasarkan ID | 200 / 404 |
| POST | `/api/movies` | Menambah movie baru | 201 / 400 |
| PUT | `/api/movies/:id` | Mengubah movie berdasarkan ID | 200 / 400 / 404 |
| DELETE | `/api/movies/:id` | Menghapus movie berdasarkan ID | 204 / 404 |

### 2. Monitoring & Information

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| GET | `/api/info` | Informasi service dan endpoints | 200 |
| GET | `/api/health` | Status kesehatan API | 200 |
| GET | `/api/metrics` | Metrics dan statistik API | 200 |

### 3. Error Handling

| Method | Endpoint | Deskripsi | Status Code |
|--------|----------|-----------|-------------|
| ANY | `/api/*` (tidak terdaftar) | Handler 404 global | 404 |
| ERROR | Internal error | Global error handler | 500 |

---

## 📝 Contoh Request & Response

### GET /api/movies
**Request:**
```http
GET http://localhost:3000/api/movies
Content-Type: application/json
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "genre": "Drama",
      "year": 1994
    },
    {
      "id": 2,
      "title": "The Godfather",
      "genre": "Crime",
      "year": 1972
    }
  ]
}
```

---

### GET /api/movies/:id
**Request:**
```http
GET http://localhost:3000/api/movies/1
Content-Type: application/json
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "The Shawshank Redemption",
    "genre": "Drama",
    "year": 1994
  }
}
```

**Response (404):**
```json
{
  "status": "fail",
  "message": "Movie dengan id 999 tidak ditemukan"
}
```

---

### POST /api/movies
**Request:**
```http
POST http://localhost:3000/api/movies
Content-Type: application/json

{
  "title": "Avengers: Endgame",
  "genre": "Action",
  "year": 2019
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Movie berhasil ditambahkan",
  "data": {
    "id": 6,
    "title": "Avengers: Endgame",
    "genre": "Action",
    "year": 2019
  }
}
```

**Response (400) - Validation Error:**
```json
{
  "status": "fail",
  "message": "Field 'title' wajib diisi"
}
```

---

### PUT /api/movies/:id
**Request:**
```http
PUT http://localhost:3000/api/movies/1
Content-Type: application/json

{
  "title": "The Shawshank Redemption (Remastered)",
  "genre": "Drama",
  "year": 1994
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Movie berhasil diupdate",
  "data": {
    "id": 1,
    "title": "The Shawshank Redemption (Remastered)",
    "genre": "Drama",
    "year": 1994
  }
}
```

---

### DELETE /api/movies/:id
**Request:**
```http
DELETE http://localhost:3000/api/movies/1
Content-Type: application/json
```

**Response (204):**
```
No Content
```

---

### GET /api/info
**Request:**
```http
GET http://localhost:3000/api/info
Content-Type: application/json
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "serviceName": "Movies RESTful API with Security",
    "version": "1.0.0",
    "description": "RESTful API untuk manajemen data film dengan security & monitoring",
    "author": "Lira Anggraini",
    "nim": "230104040207",
    "environment": "development",
    "endpoints": {
      "GET /api/movies": "Mendapatkan semua data movies",
      "GET /api/movies/:id": "Mendapatkan movie berdasarkan ID",
      "POST /api/movies": "Menambah movie baru",
      "PUT /api/movies/:id": "Mengupdate movie berdasarkan ID",
      "DELETE /api/movies/:id": "Menghapus movie berdasarkan ID",
      "GET /api/info": "Informasi service",
      "GET /api/health": "Health check endpoint",
      "GET /api/metrics": "Service metrics dan monitoring"
    },
    "security": {
      "helmet": "enabled",
      "cors": "enabled",
      "rateLimit": "100 requests per 15 minutes"
    }
  }
}
```

---

### GET /api/health
**Request:**
```http
GET http://localhost:3000/api/health
Content-Type: application/json
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Service is running healthy",
  "data": {
    "uptime": {
      "days": 0,
      "hours": 0,
      "minutes": 5,
      "seconds": 30
    },
    "timestamp": "2025-12-17T08:30:45.123Z",
    "environment": "development"
  }
}
```

---

### GET /api/metrics
**Request:**
```http
GET http://localhost:3000/api/metrics
Content-Type: application/json
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "totalRequests": 42,
    "averageRequestsPerSecond": "0.14",
    "uptime": {
      "seconds": 330,
      "formatted": "0h 5m 30s"
    },
    "memory": {
      "used": "25.45 MB",
      "total": "32.10 MB"
    },
    "timestamp": "2025-12-17T08:30:45.123Z"
  }
}
```

---

## 🔒 Fitur Keamanan

### 1. Helmet
Menambahkan HTTP security headers secara otomatis:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

### 2. CORS (Cross-Origin Resource Sharing)
Membatasi akses API hanya dari origin yang diizinkan:
```javascript
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Rate Limiting
Membatasi jumlah request per IP:
- **Window**: 15 menit (900000 ms)
- **Max Requests**: 100 request per window
- Response jika limit tercapai: 429 Too Many Requests

---

## 📊 Logging System

### Morgan Logging
Semua HTTP request dicatat dengan format:
- **Console**: Format `dev` (colored output)
- **File**: Format `combined` di `src/logs/access.log`

Contoh log:
```
::1 - - [17/Dec/2025:08:30:45 +0000] "GET /api/movies HTTP/1.1" 200 256
::1 - - [17/Dec/2025:08:31:12 +0000] "POST /api/movies HTTP/1.1" 201 145
::1 - - [17/Dec/2025:08:32:03 +0000] "DELETE /api/movies/1 HTTP/1.1" 204 -
```

---

## 🛡️ Error Handling

### Global Error Handler
Menangani semua error secara terpusat dengan format konsisten:

**Development Mode:**
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Error message here",
  "stack": "Error stack trace..."
}
```

**Production Mode:**
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

### 404 Handler
Endpoint yang tidak terdaftar:
```json
{
  "status": "fail",
  "message": "Endpoint tidak ditemukan"
}
```

---

## ✅ Penerapan 7 RESTful Principles

| No | Prinsip | Implementasi |
|----|---------|--------------|
| 1 | **Resource-Oriented URI** | `/api/movies` (kata benda jamak) |
| 2 | **Proper HTTP Methods** | GET, POST, PUT, DELETE sesuai fungsi |
| 3 | **Stateless Communication** | Tidak ada session/state di server |
| 4 | **Consistent Status Codes** | 200, 201, 204, 400, 404, 500 |
| 5 | **JSON Representation** | Semua response JSON konsisten |
| 6 | **Validation & Error Handling** | Validasi lengkap + global error handler |
| 7 | **Discoverability** | `/api/info`, `/api/health`, `/api/metrics` |

---

## 📸 Screenshot Testing

### 1. GET /api/info
![GET /api/info](screenshots/01-get-api-info.png)

### 2. GET /api/health
![GET /api/health](screenshots/02-get-api-health.png)

### 3. GET /api/metrics
![GET /api/metrics](screenshots/03-get-api-metrics.png)

### 4. GET /api/movies
![GET /api/movies](screenshots/04-get-all-movies.png)

### 5. GET /api/movies/:id
![GET /api/movies/:id](screenshots/05-get-movie-by-id.png)

### 6. POST /api/movies
![POST /api/movies](screenshots/06-post-movie.png)

### 7. PUT /api/movies/:id
![PUT /api/movies/:id](screenshots/07-put-movie.png)

### 8. DELETE /api/movies/:id
![DELETE /api/movies/:id](screenshots/08-delete-movie.png)

### 9. GET /api/movies/999 (404)
![GET /api/movies/999](screenshots/09-get-movie-not-found.png)

---

## 🧪 Testing dengan Postman

### Import Collection
1. Buka Postman
2. Klik **Import**
3. Pilih **Raw text**
4. Paste Postman Collection JSON (ada di folder `/postman`)
5. Klik **Import**

### Urutan Testing
1. GET `/api/info` → Cek metadata API
2. GET `/api/health` → Cek status kesehatan
3. GET `/api/metrics` → Cek metrics awal
4. GET `/api/movies` → Lihat semua data
5. GET `/api/movies/1` → Cek data by ID
6. POST `/api/movies` → Tambah data baru
7. PUT `/api/movies/1` → Update data
8. DELETE `/api/movies/1` → Hapus data
9. GET `/api/movies/999` → Test 404

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🔍 Validasi Input

Field yang wajib diisi pada POST/PUT:

| Field | Tipe | Validasi | Error Message |
|-------|------|----------|---------------|
| `title` | String | Required | "Field 'title' wajib diisi" |
| `genre` | String | Required | "Field 'genre' wajib diisi" |
| `year` | Number | Required, 1800-2030 | "Field 'year' wajib diisi" |

---

## 📈 Monitoring & Observability

### Health Check
Endpoint `/api/health` menyediakan:
- Uptime server (days, hours, minutes, seconds)
- Timestamp saat ini
- Environment mode (development/production)

### Metrics
Endpoint `/api/metrics` menyediakan:
- Total requests yang telah diterima
- Average requests per second
- Server uptime
- Memory usage (heap used & total)
- Timestamp

### Logging
File log tersimpan di `src/logs/access.log`:
- Semua HTTP request tercatat
- Format: Combined log format
- Rotation: Manual (bisa ditambahkan rotate system)

---

## 🚨 Troubleshooting

### Server tidak bisa start
```bash
# Pastikan port 3000 tidak digunakan
lsof -i :3000
kill -9 <PID>
```

### Rate limit error
```bash
# Tunggu 15 menit atau restart server
# Atau ubah RATE_LIMIT_MAX_REQUESTS di .env
```

### CORS error
```bash
# Tambahkan origin Anda di .env
ALLOWED_ORIGINS=http://localhost:3000,http://your-origin.com
```

### Log file tidak terbuat
```bash
# Pastikan folder logs ada
mkdir -p src/logs
# Restart server
npm run dev
```

---

## 📚 Referensi

- [Express.js Documentation](https://expressjs.com/)
- [Helmet.js Security](https://helmetjs.github.io/)
- [Morgan Logger](https://github.com/expressjs/morgan)
- [REST API Best Practices](https://restfulapi.net/)

---

## 👨‍💻 Author

**Lira Anggraini**  
NIM: 230104040207  
Kelas: TI23A

---

## 📄 License

This project is created for educational purposes - Web Service Engineering Course
<img width="1919" height="1018" alt="Screenshot 2025-12-17 155421" src="https://github.com/user-attachments/assets/9120cbf8-45f3-43a2-bb66-54202d40b528" />
<img width="1919" height="1022" alt="Screenshot 2025-12-17 155427" src="https://github.com/user-attachments/assets/b330e413-7716-4e6b-8b7a-bbaee5ed5df7" />
<img width="1919" height="1021" alt="Screenshot 2025-12-17 155432" src="https://github.com/user-attachments/assets/d8f5a1fa-d6e3-4d11-b4bb-51a59a3946fa" />
<img width="1919" height="1018" alt="Screenshot 2025-12-17 155437" src="https://github.com/user-attachments/assets/8ecebde0-4667-43eb-9106-c1aeb8001577" />
<img width="1919" height="1020" alt="Screenshot 2025-12-17 155442" src="https://github.com/user-attachments/assets/6a8b3b48-eab0-4522-8ac0-e56f6e89ab0e" />
<img width="1919" height="1021" alt="Screenshot 2025-12-17 155447" src="https://github.com/user-attachments/assets/a9c7209d-1621-48c5-b169-d18b3b72687e" />
<img width="1919" height="1020" alt="Screenshot 2025-12-17 155452" src="https://github.com/user-attachments/assets/21cf37bf-474b-4b06-9310-592f6ef866ee" />
<img width="1919" height="1021" alt="Screenshot 2025-12-17 155458" src="https://github.com/user-attachments/assets/13f730ab-77d6-41ad-bfa2-579084891ec6" />




---

**© 2025 - Praktikum 7 Web Service Engineering**
