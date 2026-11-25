# SalonBook

SalonBook is a full-stack salon appointment booking platform where customers can explore services, book appointments, and manage payments, while admins manage services, appointments, users, and transactions.

## Overview

The project is split into two parts:

- **Client:** Next.js App Router frontend (this repository)
- **Server:** Express + MongoDB API (`SalonBook server`) for services, appointments, JWT-protected APIs, and Stripe payment flow

## Features

### Public
- Modern landing page with banner, featured services, service categories, and how-it-works sections
- Browse active salon services with search, category filter, and sorting
- Service details page with booking flow
- Responsive UI with custom SalonBook theme
- Custom loading and 404 pages

### Authentication & Access
- Email/password authentication with Better Auth
- Google social sign-in/sign-up
- Protected routes via `proxy.ts` for `/dashboard/:path*` and `/services/:path+`
- JWT-protected backend APIs
- Role-based admin checks and banned-user restrictions
- Users can only access/manage their own appointment data

### User Dashboard
- Appointment summary: Total, Pending, Confirmed, Cancelled
- View own appointments and appointment details
- Cancel pending appointments
- Delete cancelled appointments
- Pay confirmed/unpaid appointments through Stripe Checkout
- Payment success verification flow

### Admin Dashboard
- Dashboard stats: customers, active services, appointment requests, pending/confirmed appointments, successful payments
- Add, update, delete, activate/deactivate services
- Image upload for services using ImageBB
- Manage appointment requests: confirm, complete, cancel (paid appointments cannot be cancelled)
- Mark unpaid appointments as paid (admin action)
- View registered users and block/unblock users
- View payment transactions

## Tech Stack

### Client
- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Better Auth](https://www.better-auth.com/) + MongoDB adapter
- [Base UI](https://base-ui.com/) / shadcn utilities
- [Lucide React](https://lucide.dev/)
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

### Server
- [Express 5](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT (`jsonwebtoken`)](https://github.com/auth0/node-jsonwebtoken)
- [Stripe](https://stripe.com/docs/api)
- [CORS](https://github.com/expressjs/cors)
- [dotenv](https://github.com/motdotla/dotenv)

## Project Structure

```text
salonbook/
├── public/                     # Static assets
├── src/
│   ├── app/                    # App Router pages/layouts
│   │   ├── api/auth/[...all]/  # Better Auth route handler
│   │   ├── dashboard/          # User/Admin dashboards
│   │   ├── services/           # Service listing & details
│   │   ├── sign-in/            # Sign in page
│   │   ├── sign-up/            # Sign up page
│   │   ├── payment/success/    # Stripe payment success verification
│   │   ├── loading.tsx         # Global loading UI
│   │   └── not-found.tsx       # 404 page
│   ├── components/             # UI and feature components
│   ├── lib/                    # Auth, JWT helper, utilities
│   └── proxy.ts                # Route protection
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm
- MongoDB database
- ImageBB API key (for service image upload)
- Google OAuth credentials (for Google sign-in)
- Stripe secret key (for payments)

### 1. Clone the Client Repository

```bash
git clone https://github.com/limoncodes/SalonBook.git
cd SalonBook
npm install
```

### 2. Configure Client Environment Variables

Create a `.env` file in the client root and add:

```env
# Better Auth / MongoDB
BETTER_AUTH_USERNAME_URL=your_mongodb_username
BETTER_AUTH_PASSWORD_URL=your_mongodb_password
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend API
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000

# ImageBB
NEXT_PUBLIC_IMAGEBB_API_KEY=your_imagebb_api_key
```

> Never commit `.env` files or secrets to Git.

### 3. Run the Client

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Setup and Run the Server

Clone the server repository separately:

```bash
git clone https://github.com/limoncodes/SalonBookserver.git
cd SalonBookserver
npm install
```

Create a `.env` file in the server root:

```env
PORT=5000
MONGODB_USERNAME_URL=your_mongodb_username
MONGODB_PASSWORD_URL=your_mongodb_password
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_BASE_URL=http://localhost:3000
```

Run the server:

```bash
npm run dev
```

The client expects the server at `NEXT_PUBLIC_SERVER_BASE_URL`.

## Available Scripts (Client)

```bash
npm run dev     # Start development server
npm run build   # Create production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Key Routes

### Public Routes
- `/` - Home page
- `/services` - Browse services
- `/services/[id]` - Service details and booking
- `/sign-in` - Sign in
- `/sign-up` - Sign up

### User Dashboard
- `/dashboard/user` - User overview
- `/dashboard/user/appointments` - User appointments
- `/dashboard/user/appointments/[id]` - Appointment details

### Admin Dashboard
- `/dashboard/admin` - Admin overview
- `/dashboard/admin/Add-Services` - Add/update services
- `/dashboard/admin/services` - Manage services
- `/dashboard/admin/appointments` - Manage appointments
- `/dashboard/admin/users` - Manage users
- `/dashboard/admin/transactions` - Payment transactions

## Payment Flow

1. User books a service and receives a pending appointment.
2. Admin confirms the appointment.
3. User pays via Stripe Checkout.
4. Stripe redirects to `/payment/success`.
5. Server verifies the Stripe session and marks the appointment as paid.
6. Admin can view successful payment records in transactions.

## Security Notes

- Backend APIs are protected with JWT middleware.
- Admin-only routes require admin role.
- Banned users are blocked from protected API access.
- User-owned appointment actions use token email identity, not trusted body/query email.
- Do not expose or commit `.env` secrets.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint/build checks
5. Open a pull request

## License

This project is for educational/portfolio use unless a license is added.