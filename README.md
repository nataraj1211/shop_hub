# ShopHub - Flipkart-Style E-Commerce Web Application

A full-featured modern e-commerce platform built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Features

- **Flipkart-Style UI & Experience**:
  - Interactive categories navigation, banner carousels, and deals of the day
  - Product listing with live search, filters (price range, ratings, brands, category), and sorting
  - Detailed product page with image gallery, specs, customer reviews, and offers
  - Interactive shopping cart with quantity controls and real-time price calculations
  - Multi-step checkout with address details and multiple payment options (UPI, Card, COD)
  - Dedicated **Order Confirmation** screen with complete order invoice & delivery status
  - Customer **My Orders** tracking with order cancellation capabilities
  - **Admin Dashboard**:
    - Product catalog management (stock count, price editing)
    - **New Orders Alert & Management**: Live badge for incoming new orders, status tracking (Confirmed, Shipped, Delivered)
    - Sales revenue analytics and inventory health indicators

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open http://localhost:8080 in your browser
```

## Admin Access

- **Admin Login**:
  - Email: `admin@shophub.com`
  - Password: `admin123`
  - Role: `Seller / Admin`

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner Toast
