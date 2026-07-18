# E-Commerce Website

A modern, feature-rich e-commerce platform built with React, Vite, and Supabase. Features a responsive design with Tailwind CSS, real-time inventory management, admin dashboard, and delivery tracking.

## Features

### CustomerFacing Features
- **Product Catalog**: Browse products with filtering and search
- **Product Details**: Detailed product views with image galleries
- **Shopping Cart**: Manage cart items with real-time updates
- **Checkout Process**: Multi-step checkout with address selection
- **Order Tracking**: Real-time order status updates with delivery tracking
- **User Profile**: Manage profile, saved addresses, and order history
- **Reviews & Ratings**: Submit and view product reviews
- **Mobile Responsive**: Full mobile support with bottom navigation

### Admin Dashboard
- **Dashboard**: Overview of store metrics and analytics
- **Products**: Manage product inventory and pricing
- **Categories**: Organize and manage product categories
- **Orders**: View and manage customer orders
- **Customers**: Manage customer accounts and view purchase history
- **Reviews**: Approve or reject customer reviews
- **Inventory**: Track stock levels and manage stock
- **Analytics**: Sales and business analytics
- **Settings**: Configure store settings and delivery zones

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **React Router v7** - Client-side routing
- **Zustand** - State management
- **Lucide React** - Icons
- **Motion (Framer Motion)** - Animations

### Backend & Services
- **Supabase** - Authentication and database
- **Express** - Backend server (for razorpay integration)


## Getting Started

### Prerequisites
- Node.js (v20.19.0 or v22.12.0+)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd E-Commerce-website
```

2. Install dependencies:
```bash
npm install
```


```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server on port 5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx       # Header navigation
│   ├── Footer.tsx       # Footer component
│   ├── ProductCard.tsx  # Product display card
│   ├── CategoryCard.tsx # Category display card
│   ├── LayoutOrchestrator.tsx # Theme and layout controls
│   ├── MobileBottomNav.tsx # Mobile navigation
│   ├── AdminLayout.tsx  # Admin dashboard layout
│   └── ToastContainer.tsx # Notification system
├── pages/               # Page components
│   ├── admin/           # Admin dashboard pages
│   └── [Public Pages]   # Customer-facing pages
├── store/               # Zustand state management
│   └── useStore.ts
├── lib/                 # Library utilities
│   └── supabaseClient.ts
├── services/            # API services
│   └── supabase.ts
├── utils/               # Utility functions
│   └── delivery.ts      # Delivery distance calculations
├── types.ts             # TypeScript type definitions
└── main.tsx             # Application entry point
```

## Configuration

### Theme Customization
The app supports multiple color themes (Emerald, Amber, Rose, Indigo, Lime) that can be configured through the UI.

### Store Settings
Admins can configure:
- Store name, contact info, and social media
- Payment settings (Razorpay, UPI QR)
- Delivery zones and pricing
- Tax percentages and free delivery thresholds

### Delivery Tracking
Uses Google Maps API to calculate delivery distances and charges based on proximity to the store.



The output will be in the `dist/` directory.


