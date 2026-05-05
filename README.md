# NayaGhar - Demand-First Real Estate Marketplace

NayaGhar is a revolutionary real estate platform that flips the traditional model. Instead of agents posting properties and buyers searching, **buyers post their requirements (Briefs)** and **agents bid** with matching properties from their portfolio.

## 🚀 Features

- **Demand-First Marketplace**: Buyers post exactly what they want (location, budget, category).
- **Agent Bidding System**: Verified agents can see buyer requirements and submit matching property bids.
- **Real-Time Notifications**: Instant updates when a bid is placed or a brief is updated.
- **Role-Based Access Control (RBAC)**: Secure areas for Buyers, Agents, and Administrators.
- **Admin Command Center**: Complete oversight of users, marketplace activity, and system health.
- **Security First**: 
  - JWT-based session handling with NextAuth.
  - Password hashing via Bcrypt (salt rounds 12).
  - Secure token-based password reset flow.
  - CSRF and XSS protection via Next.js defaults and Zod validation.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Backend**: Next.js API Routes, MongoDB (Native Driver).
- **Authentication**: NextAuth.js.
- **Validation**: Zod.
- **Styling**: Glassmorphism UI, CSS-in-JS (styled-jsx).

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Instance (Atlas or Local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nayaghar.git
   cd nayaghar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🛡️ Admin Setup

To create an admin user, sign up via the interface and then manually update the `role` field to `admin` in your MongoDB `users` collection, or use the "Cycle Role" feature in the Admin User Management panel if you already have an admin account.

## 📄 License

This project is licensed under the MIT License.
