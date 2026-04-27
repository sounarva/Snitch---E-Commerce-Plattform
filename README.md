# 🛍️ Snitch - E-Commerce Platform

Welcome to the **Snitch E-Commerce Platform**! This is a modern, high-performance, full-stack e-commerce web application designed to deliver a seamless shopping experience for users and robust management capabilities for sellers.

---

## 🎯 Objective

The primary objective of *Snitch* is to build a premium, highly scalable, and user-friendly online shopping platform. It aims to bridge the gap between consumers and sellers by providing a robust backend architecture, intuitive frontend interfaces, and a secure checkout process. The platform is crafted with a focus on a high-end editorial aesthetic, performance optimization, and seamless user journeys.

---

## 🚀 Tech Stack

This project is built using a modern JavaScript/TypeScript ecosystem, divided into a robust backend and an interactive frontend.

### Frontend
- **Framework:** React (via Vite for blazing fast builds)
- **State Management:** Redux Toolkit & React-Redux
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 (Minimalist, dark/light mode premium aesthetics)
- **Icons:** Lucide React
- **API Client:** Axios
- **Payments:** React-Razorpay integration

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Caching:** Redis (via ioredis)
- **Authentication:** JWT (JSON Web Tokens), Passport.js (Google OAuth 2.0 & Local)
- **File Uploads:** Multer & ImageKit (for optimized image hosting and delivery)
- **Payments:** Razorpay Node.js SDK
- **Data Validation:** Express-Validator
- **Security & Utilities:** bcryptjs, cookie-parser, morgan

---

## ✨ Functionalities

- **User Authentication & Authorization:** Secure login/signup flows using email/password and *Google OAuth*.
- **Product Management:** Comprehensive CRUD operations for products, including dynamic variant additions (size, color) and image sliders.
- **Cart System:** Add to cart, dynamic price updates, and quantity management with real-time sync.
- **Checkout & Payments:** Secure payment gateway integration using *Razorpay* for processing orders.
- **Seller Dashboard:** Premium editor for adding and managing product variants, stock, and aesthetics.
- **Optimized Assets:** High-performance image loading using ImageKit.
- **Advanced Data Retrieval:** Leveraged MongoDB aggregation pipelines to efficiently extract and compute data across multiple collections, such as dynamically calculating the total price of the user's cart on the backend.

---

## 🏆 Minimum Viable Product (MVP)

The MVP for Snitch encompasses the core functionalities required for a user to successfully browse and purchase a product:
1. **User Registration & Login:** Allow users to create accounts securely.
2. **Product Catalog:** Display products with images, prices, sizes, and colors.
3. **Shopping Cart:** Enable users to add items, modify quantities, and calculate the total dynamically.
4. **Checkout Flow:** Capture shipping details and process payments securely via Razorpay.
5. **Order Confirmation:** Verify payments and convert the cart into a confirmed order.

---

## 📂 Folder Structure

The project follows a modular, feature-based architecture to maintain clean code and scalability.

```text
📦 Snitch
 ┣ 📂 Backend
 │  ┣ 📂 config        # Configuration files (Database, Redis, etc.)
 │  ┣ 📂 controllers   # Route handlers and business logic wrappers
 │  ┣ 📂 dao           # Data Access Object layer for database interactions
 │  ┣ 📂 middlewares   # Express middlewares (Auth, Multer, Error handling)
 │  ┣ 📂 models        # Mongoose schemas and models
 │  ┣ 📂 routes        # API route definitions (user, product, cart, order)
 │  ┣ 📂 services      # Core business logic
 │  ┣ 📂 validators    # Request validation logic
 │  ┣ 📜 app.js        # Express application setup
 │  ┣ 📜 server.js     # Server entry point
 │  ┗ 📜 package.json
 ┣ 📂 Frontend
 │  ┣ 📂 public        # Static assets
 │  ┣ 📂 src
 │  │  ┣ 📂 app        # Redux store setup
 │  │  ┣ 📂 assets     # Images, global styles
 │  │  ┣ 📂 data       # Mock data or constants
 │  │  ┣ 📂 features   # Feature-based slices (auth, cart, order, products)
 │  │  ┣ 📂 shared     # Reusable UI components
 │  │  ┣ 📂 svg        # SVG icons and graphics
 │  │  ┗ 📜 main.jsx   # React entry point
 │  ┣ 📜 index.html
 │  ┣ 📜 vite.config.js
 │  ┗ 📜 package.json
 ┗ 📜 README.md
```

---

## ⚙️ Getting Started

To run this project locally, follow these steps:

### Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas).
- Redis server running.
- Razorpay, Google OAuth, and ImageKit credentials.

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```
   *Create a `.env` file in the `Backend` directory with your required environment variables (e.g., MongoDB URI, JWT Secret, Razorpay keys, ImageKit keys, Google OAuth credentials).*

   *Start the backend server:*
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   ```
   *Create a `.env` file in the `Frontend` directory with necessary variables (e.g., Vite API URL).*

   *Start the frontend development server:*
   ```bash
   npm run dev
   ```

### 🌟 Usage
Once both servers are running, open your browser and navigate to the frontend URL (usually `http://localhost:5173`) to experience the platform!
