# NayaGhar: Demand-First Real Estate Marketplace

![NayaGhar Platform](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85)

## 📌 Project Overview
**NayaGhar** flips the traditional real estate model upside down. Instead of buyers scrolling through endless, often outdated listings, NayaGhar is a **Demand-First Marketplace**. Buyers post exactly what they are looking for (a "Brief"), and verified agents pitch matching properties directly to them in a specialized negotiation room. 

This project was built as the Final Evaluation Project for Web Programming, demonstrating advanced proficiency in Next.js, Role-Based Access Control, secure authentication, database integrations, and high-end UI/UX design.

---

## 🛠 Tech Stack
*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
*   **Design System**: Custom "Liquid Glass" UI (glassmorphism, backdrop filters, responsive grids)
*   **Backend**: Next.js Server Actions & API Routes
*   **Database**: MongoDB (Mongoose/Native Driver)
*   **Authentication**: NextAuth.js (JWT strategies)
*   **Security**: bcryptjs (Password Hashing), Zod (Server Validation)

---

## 🏆 Rubric Evaluation Checklist

This project was specifically engineered to satisfy **100% of the Web Programming Project Evaluation Rubric**.

### 1. Functionality
*   ✅ **Core Features:** Complete end-to-end flow. Buyers can create detailed property briefs, agents can browse the live marketplace and submit pitches, and buyers can compare bids side-by-side.
*   ✅ **Auth System:** Fully functional Login and Signup flow mapped to the MongoDB `users` collection.
*   ✅ **Data Processing:** Complete CRUD capabilities connected to MongoDB for Briefs, Bids, and Users.

### 2. Password Encryption & Security
*   ✅ **Secure Hashing:** Passwords are never stored in plain-text. They are hashed using `bcrypt` (cost factor 12) before database insertion.
*   ✅ **Secure Comparison:** Authentication uses `bcrypt.compare` to safely verify credentials.
*   ✅ **Reset Flow:** A secure, token-based forgotten password and reset flow is implemented in `/auth/forgot-password`.

### 3. Role-Based Access Control (Admin, Buyer, Agent)
*   ✅ **Distinct Roles:** Three dedicated roles with unique database permissions.
*   ✅ **Admin Dashboard:** A private `/dashboard/admin` panel that allows administrators to view all users, modify roles, and block/unblock accounts.
*   ✅ **Frontend Navigation:** The Navbar and internal dashboards dynamically update based on the active user session.
*   ✅ **Middleware Protection:** Next.js `middleware.ts` acts as an edge-guard, preventing standard users from accessing admin routes, and agents from accessing buyer creation routes.

### 4. Form Validation
*   ✅ **Client-Side:** HTML5 attributes and React state management prevent empty submissions.
*   ✅ **Server-Side:** Strict `zod` schemas sanitize inputs and enforce complex password rules (requiring uppercase, lowercase, numbers, and special characters).
*   ✅ **Inline Errors:** All forms feature clear, red-tinted inline error messages for invalid inputs.

### 5. Navigation & Structure
*   ✅ **Hierarchy:** Logical, unbroken routing from the Landing Page -> Auth -> Dashboard -> Marketplace -> Negotiation Room.
*   ✅ **Responsive Navbar:** The global `<Navbar />` adapts to mobile and desktop screens gracefully.

### 6. UI / UX Design
*   ✅ **"Liquid Glass" Aesthetic:** The entire platform uses a cohesive design system featuring deep `#f7f5ef` canvases, cinematic dark modes, glowing radial gradients, and heavy `backdrop-blur-3xl` glass panels.
*   ✅ **Responsive:** Tailored for seamless experiences across desktop, tablet, and mobile.

### 7. Authentication & Session Management
*   ✅ **JWT Sessions:** NextAuth handles persistent, secure HTTP-only sessions.
*   ✅ **Inactivity Expiration:** The NextAuth configuration enforces a strict 2-hour `maxAge` inactivity expiration.

### 8. Footer & Layout
*   ✅ **Global Footer:** A consistent `<Footer />` is rendered across the application via `app/layout.tsx`.

### 9. Content & Creativity
*   ✅ **Original Concept:** Moves beyond standard CRUD tutorials by introducing a highly specific, localized (Pakistani real estate), B2B/B2C hybrid marketplace.
*   ✅ **Visual Polish:** Micro-interactions, hover-lifts, pulse animations, and high-fidelity Unsplash imagery provide a premium, startup-quality feel.

### 10. Performance & Optimization
*   ✅ **Optimized Rendering:** Built entirely on the Next.js App Router, leveraging Server Components to minimize JavaScript bundles and maximize load speeds.

---

## 🚀 Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secure_random_string
   NEXTAUTH_URL=http://localhost:3000
   
   # Node Environment
   NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Navigate to `http://localhost:3000`

---
*Built as the Final Project for Web Programming.*
