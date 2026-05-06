# NayaGhar - The Demand-First Real Estate Ecosystem

![NayaGhar Hero Banner](file:///Users/muhammadjawadali/.gemini/antigravity/brain/c61fb468-75f2-4ff9-aa89-d43819ef469b/nayaghar_hero_banner_1778092686904.png)

## 🌟 Overview

**NayaGhar** is a revolutionary real estate platform designed to flip the traditional property searching model on its head. In a market where buyers often spend months scrolling through irrelevant listings, NayaGhar introduces a **Demand-First Marketplace**.

Instead of agents posting properties and waiting for buyers, **buyers post their specific requirements (Briefs)**, and **verified agents bid** with tailored property matches from their exclusive portfolios. This creates a highly efficient, targeted, and results-driven ecosystem for all stakeholders.

---

## ✨ Key Features

### 👤 For Buyers
- **Demand Posting**: Create detailed "Property Briefs" specifying location, budget range, property type, and must-have amenities.
- **Smart Matching**: Receive bids only from agents who have properties that truly match your criteria.
- **Bid Management**: Review, compare, and accept bids through a streamlined dashboard.
- **Secure Account Control**: Manage profiles and security settings with a robust token-based password reset system.

### 💼 For Agents
- **Marketplace Access**: Browse a live feed of active buyer requirements.
- **Precision Bidding**: Submit bids with property details, pricing, and visual assets (images).
- **Activity Tracking**: Monitor your bids and engagement levels via a dedicated Agent Dashboard.
- **Verified Status**: Build trust through a platform that prioritizes professional accountability.

### 🛡️ For Administrators
- **User Management**: Activate, deactivate, or delete user accounts to maintain platform integrity.
- **Marketplace Oversight**: Monitor all active briefs and bids to ensure quality and compliance.
- **System Health**: View platform analytics and system-wide activity logs.
- **Role Control**: Seamlessly manage permissions and roles (Buyer, Agent, Admin).

---

## 🛠️ Technology Stack

NayaGhar is built using a modern, high-performance stack optimized for scalability and speed:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom Glassmorphism Design System.
- **Database**: [MongoDB](https://www.mongodb.com/) (Native Driver for maximum performance)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) (JWT-based session management)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Security**: Bcryptjs (12 salt rounds), Secure Token-based Reset Flow.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **MongoDB**: A running instance (Atlas Cluster or local MongoDB)
- **NPM**: v10.x or higher

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/nayaghar.git
   cd nayaghar
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory and populate it with the following:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXTAUTH_SECRET=your_32_character_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Initialize the Database**
   The application uses a dynamic schema. Upon your first signup, a `users` collection will be created automatically.

### Running Locally

```bash
# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 📂 Project Structure

```text
├── app/               # Next.js App Router (Pages, API, Layouts)
│   ├── (auth)/        # Authentication routes (Login, Signup, Reset)
│   ├── dashboard/     # Role-based dashboards (Admin, Agent, Buyer)
│   ├── marketplace/   # Public/Protected Marketplace feed
│   └── api/           # Backend API endpoints
├── components/        # Reusable UI components (Navbar, Footer, Cards)
├── lib/               # Shared utilities, actions, and DB logic
│   ├── actions/       # Server Actions (Auth, Admin, Property)
│   ├── db.ts          # MongoDB connection helper
│   └── auth.ts        # NextAuth configuration
├── models/            # Type definitions and schemas
├── public/            # Static assets
└── types/             # TypeScript interfaces and types
```

---

## 🛡️ Administrative Setup

To bootstrap an administrator account:
1. Sign up as a regular user via the web interface.
2. Access your MongoDB instance (via Compass or Atlas UI).
3. Find your user document in the `users` collection.
4. Manually update the `role` field from `"buyer"` to `"admin"`.
5. Log out and log back in to access the **Admin Command Center**.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for the future of Real Estate.
</p>
