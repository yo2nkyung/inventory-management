# Inventory Management Dashboard (Full-Stack)

A full-stack inventory management dashboard built with Next.js, Redux Toolkit, Node.js, Prisma, and AWS-focused architecture concepts.

This project demonstrates end-to-end development including frontend UI, backend API design, database modeling, and full-stack integration.

⚠️ This project is currently **work-in-progress** and actively being developed.

---

## Demo

### Dashboard Overview

| Dashboard | Inventory |
| :---: | :---: 
| ![Dashboard](./assets/dashboard_screenshot.png) | ![Inventory](./assets/inventory_page.png) |



## 🧭 Overview

The goal of this project is to design and implement a scalable inventory management system featuring:

- Data visualization dashboard
- Product inventory management
- API-driven frontend/backend architecture
- Database schema design using Prisma ORM
- Cloud-ready architecture (AWS-focused design)

---

## 🚀 Current Progress

### ✅ Implemented

- Dashboard visualization (charts implemented)
- Frontend (Next.js) ↔ Backend (Node.js API) integration completed
- Database schema and data modeling using Prisma
- Basic API routing and controller structure
- Redux Toolkit + RTK Query state/data management setup

### 🚧 In Progress

- Product creation functionality (currently debugging)
- Inventory page development
- Improved error handling and validation
- UI refinements

### 📌 Planned Features

- Pagination & filtering for product list
- Authentication / role-based access
- Cloud deployment (AWS EC2/RDS/S3)
- API performance optimization
- Logging and monitoring

---

## 🏗 Architecture

### Frontend

- Next.js
- Tailwind CSS
- Material UI Data Grid
- Redux Toolkit
- RTK Query

### Backend

- Node.js
- Express-style API architecture
- Prisma ORM

### Database

- Relational schema designed using Prisma models

### Cloud (Planned)

- AWS EC2
- AWS RDS
- AWS S3
- API Gateway

---

## 📂 Project Structure
```
root/
├── client/ # Next.js frontend
└── server/ # Node.js backend + Prisma
```

---

## ⚙️ Local Setup

### 1️⃣ Clone repository

```
git clone <repo-url>
```
### 2️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

### 3️⃣ Setup Backend
```
cd server
npm install
npx prisma migrate dev
npm run dev
```

### Environment Variables

Create `.env` files based on: `.env.example`


---

## 💡 Learning Goals

This project focuses on:

- Full-stack architecture understanding
- API-driven frontend development
- Database modeling best practices
- Production-oriented project structure
- Cloud-ready system design

---

## 📈 Roadmap

- [ ] Fix product creation bug
- [ ] Complete inventory management page
- [ ] Improve API validation
- [ ] Add pagination/filtering
- [ ] Deploy to AWS
