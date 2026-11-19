# VG-3D Modelers & Railway Simulations

> **High-Precision 3D Models & Rolling Stock for Open Rails and Microsoft Train Simulator (MSTS)**  
> Inspired by and built to 1:1 visual match [VG-3D Modelers & Railway Simulations](https://www.vg3dmodelersandrailwaysimulations.com/).

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-003B57?style=flat&logo=sqlite)](https://sqlite.org/)

---

## 🚂 Overview

**VG-3D Modelers & Railway Simulations** is a complete, production-ready full-stack web application designed for railway simulation enthusiasts and 3D rolling stock creators. It accurately reproduces the visual identity, authentic typography, page layouts, navigation structure, and user experience of the original Wix reference website, while providing a modern, scalable full-stack Next.js architecture with database management, secure authentication, e-commerce shopping cart, payment integration, digital downloads, and an admin management dashboard.

---

## ✨ Features

### 1. Authentic Typography & Design System
- **Authentic Font Files**: Uses original WOFF2 font files (`futura-lt-w01-book`, `futura-lt-w01-light`, `helvetica-w01-bold`, `helvetica-w01-roman`, `avenir-lt-w01_35-light`).
- **Wix Header Structure**: Authentic 2-tier header (~198px height) with top branding tier (130px) and bottom navigation tier (68px).
- **Exact Color Palette**: Centralized CSS custom properties in `src/styles/design-tokens.css` with sampled colors (`#041229` Navy, `#38D300` Green, `#d32f2f` Red, `#9ac7f7` Sky Blue, `#d9d9d9` Soft Gray).
- **Wix Content Container**: 980px max-width content container matching the reference website geometry.
- **Fully Responsive**: Verified across Desktop (1920×1080), Laptop (1366×768), Tablet (768×1024), and Mobile (390×844).

### 2. Complete Pages & Layouts
- **Home (`/`)**: Red marquee ticker, "Home: Products - 11x" headline, search bar, showcase carousel with captions, and WhatsApp contact link.
- **Projects (`/projects`)**: Navy hero with 56px heading, 20px intro paragraph, numbered sections 01–07 with 438px posters, Naini bridge route showcase, and legal disclaimers.
- **About (`/about`)**: Varun Ganesh founder bio, modeler journey, and `#9ac7f7` sky-blue section featuring white-bordered coach renders.
- **Services (`/services`)**: "What We Offer" section + `#d9d9d9` soft-gray section detailing 6 key simulation capabilities.
- **Contact (`/contact`)**: Founder contact cards and interactive "Let's Chat" enquiry form connected to SQLite database.
- **Shop (`/shop`)**: Sub-bar notice, red marquee ticker, 4-column product grid with 16px bold titles, strikethrough regular prices, and sale prices.
- **Downloads (`/downloads`)**: Gate member login dialog matching Wix layout, and downloadable library when authenticated.
- **Legal Pages**: Terms & Conditions (`/terms-and-conditions`), Privacy Policy (`/privacy-policy`), and EULA (`/eula`).

### 3. Full-Stack E-Commerce & Backend
- **Shopping Cart & Checkout**: Slide-out cart drawer, coupon code validation, and multi-step checkout.
- **Payment Processing**: Simulator payment mode for testing, ready for Razorpay (India & UPI) and Stripe (International).
- **Digital Entitlements**: Automatic digital download link generation upon payment confirmation.
- **Admin Dashboard (`/admin`)**: Manage products, projects, orders, customer enquiries, and website settings.
- **Role-Based Auth**: Secure JWT-based authentication with bcrypt password hashing and HTTP-only cookies.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **UI & Styling**: [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/) (configurable for PostgreSQL)
- **Authentication**: JWT (`jsonwebtoken`) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Payments**: Razorpay & Stripe SDK integration ready + Built-in Simulator
- **Animation**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/tirtheshbari18/https-www.vg3dmodelersandrailwaysimulations.com-.git
cd https-www.vg3dmodelersandrailwaysimulations.com-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Ensure `.env` contains:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_EMAIL="admin@vg3dmodelers.com"
ADMIN_PASSWORD="Admin@VG3D#2025"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding

```bash
# Push schema to SQLite
npm run prisma:push

# Seed products, projects, admin account, and default settings
npm run prisma:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@vg3dmodelers.com` | `Admin@VG3D#2025` | Full access (`/admin`, products, orders, enquiries) |
| **Demo User** | `passenger@vg3dmodelers.com` | `Passenger@2025` | Customer access (`/account`, `/downloads`) |

---

## 📦 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Database models (User, Product, Project, Order, etc.)
│   ├── seed.js             # Seed data with 8 rolling stock products & 7 projects
│   └── dev.db              # Pre-seeded SQLite database
├── public/
│   ├── assets/             # Railway product renders, coach images & branding
│   ├── fonts/              # Authentic WOFF2 font files (Futura LT, Helvetica, Avenir)
│   └── downloads/          # Sample downloadable simulator ZIP/RAR packages
├── src/
│   ├── app/                # Next.js App Router (pages and API routes)
│   │   ├── api/            # Server-side API endpoints (auth, products, orders, etc.)
│   │   ├── admin/          # Admin management dashboard
│   │   ├── projects/       # Projects showcase page
│   │   ├── shop/           # Shop catalog and product details
│   │   ├── downloads/      # Digital downloads portal
│   │   └── globals.css     # Global styles & @font-face declarations
│   ├── components/         # Reusable UI components (Navbar, Footer, Cart, Modals)
│   ├── lib/                # Database client, auth utilities, payment helpers
│   └── styles/
│       └── design-tokens.css # Centralized CSS variables for fonts, colors & spacing
├── package.json
└── tailwind.config.ts
```

---

## 📄 License & Credits

- **Original Website & Brand Reference**: [VG-3D Modelers & Railway Simulations](https://www.vg3dmodelersandrailwaysimulations.com/) operated by Varun Ganesh.
- **Digital 3D Rolling Stock**: LHB Coaches, Vistadome, WAP-7, WDP-4D models and liveries are digital artistic representations for Open Rails & MSTS train simulator enthusiasts.
