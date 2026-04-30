# CampusSignal

CampusSignal is a full-stack web application built with NestJS, TypeORM,
MySQL, and a custom HTML/CSS/JavaScript UI.\
It allows users to report campus issues, submit suggestions, and
interact through comments, while admins manage content.

## Features

-   JWT Authentication
-   Role-based access (Admin/User)
-   Issue & Suggestion posting with images
-   Comments system
-   Admin dashboard
-   Profile page

## Setup Instructions

### 1. Clone Repository

git clone https://github.com/amper-hub/CampusSignal.git cd CampusSignal

### 2. Install Dependencies

npm install

### 3. Setup Database

Run in MySQL: CREATE DATABASE campussignal;

### 4. Create .env file

DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASS=
DB_NAME=campussignal JWT_SECRET=your_secret

### 5. Run Project

npm run start:dev

### 6. Open

http://localhost:3000

## Admin Account

Email: admin@gmail.com\
Password: Admin123
