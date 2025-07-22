# 🗞️ Local News App

📍 **Live Demo**: [Local News App](http://react-spa-env.eba-uc9jfyjc.eu-central-1.elasticbeanstalk.com/)

A full-stack web application that delivers **local news** for **all U.S. cities**. Users can explore recent news filtered by city, with a clean UI and fast performance.

## 🧩 Project Structure

### 📦 Backend - [local-news (Spring Boot)](https://github.com/artem00611/local-news)

A RESTful API built using Java & Spring Boot that fetches and serves news articles from reliable sources based on city and category.

### 💻 Frontend - [local-news-fe (React)](https://github.com/artem00611/local-news-fe)

A responsive and modern frontend built with React. Users can browse local news by entering their city, selecting categories, and reading the latest headlines.

---

## 🚀 Features

- 🔎 Search news by **city**
- 📰 Filter by **news category**
- ⏱️ Display **latest headlines**
- 🌙 Dark mode support (frontend)
- 📦 REST API with clean DTOs
- 📄 Error handling for invalid inputs

---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 3.x
- Spring Web, Spring Security (optional)
- JPA / Hibernate
- PostgreSQL (or in-memory H2 for testing)
- JUnit 5 + Spring Boot Test
- GitHub Actions (CI/CD)

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router

---

## 📦 Getting Started

### 🔧 Backend Setup

```bash
git clone https://github.com/artem00611/local-news.git
cd local-news
./mvnw spring-boot:run
```

- API runs on: `http://localhost:8080`
- Swagger/OpenAPI (if enabled): `http://localhost:8080/swagger-ui.html`

> You may need to configure your database credentials in `application.yml`.

### 💻 Frontend Setup

```bash
git clone https://github.com/artem00611/local-news-fe.git
cd local-news-fe
npm install
npm run dev
```

- App runs on: `http://localhost:5173`

---

## 📄 API Endpoints (Example)

```
GET /api/news?city=NewYork&category=technology
```

- **200 OK**: Returns list of news articles
- **400 Bad Request**: If city is missing or malformed

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Created by **[Artem Senyshyn](https://github.com/artem00611)**

Feel free to reach out or contribute!
