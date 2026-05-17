# 🌐 Career Grid - Online Job Portal

Career Grid is a professional, high-fidelity online job portal built using the MERN stack (MongoDB, Express, React, Node.js). Designed for seamless recruitment workflows, it connects ambitious jobseekers with verified organizations, offering high-end features such as an ATS-friendly resume builder, inline PDF application reviews, and automated secure OTP verification.

---

## 🚀 Key Features

### 💻 Gorgeous, Modern UI/UX
* **Stunning Design Aesthetics**: Refined glassmorphism, mesh-gradient backdrops, 3D perspective hero interactions, and smooth CSS micro-animations.
* **Responsive Layouts**: Designed mobile-first, ensuring top-tier visual performance across monitors, tablets, and mobile devices.
* **Rich Interactions**: Hover states with shimmer glows, spring-like translation effects on buttons/cards, and brand integration.

### 🛡️ Secure OTP-Based Onboarding
* **Temporary Registration Holding**: Rather than writing unverified users directly into the main `Users` database and throwing duplicate errors on retry, registration details are kept in a highly secure, auto-expiring `OTP` collection.
* **Verification Gate**: The user account is only committed to the core database once the correct 6-digit OTP is verified.
* **Automatic Expiration**: Pending verifications automatically self-delete after 10 minutes, protecting database space and allowing immediate sign-up retries.

### 🏢 Two-Step Organization Approval Workflow
1. **Verification**: Employer registers and verifies their email via OTP.
2. **Admin Holding State**: The account is created with `isApproved: false`. Logins and job postings are blocked, presenting a professional holding message.
3. **Approval**: Admin reviews and approves the company.
4. **Welcome Email**: On approval, the system fires a premium, branded welcome email, unlocking the employer's dashboard.

### 📄 Integrated Resume & PDF Engine
* **Cloudinary Storage**: Fast, secure cloud uploads for PDFs and profile pictures.
* **Inline Document Viewer**: Completely customized routing logic ensures that applicants' resumes open inline seamlessly inside the browser rather than forcing a file download.

---

## 🛠️ Tech Stack

| Tier | Technology | Key Usage |
| :--- | :--- | :--- |
| **Frontend** | React / Vite | Ultra-fast page rendering & bundling |
| **Styling** | Tailwind CSS / Vanilla CSS | Rich modern styling system, custom perspective effects & keyframes |
| **Icons** | Lucide React | Clean, scalable vector iconography |
| **Backend** | Node.js / Express | Fast, scalable asynchronous API server |
| **Database** | MongoDB / Mongoose | Scalable Document Database (indexing, TTL-expires on OTPs) |
| **Mailing** | Nodemailer | Transactional Gmail SMTP services with connection-fault timeout configurations |
| **Storage** | Cloudinary | Asset storage & optimized inline PDF serving |

---

## 📁 Project Structure

```bash
Career-JobPortal/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/    # Reusable structural components
│   │   ├── context/       # Auth & Global States
│   │   ├── pages/         # High-fidelity pages (Home, Login, Register, Dashboards)
│   │   └── utils/         # Image & PDF helper upload modules
│   ├── tailwind.config.js  # Styling overrides
│   └── package.json
│
└── server/                 # Express Backend Server
    ├── controllers/        # Route controllers (User, Job operations)
    ├── models/             # Schema definitions (User, Job, OTP collections)
    ├── routes/             # REST endpoints (/api/users, /api/jobs)
    ├── utils/              # Email templates, Token generator, SMTP transport
    └── server.js           # Server bootstrap
```

---

## ⚙️ Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/soumyajiitdas/CareerGrid-JobPortal.git
cd CareerGrid-JobPortal

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the **`server`** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key

# Nodemailer Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-gmail-app-password

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```



### 3. Run Locally

Open two terminal sessions or run background tasks:

```bash
# Start Backend API Server (from /server)
npm start

# Start Frontend Dev Server (from /client)
npm run dev
```

Your portal will be live at `http://localhost:5173` (Vite dev port) and talk to the backend at `http://localhost:5000`.

---

## 📧 Email Notifications Architecture

Our automated email transaction module uses optimized, responsive HTML/CSS layouts that feature clean styling:

* **OTP Verification Email**: Standardized layout with code highlighting, expiration warnings, and dynamic company branding.
* **Welcome Email (Jobseekers)**: Received immediately upon email verification. Leads jobseekers directly into profile configuration.
* **Approval Welcome Email (Employers)**: Fires once the administrator updates the organization's approval status in the system, inviting them to start posting jobs.

---

## 🤝 Contributing & Licensing

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details. 

Contributor: [Soumyajit Das](https://github.com/soumyajiitdas)
