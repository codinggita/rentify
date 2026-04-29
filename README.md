# 🗝️ Rentify: The All-in-One Rental Ecosystem

**Rentify** is a premium, full-stack property management platform designed with a **"Trust First"** philosophy. It bridges the gap between Owners, Tenants, Service Providers, and Inspectors through a seamless, automated, and highly secure digital environment.

---

## 🏗️ System Architecture
Rentify is built on a modern **MERN** stack with a focus on real-time event-driven communication and role-based access control (RBAC).

*   **Backend**: Node.js & Express using a modular **Controller-Service-Route** pattern.
*   **Frontend**: React.js with **Redux Toolkit** for centralized state management.
*   **Database**: MongoDB with Mongoose ODM for flexible yet structured data modeling.
*   **Real-Time**: Socket.io for instant notifications and live dashboard updates.

---

## 🔐 Advanced Authentication System
Rentify features one of the most comprehensive authentication systems available:

### 1. Multi-Provider Login
*   **Standard Auth**: Traditional Email/Password with Bcrypt salting (10 rounds).
*   **Google OAuth**: Seamless social login integration.
*   **Email OTP**: Passwordless login via 6-digit codes sent through Nodemailer (Gmail SMTP).
*   **Firebase Phone Auth**: High-security mobile verification.

### 2. Intelligent Rate Limiting (The "330 Rule")
To prevent API abuse and manage costs, we implemented a custom backend monitor:
*   **Global SMS Cap**: The system tracks every SMS sent via Firebase. 
*   **Automatic Cutoff**: Once the platform reaches **330 SMS messages in a 24-hour period**, the backend automatically disables Phone OTP and redirects users to Email OTP to ensure zero service interruption.
*   **Email Throttling**: Limits users to 5 OTP requests per hour per email address to prevent spam.

### 3. Test Credentials
Use these pre-seeded accounts to explore the various role-based dashboards:

| Role | Username (Login) | Password |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `arjun.admin` | `adminpassword` |
| 🏠 **Owner** | `priya.mehta` | `password123` |
| 🏘️ **Tenant** | `amit.kumar` | `password123` |
| 🔍 **Inspector** | `deepak.rao` | `password123` |
| 🔧 **Service** | `suresh.mistry` | `password123` |

---

## 🎭 Role-Specific Ecosystems
Rentify isn't just one app; it's five apps in one. Each role has a completely unique interface and logic set.

### 🏠 The Owner Experience
Designed for portfolio growth and effortless management.
*   **Property Hub**: List new properties with detailed specs and images.
*   **Financial Analytics**: Real-time tracking of total revenue, pending rent, and maintenance expenses.
*   **Lease Management**: Digital tracking of active tenants and lease expiration dates.
*   **Asset Overview**: Quick-glance status (Occupied vs. Vacant) for every unit.

### 🔑 The Tenant (Renter) Experience
Focused on convenience and "living better."
*   **Property Discovery**: Interactive listing page to find the perfect home.
*   **Maintenance Portal**: Submit repair requests with photos and track technician progress in real-time.
*   **Payment History**: View all past rent payments and upcoming dues.
*   **Digital Keys**: Instant access to lease documents and property rules.

### 🛠️ The Service Provider Network
A professional tool for technicians and contractors.
*   **Job Queue**: View all assigned maintenance tickets sorted by priority (Critical, High, Medium).
*   **Status Management**: Update jobs from "Pending" to "In Progress" to "Completed" with one tap.
*   **Property Navigation**: Access property locations and contact info for efficient site visits.

### 🔍 The Inspector's Audit Vault
The professional standard for property safety.
*   **Digital Audits**: Structured walkthroughs for safety, cleanliness, and structural integrity.
*   **Audit Vault**: A secure history of all past inspections per property.
*   **Compliance Tracking**: Mark properties as "Verified" or "Action Required" based on audit results.

### 🛡️ The Admin Command Center
Global governance for the entire platform.
*   **User Management**: Monitor and manage all user accounts across all roles.
*   **System Analytics**: Global stats on total transactions and platform growth.
*   **Security Logs**: Real-time monitoring of authentication events and potential risks.

---

## 🤖 WhatsApp Automation Bot (`whatsapp-web.js`)
Rentify includes a server-side "Concierge" bot that creates a high-touch user experience without manual work.

*   **Zero-Cost Setup**: Uses your existing phone via QR code scanning—no expensive Meta Business API required.
*   **Context-Aware Messaging**:
    *   **Tenants**: Get a "Welcome Home" message with digital key info.
    *   **Owners**: Get a "Business Mode" message about portfolio setup.
    *   **Service/Inspectors**: Receive onboarding details for the professional network.
*   **Auto-Trigger**: Fires instantly upon successful registration via traditional signup or OTP.

---

## 📡 Real-Time Notification Engine
Powered by **Socket.io**, the platform keeps everyone in sync:
*   **Owner Alerts**: Notified instantly when a tenant submits a maintenance request.
*   **Service Alerts**: Notified when a new job is assigned to them.
*   **Status Sync**: Dashboards update live without needing a page refresh when data changes.

---

## 🚀 Installation & Developer Guide

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account
*   Firebase Project (for Phone Auth)
*   Gmail Account (for Email OTP)

### Backend Configuration (`backend/.env`)
```env
PORT=5001
MONGODB_URI=your_uri
JWT_SECRET=your_secret
GMAIL_USER=your_email
GMAIL_APP_PASSWORD=your_app_password
FIREBASE_PROJECT_ID=...
```

### Frontend Configuration (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
VITE_FIREBASE_CONFIG=...
```

---

### 🧪 Database Seeding
To populate the database with the test accounts and sample properties, run the following command in the `backend` directory:
```bash
npm run seed
```

---

## 🧪 Testing the WhatsApp Bot
1.  Start the backend: `npm run dev`.
2.  Look for the **QR Code** in your terminal.
3.  Scan it with your phone (**WhatsApp > Linked Devices**).
4.  The terminal will log `✅ Rentify Bot Ready`.
5.  Sign up as a new user to receive your first automated message!

---

**Built with ❤️ by [Your Name] for the future of Real Estate.**
