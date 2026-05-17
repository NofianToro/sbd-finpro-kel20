# KoiBite
KoiBite is a modern food ordering and recommendation platform that combines interactive food discovery with a restaurant ordering ecosystem. The platform allows users to discover foods through swipe interactions, save favorite foods, place orders, track deliveries, and interact with restaurant partners in a seamless full-stack application.
The system consists of two main roles:
* **User** → Discover foods, add favorites, checkout orders, and track deliveries.
* **Restaurant Partner** → Manage menus, update stock, process orders, and monitor restaurant performance.
KoiBite focuses on creating a more personalized and engaging food ordering experience compared to traditional food delivery platforms.
<img width="359" height="159" alt="image" src="https://github.com/user-attachments/assets/ce30e111-06c1-4d8d-872c-77946c8adc95" />

---

# Main Features
## User Features
* User Register & Login
* JWT Authentication
* Swipe-based Food Discovery
* Favorite Foods
* Food Search & Filtering
* Shopping Cart & Checkout
* Order Tracking
* Order History
* Top Up Balance
* Food Reviews & Ratings

## Restaurant Features
* Restaurant Register & Login
* Menu Management
* Food Stock Management
* Order Management
* Bill Management
* Restaurant Dashboard
* Order Status Tracking
* Restaurant Statistics

---

# Tech Stack
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge\&logo=postgresql\&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge\&logo=javascript\&logoColor=%23F7DF1E)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge\&logo=express\&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge\&logo=JSON%20web%20tokens)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge\&logo=node.js\&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge\&logo=react\&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge\&logo=next.js\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge\&logo=axios\&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge\&logo=figma\&logoColor=white)

---

# System Architecture

| Architecture      |
|-------------------|
|Frontend (Next.js) |
||
|  Axios API Layer  |
||
|Express.js Backend |
||
|  Repository Layer |
||
|PostgreSQL Database|
||

---

# Database Structure
## Main Tables
### `master_user`
Stores user account information.
### `master_restaurant`
Stores restaurant partner information.
### `food`
Stores food menu data.
### `favorit_user`
Stores user's favorite foods.
### `rating_review`
Stores food ratings and reviews.
### `order_header`
Stores main order information.
### `order_detail`
Stores ordered food items.
### `bills`
Stores payment and billing information.

---

# Diagram
## UML
<img width="815" height="598" alt="image" src="https://github.com/user-attachments/assets/a2c3d7b1-cf06-4ce9-a49e-8ece85b01b76" />

## ERD
<img width="623" height="478" alt="image" src="https://github.com/user-attachments/assets/2fbcf752-bc7d-4efe-8686-2014485cf774" />

## Flowchart
<img width="590" height="822" alt="image" src="https://github.com/user-attachments/assets/6ae4ff8a-3494-422b-81aa-62cdb32bd75f" />


---

# Authentication System
KoiBite uses JWT Authentication.
## Authentication Flow
1. User logs in.
2. Backend validates credentials.
3. JWT token is generated.
4. Token is stored in localStorage.
5. Protected routes use middleware authentication.

## Security Features
* Password hashing using bcrypt.
* JWT token verification.
* Role-based authorization.
* Rate limiter on authentication endpoints.

---

#  Checkout Flow
1. User selects foods.
2. Cart data stored in localStorage.
3. User performs checkout.
4. Backend creates:
   * Order Header
   * Order Detail
   * Bill
5. User balance is deducted.
6. User redirected to tracking page.

---

# Tracking System
The tracking system allows users to monitor their order progress.
## Order Status
* Waiting
* Accepted
* Delivery
* Done
Restaurant partners can update the order status through their dashboard.
Users can monitor:
* Order status
* Order items
* Estimated delivery time
* Payment summary

---

# Favorite System
Users can:
* Add favorite foods.
* Remove favorite foods.
* View favorite list.
Favorite data is stored in the `favorit_user` table.

---
#  Food Stock Management
Restaurant partners can update food stock dynamically.
## Logic
* Positive value → Add stock
* Negative value → Reduce stock
---

# 🖥️ Frontend Pages

## User Side
* `/homepage`
* `/login`
* `/register`
* `/checkout`
* `/tracking`
* `/profile`

## Restaurant Side
* `/partner-login`
* `/partner-register`
* `/partner-dashboard`
* `/partner-menu`
* `/partner-profile`
* `/partner-statistics`
---

# Installation Guide

## Clone Repository
```bash
git clone https://github.com/NofianToro/sbd-finpro-kel20
```

---

#  Frontend Setup
## Move to frontend folder
```bash
cd frontend
```

## Install dependencies
```bash
npm install
npm install axios
```

## Run frontend server

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:3000
```

---

# Backend Setup
## Move to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
npm install express
npm install cors
npm install helmet
npm install express-rate-limit
npm install jwt
```

## Create `.env` file
Like this:

```env
PORT=5000
JWT_SECRET=secret_key
PG_CONNECTION_STRING=postgresql_connection
```
You can get your postgrsql connection string by setting up your database in cloud db like neon. As for JWT SECRET token you get it from here: https://jwtsecrets.com/ or any other web that can generate random key to sign the JWT tokens

## Run backend server

```bash
npm run dev
```

Backend will run on:

```txt
http://localhost:5000
```
# Run guide
Run both frontend and backend together in different terminal:
```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Open frontend page, and you can explore from /register on user side and /partner-register from restaurant side.


---

# 📈 Future Improvements

* AI food recommendation engine
* Push notifications
* Payment gateway integration

---

# Contributors

## Kelompok 19

* Ade Zaskia
* Fauzan Arfa
* Michael Christian
* Nirmala Sari
---

This project is developed for academic purposes.
