# DriveX Architecture

## Project Vision
DriveX is a premium vehicle rental platform for cars, bikes, and scooters. The platform is designed for a luxury audience with enterprise-grade security, modular architecture, scalable microservice-friendly design, polished UI/UX, and a production-ready founder-friendly deployment plan.

## 1. Product Architecture

### Frontend
- React.js + Vite for performance and developer experience
- Tailwind CSS for utility-driven premium styling
- Framer Motion + GSAP for rich cinematic animation
- React Router for SPA navigation
- React Query for server-state caching and offline-friendly data fetching
- Zustand for lightweight local UI state and cart/session management
- React Hook Form + Zod for form validation and onboarding flows
- Axios/Fetch wrapper for secure API communication
- Cloudinary integration for image optimization and upload flows
- Dark/light theme toggle persisted in local storage

### Backend
- Node.js + Express.js REST API
- JWT + refresh tokens for auth
- Google OAuth integration
- Razorpay payment orchestration
- Security middleware: Helmet, rate limiting, CSRF, XSS sanitization, Mongo injection prevention
- Swagger/OpenAPI docs for every route

### Admin Panel App
- Separate admin application in `admin/`
- Dedicated secure UI for admin workflows
- Admin-only route isolation from user frontend
- Admin auth and session management using email + OTP and JWT
- Audit log, verification queue, booking management, and vehicle operations
- Admin panel deployed independently from frontend and backend

### Database
- MongoDB Atlas with a normalized-plus-embedded hybrid design
- Collections:
  - users
  - vehicles
  - bookings
  - payments
  - reviews
  - verificationDocuments
  - admins
  - auditLogs
  - notifications
- Indexes on email, mobile, booking reference, vehicle type/category, status, payment id
- Relationship references via ObjectId and denormalization for query performance

## 2. User Flow Diagrams

### Primary Customer Flow
1. Landing page discovery
2. Browse vehicles by category
3. Filter/search with debounced search and infinite scroll
4. View vehicle detail gallery and specs
5. Add to cart or book now
6. Complete user verification if required
7. Place booking and pay via Razorpay
8. Receive booking confirmation and invoice

### Verification Flow
1. Signup / login
2. Mobile OTP authentication
3. Upload identity docs based on nationality
4. Admin approves or rejects identity
5. Only verified users can book vehicles

## 3. Admin Flow Diagrams

### Admin Operations
1. Secure login via email + OTP
2. Dashboard shows active rentals, revenue, pending verifications, and audit logs
3. Manage vehicles: add, edit, archive, delete
4. Manage users: approve verification, reject, audit document history
5. Manage bookings: approve, reject, verify payment, follow-up status
6. View payment reconciliation and booking analytics

## 4. Database Design

### users
- _id
- firstName
- lastName
- email
- mobile
- country
- passwordHash
- authProvider
- role [customer|admin]
- verifiedStatus [pending|verified|rejected]
- verificationType [aadhaar|passport]
- documentReferences []
- cartItems []
- createdAt, updatedAt
- refreshToken

### vehicles
- _id
- name
- slug
- vehicleType [car|bike|scooter]
- category
- brand
- description
- pricePerDay
- availabilityStatus [available|unavailable|reserved]
- fuelType
- seats
- transmission
- mileage
- engine
- features [ac, abs, airbags, gps, etc.]
- images []
- specs
- rating
- reviewsCount
- bookingCount
- createdAt, updatedAt

### bookings
- _id
- bookingId
- userId
- vehicleId
- startDate, endDate
- rentalDays
- pricePerDay
- totalCost
- status [pending|confirmed|completed|cancelled|rejected]
- paymentId
- invoiceUrl
- verificationStatus
- createdAt, updatedAt

### payments
- _id
- bookingId
- userId
- razorpayOrderId
- razorpayPaymentId
- amount
- currency
- status
- method
- captured
- receiptUrl
- webhookVerified
- refundStatus
- createdAt, updatedAt

### reviews
- _id
- userId
- vehicleId
- rating
- title
- comment
- createdAt

### verificationDocuments
- _id
- userId
- nationality
- aadhaarNumber
- passportNumber
- documents {
    aadhaarFront,
    aadhaarBack,
    licenseFront,
    licenseBack,
    passportFront,
    passportBack
  }
- status [pending|verified|rejected]
- adminNotes
- submittedAt, reviewedAt

### admins
- _id
- email
- role
- lastLogin
- createdAt

### auditLogs
- _id
- adminId
- action
- targetType
- targetId
- summary
- metadata
- createdAt

### notifications
- _id
- userId
- type
- title
- message
- read
- createdAt

## 5. API Design

### Public API
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/otp/request`
- `POST /api/auth/otp/verify`
- `GET /api/vehicles`
- `GET /api/vehicles/:slug`
- `GET /api/vehicles/:id/availability`
- `GET /api/collections/:category`
- `GET /api/testimonials`
- `GET /api/faqs`

### User API
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/user/cart`
- `DELETE /api/user/cart/:vehicleId`
- `POST /api/user/verification`
- `GET /api/user/bookings`
- `POST /api/user/bookings`
- `GET /api/user/bookings/:id`
- `GET /api/user/notifications`

### Payment API
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/payments/webhook`
- `POST /api/payments/refund`

### Admin API (`/secure-admin-panel/api`)
- `POST /secure-admin-panel/api/auth/login`
- `POST /secure-admin-panel/api/auth/otp`
- `GET /secure-admin-panel/api/dashboard`
- `GET /secure-admin-panel/api/vehicles`
- `POST /secure-admin-panel/api/vehicles`
- `PUT /secure-admin-panel/api/vehicles/:id`
- `DELETE /secure-admin-panel/api/vehicles/:id`
- `GET /secure-admin-panel/api/users`
- `PUT /secure-admin-panel/api/users/:id/verify`
- `POST /secure-admin-panel/api/bookings/:id/approve`
- `POST /secure-admin-panel/api/bookings/:id/reject`
- `GET /secure-admin-panel/api/audit-logs`

## 6. Folder Structure

### Frontend
```
frontend/
  public/
  src/
    assets/
    animations/
    components/
      layout/
      ui/
      vehicles/
      auth/
      booking/
    contexts/
    features/
      auth/
      vehicles/
      bookings/
      cart/
      verification/
      payments/
    hooks/
    layouts/
    pages/
    routes/
    services/
    store/
    utils/
    validators/
    App.jsx
    main.jsx
  vite.config.js
  tailwind.config.js
  postcss.config.js
  package.json
```

### Backend
```
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    repositories/
    routes/
    services/
    utils/
    validators/
    jobs/
    docs/
    app.js
    server.js
  package.json
  swagger.yaml
```

### Admin Panel
```
admin/
  public/
  src/
    assets/
    components/
      layout/
      ui/
      dashboard/
      vehicles/
      users/
      bookings/
    contexts/
    hooks/
    layouts/
    pages/
      dashboard/
      vehicles/
      users/
      bookings/
      verifications/
      audits/
    routes/
    services/
    store/
    utils/
    validators/
    App.jsx
    main.jsx
  vite.config.js
  tailwind.config.js
  postcss.config.js
  package.json
```

## 7. Security Architecture
- `helmet` headers
- `express-rate-limit`
- `cookie-parser` + `csurf`
- `express-mongo-sanitize`
- input validation with `zod`
- secure JWT in `httpOnly`, `secure` cookies or Authorization headers
- refresh token rotation and expiry
- role-based access middleware
- Cloudinary signed upload presets, whitelist on backend
- strict CORS policy
- password hashing with `bcrypt`
- secure admin env config and hidden admin endpoints
- webhook signature validation for Razorpay

## 8. UI Wireframes

### Homepage
- Hero carousel with rotating vehicle categories
- New Arrivals grid with premium cards
- Luxury, Daily, Sports, EV, Bikes, Scooters, Family, Offroad collections as horizontal or masonry sections
- Testimonials with glass cards
- Booking journey storyboard with scroll animations
- FAQ + footer

### Vehicle Detail
- Full-screen image gallery
- Availability dot and premium spec cards
- Price calculator with rental days selector
- Reviews & ratings
- CTA buttons: Add to Cart, Book Now

### Auth / Verification
- Full-screen luxury form overlays
- Stepper for ID verification
- Document upload cards with placeholders
- Status badges and admin message alerts

### Admin Panel
- Dark secure admin theme
- Left navigation collapsed into icons
- Stats cards, booking tables, verification queue
- Vehicle and user management modals
- Audit log and booking timeline

## 9. Component Breakdown
- `Navbar`, `Footer`, `ThemeToggle`, `SearchBar`, `MobileMenu`
- `HeroShowcase`, `VehicleCard`, `CollectionSection`
- `VehicleFilterSidebar`, `InfiniteVehicleGrid`
- `VehicleGallery`, `SpecList`, `PriceCalculator`
- `BookingStepper`, `VerificationUploader`
- `TestimonialCarousel`, `FAQAccordion`
- `CartDrawer`, `CheckoutSummary`
- `AdminDashboardStats`, `AdminTable`, `AuditLogPanel`

## 10. State Management Strategy
- React Query for fetch/cache of vehicles, bookings, payments, user profile
- Zustand for UI state: theme, mobile menu, cart contents, search filter state
- Form state in React Hook Form + Zod schemas
- Local storage persistence for theme and cart
- API auth state from token/refresh token flow

## 11. Deployment Plan
- Frontend: Vercel connected to `frontend/` with environment variables for API base URL, Cloudinary, auth providers
- Backend: Render service for `backend/`, with environment variables for MongoDB Atlas, JWT secrets, Razorpay keys, Google OAuth, Cloudinary
- MongoDB Atlas cluster with production tier and IP access / secure connection string
- Cloudinary account media delivery and secure upload presets
- Swagger docs available through backend route `/api/docs`
- CI/CD via GitHub Actions or Render/Vercel auto-deploy

## Next Step
If this architecture is approved, I will scaffold the DriveX repository structure and then generate the production-ready frontend and backend modules incrementally.
